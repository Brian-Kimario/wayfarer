import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase/database.types";
import { z } from "zod";
import { scoreLabel } from "./format";

const PAGE_SIZE = 10;

export interface DisplayRoom {
  room_type_id: number;
  name: string;
  meal_plan: string;
  cancellation_policy: string;
  price_per_night: number;
  total_stay_price: number;
  rooms_left: number;
}

export interface PropertyResult {
  id: number;
  name: string;
  city: string;
  country: string;
  type: string;
  stars: number;
  address: string;
  distance_center_km: number;
  amenities: string[];
  hue: number;
  avg_score: number | null;
  review_count: number | null;
  score_label: string;
  wishlisted: boolean;
  display_room: DisplayRoom;
}

export interface SearchResults {
  total: number;
  page: number;
  page_size: number;
  nights: number;
  results: PropertyResult[];
}

export async function searchStays(
  client: SupabaseClient<Database>,
  params: Record<string, unknown>
): Promise<SearchResults> {
  const checkIn = (params.check_in as string) || "";
  const checkOut = (params.check_out as string) || "";
  const destination = (params.destination as string) || "";
  const guests = parseInt(String(params.guests || "2"), 10);
  const rooms = parseInt(String(params.rooms || "1"), 10);
  const page = parseInt(String(params.page || "1"), 10);

  if (!checkIn || !checkOut || !destination) {
    return { total: 0, page, page_size: PAGE_SIZE, nights: 0, results: [] };
  }

  const nights = Math.floor(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Call stay_offers RPC
  const { data: offers, error } = await client.rpc("stay_offers", {
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_rooms: rooms,
    p_city: destination,
  });

  if (error) {
    console.error("stay_offers error:", error);
    return { total: 0, page, page_size: PAGE_SIZE, nights, results: [] };
  }

  if (!offers || (offers as any[]).length === 0) {
    return { total: 0, page, page_size: PAGE_SIZE, nights, results: [] };
  }

  // Get unique property IDs from offers
  const propertyIds = [...new Set((offers as any[]).map((o) => o.property_id))];

  // Load properties
  const { data: properties } = await client
    .from("properties")
    .select("*")
    .in("id", propertyIds as number[]);

  if (!properties) {
    return { total: 0, page, page_size: PAGE_SIZE, nights, results: [] };
  }

  // Load ratings
  const { data: ratings } = await client
    .from("property_ratings")
    .select("*")
    .in("property_id", propertyIds as number[]);

  // Load room_types for display info
  const { data: roomTypes } = await client
    .from("room_types")
    .select("*")
    .in(
      "id",
      ((offers as any[]).map((o) => o.room_type_id) as number[])
    );

  // Check wishlist
  let wishlisted: Set<number> = new Set();
  const { data: user } = await client.auth.getUser();
  if (user.user) {
    const { data: wishlistData } = await client
      .from("wishlist")
      .select("property_id")
      .in("property_id", propertyIds as number[]);
    if (wishlistData) {
      wishlisted = new Set((wishlistData as any[]).map((w) => w.property_id));
    }
  }

  // Build results
  const results: PropertyResult[] = [];

  (properties as any[]).forEach((prop) => {
    const rating = (ratings as any[])?.find((r) => r.property_id === prop.id);
    const propOffers = (offers as any[]).filter((o) => o.property_id === prop.id);

    if (propOffers.length === 0) return;

    // Get cheapest offer as display room
    const displayOffer = propOffers.reduce((cheapest, room) =>
      room.price_per_night < cheapest.price_per_night ? room : cheapest
    );

    const roomType = (roomTypes as any[])?.find((r) => r.id === displayOffer.room_type_id);

    results.push({
      id: prop.id,
      name: prop.name,
      city: prop.city,
      country: prop.country,
      type: prop.type,
      stars: prop.stars,
      address: prop.address,
      distance_center_km: prop.distance_center_km,
      amenities: prop.amenities,
      hue: prop.hue,
      avg_score: rating?.avg_score || null,
      review_count: rating?.review_count || null,
      score_label: scoreLabel(rating?.avg_score),
      wishlisted: wishlisted.has(prop.id),
      display_room: {
        room_type_id: displayOffer.room_type_id,
        name: roomType?.name || "Room",
        meal_plan: roomType?.meal_plan || "room_only",
        cancellation_policy: roomType?.cancellation_policy || "free",
        price_per_night: displayOffer.price_per_night,
        total_stay_price: displayOffer.total,
        rooms_left: displayOffer.rooms_left,
      },
    });
  });

  // Sort
  const sort = (params.sort as string) || "recommended";
  if (sort === "price_asc") {
    results.sort((a, b) => a.display_room.price_per_night - b.display_room.price_per_night);
  } else if (sort === "price_desc") {
    results.sort((a, b) => b.display_room.price_per_night - a.display_room.price_per_night);
  } else if (sort === "rating") {
    results.sort((a, b) => (b.avg_score || 0) - (a.avg_score || 0));
  } else if (sort === "stars") {
    results.sort((a, b) => b.stars - a.stars);
  } else if (sort === "distance") {
    results.sort((a, b) => a.distance_center_km - b.distance_center_km);
  } else {
    // recommended: score*10 + stars*2 - distance
    results.sort((a, b) => {
      const scoreA = (a.avg_score || 0) * 10 + a.stars * 2 - a.distance_center_km;
      const scoreB = (b.avg_score || 0) * 10 + b.stars * 2 - b.distance_center_km;
      return scoreB - scoreA;
    });
  }

  // Paginate
  const startIdx = (page - 1) * PAGE_SIZE;
  const paginatedResults = results.slice(startIdx, startIdx + PAGE_SIZE);

  return {
    total: results.length,
    page,
    page_size: PAGE_SIZE,
    nights,
    results: paginatedResults,
  };
}

export async function getStay(
  client: SupabaseClient<Database>,
  id: number,
  params: Record<string, unknown>
): Promise<any> {
  const checkIn = (params.check_in as string) || "";
  const checkOut = (params.check_out as string) || "";

  // Load property
  const { data: property } = await client
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) return null;

  // Load rating
  const { data: rating } = await client
    .from("property_ratings")
    .select("*")
    .eq("property_id", id)
    .single();

  // Load reviews (latest 10)
  const { data: reviews } = await client
    .from("reviews")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Load room types with availability
  const { data: roomTypes } = await client
    .from("room_types")
    .select("*")
    .eq("property_id", id);

  let roomsWithAvailability: any[] = [];

  if (roomTypes && checkIn && checkOut) {
    const nights = Math.floor(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    roomsWithAvailability = await Promise.all(
      (roomTypes as any[]).map(async (rt) => {
        // Get availability
        const { data: availability } = await client.rpc("_rooms_left", {
          p_room_type_id: rt.id,
          p_in: checkIn,
          p_out: checkOut,
        });

        // Get quote
        const quoteParams: any = {
          p_type: "stay",
          p_room_type_id: rt.id,
          p_flight_id: null,
          p_check_in: checkIn,
          p_check_out: checkOut,
          p_units: 1,
        };
        const { data: quote } = await client.rpc("quote_booking", quoteParams);

        const availabilityNum: number = typeof availability === "number" ? availability : 0;
        const quoteData = quote && typeof quote === "object" ? quote : {};

        return {
          ...rt,
          rooms_left: availabilityNum as any,
          available: availabilityNum > 0,
          total_price: (quoteData as any).total,
          cancellation_text: (quoteData as any).cancellation_text,
        };
      })
    );
  } else {
    roomsWithAvailability = (roomTypes || []).map((rt) => ({
      ...rt,
      rooms_left: null as any,
      available: null,
    }));
  }

  return {
    ...property,
    rating,
    reviews,
    room_types: roomsWithAvailability,
  };
}

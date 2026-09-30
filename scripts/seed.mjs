/**
 * Seed script for Wayfarer database
 * Creates realistic properties, room types, and reviews for testing
 * Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const properties = [
  {
    name: "Serengeti Luxury Lodge",
    city: "Dar es Salaam",
    country: "Tanzania",
    type: "resort",
    stars: 5,
    address: "Msasani Peninsula, Dar es Salaam",
    description:
      "Exclusive beachfront resort with panoramic views of the Indian Ocean. Features infinity pool, world-class spa, and fine dining restaurants.",
    amenities: [
      "Wi-Fi",
      "Pool",
      "Spa",
      "Restaurant",
      "Beach access",
      "Fitness center",
      "Concierge",
      "Room service",
    ],
    distance_center_km: 8,
    hue: 200,
    rooms: [
      {
        name: "Ocean View Suite",
        bed_config: "King",
        max_guests: 2,
        quantity: 8,
        price_per_night: 450,
        meal_plan: "breakfast",
        cancellation_policy: "free",
      },
      {
        name: "Beach Bungalow",
        bed_config: "King + Sofabed",
        max_guests: 3,
        quantity: 5,
        price_per_night: 650,
        meal_plan: "half_board",
        cancellation_policy: "free",
      },
      {
        name: "Standard Room",
        bed_config: "Twin",
        max_guests: 2,
        quantity: 15,
        price_per_night: 220,
        meal_plan: "room_only",
        cancellation_policy: "partial",
      },
    ],
    reviews: [
      {
        author_name: "Sarah M.",
        score: 9.5,
        title: "Paradise found!",
        body: "Absolutely stunning location with incredible service. The sunset views from our suite were unforgettable.",
      },
      {
        author_name: "James K.",
        score: 9,
        title: "Excellent beach resort",
        body: "Beautiful property, great amenities, and attentive staff. Worth the price for a special occasion.",
      },
      {
        author_name: "Maria P.",
        score: 8.5,
        title: "Great experience overall",
        body: "Modern facilities, clean rooms, and good food. A bit pricey but the experience justifies it.",
      },
    ],
  },
  {
    name: "Zanzibar Stone Town Manor",
    city: "Zanzibar",
    country: "Tanzania",
    type: "hotel",
    stars: 4,
    address: "Stone Town, Zanzibar Island",
    description:
      "Historic hotel in the heart of Stone Town. Restored 19th-century building with modern amenities and authentic Swahili character.",
    amenities: ["Wi-Fi", "Restaurant", "Rooftop bar", "Library", "Concierge"],
    distance_center_km: 0.5,
    hue: 45,
    rooms: [
      {
        name: "Deluxe Room",
        bed_config: "King",
        max_guests: 2,
        quantity: 6,
        price_per_night: 280,
        meal_plan: "breakfast",
        cancellation_policy: "free",
      },
      {
        name: "Standard Room",
        bed_config: "Twin",
        max_guests: 2,
        quantity: 12,
        price_per_night: 150,
        meal_plan: "room_only",
        cancellation_policy: "partial",
      },
    ],
    reviews: [
      {
        author_name: "Emma L.",
        score: 8,
        title: "Authentic charm",
        body: "Love the historic setting and rooftop bar. Great location for exploring Stone Town.",
      },
      {
        author_name: "David N.",
        score: 7.5,
        title: "Good value for money",
        body: "Comfortable rooms, nice atmosphere. Some noise from the street but nothing a earplugs can't fix.",
      },
    ],
  },
  {
    name: "Nairobi Safari Heights",
    city: "Nairobi",
    country: "Kenya",
    type: "hotel",
    stars: 4,
    address: "Westlands, Nairobi",
    description:
      "Modern business hotel with rooftop infinity pool overlooking the Nairobi skyline. Perfect base for safari expeditions.",
    amenities: [
      "Wi-Fi",
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Business center",
      "Tour desk",
    ],
    distance_center_km: 3,
    hue: 45,
    rooms: [
      {
        name: "Executive Room",
        bed_config: "King",
        max_guests: 2,
        quantity: 10,
        price_per_night: 320,
        meal_plan: "breakfast",
        cancellation_policy: "free",
      },
      {
        name: "Standard Room",
        bed_config: "Queen",
        max_guests: 2,
        quantity: 20,
        price_per_night: 180,
        meal_plan: "room_only",
        cancellation_policy: "partial",
      },
    ],
    reviews: [
      {
        author_name: "Robert M.",
        score: 8.5,
        title: "Great for safari prep",
        body: "Excellent location and the tour desk really helped organize our safari. Clean and modern.",
      },
      {
        author_name: "Lisa T.",
        score: 8,
        title: "Good quality hotel",
        body: "Nice rooms, helpful staff, good facilities. A reliable choice in Nairobi.",
      },
    ],
  },
  {
    name: "Dubai Marina Pearl",
    city: "Dubai",
    country: "UAE",
    type: "apartment",
    stars: 5,
    address: "Dubai Marina, UAE",
    description:
      "Luxury serviced apartments with full facilities overlooking Marina Bay. Perfect for extended stays with kitchenette and premium linens.",
    amenities: [
      "Wi-Fi",
      "Kitchen",
      "Pool",
      "Gym",
      "Concierge",
      "Maid service",
      "Laundry",
    ],
    distance_center_km: 2,
    hue: 30,
    rooms: [
      {
        name: "One Bedroom Apartment",
        bed_config: "King",
        max_guests: 2,
        quantity: 12,
        price_per_night: 380,
        meal_plan: "room_only",
        cancellation_policy: "free",
      },
      {
        name: "Two Bedroom Apartment",
        bed_config: "King + Twin",
        max_guests: 4,
        quantity: 8,
        price_per_night: 580,
        meal_plan: "room_only",
        cancellation_policy: "free",
      },
    ],
    reviews: [
      {
        author_name: "Ahmed K.",
        score: 9,
        title: "Excellent for families",
        body: "Great apartments with full kitchens. Marina location is perfect. Highly recommended!",
      },
      {
        author_name: "Susan W.",
        score: 8.5,
        title: "Perfect for longer stays",
        body: "Felt like home. Spacious, well-equipped, and great value for Dubai.",
      },
    ],
  },
  {
    name: "Paris Left Bank Boutique",
    city: "Paris",
    country: "France",
    type: "hotel",
    stars: 4,
    address: "Latin Quarter, Paris",
    description:
      "Charming boutique hotel in the heart of the Latin Quarter. Walking distance to Sorbonne, Notre-Dame, and Luxembourg Garden.",
    amenities: ["Wi-Fi", "Restaurant", "Bar", "24-hour concierge", "Library"],
    distance_center_km: 1,
    hue: 280,
    rooms: [
      {
        name: "Parisian Suite",
        bed_config: "King",
        max_guests: 2,
        quantity: 5,
        price_per_night: 420,
        meal_plan: "breakfast",
        cancellation_policy: "free",
      },
      {
        name: "Deluxe Room",
        bed_config: "Queen",
        max_guests: 2,
        quantity: 10,
        price_per_night: 280,
        meal_plan: "breakfast",
        cancellation_policy: "partial",
      },
    ],
    reviews: [
      {
        author_name: "Michelle D.",
        score: 9,
        title: "Parisian perfection",
        body: "Quaint, romantic, perfectly located. Felt like staying at a friend's place. Magnifique!",
      },
      {
        author_name: "Pierre L.",
        score: 8.5,
        title: "True Paris experience",
        body: "Authentic French hospitality. Great breakfast. The neighborhood is wonderful.",
      },
    ],
  },
  {
    name: "Istanbul Golden Horn Residence",
    city: "Istanbul",
    country: "Turkey",
    type: "guesthouse",
    stars: 3,
    address: "Balat, Istanbul",
    description:
      "Cozy guesthouse in historic Balat neighborhood. Direct Golden Horn views, close to Fener and traditional Turkish markets.",
    amenities: [
      "Wi-Fi",
      "Shared kitchen",
      "Terrace",
      "Library",
      "Tour information",
    ],
    distance_center_km: 2,
    hue: 45,
    rooms: [
      {
        name: "Private Double",
        bed_config: "King",
        max_guests: 2,
        quantity: 4,
        price_per_night: 110,
        meal_plan: "room_only",
        cancellation_policy: "free",
      },
      {
        name: "Shared Dorm",
        bed_config: "Single bunk",
        max_guests: 1,
        quantity: 8,
        price_per_night: 45,
        meal_plan: "room_only",
        cancellation_policy: "non_refundable",
      },
    ],
    reviews: [
      {
        author_name: "Yuki T.",
        score: 8,
        title: "Charming neighborhood escape",
        body: "Wonderful guesthouse in an authentic part of Istanbul. Great value and friendly hosts.",
      },
      {
        author_name: "Marco R.",
        score: 7.5,
        title: "Good budget option",
        body: "Simple but clean. Location is excellent for exploring. Meeting other travelers was fun.",
      },
    ],
  },
  {
    name: "Delhi Raj Palace Retreat",
    city: "Delhi",
    country: "India",
    type: "hotel",
    stars: 4,
    address: "South Delhi, New Delhi",
    description:
      "Upscale heritage hotel with Mughal-inspired architecture. Luxury spa, rooftop garden, and authentic Indian cuisine.",
    amenities: [
      "Wi-Fi",
      "Spa",
      "Pool",
      "Restaurant",
      "Rooftop garden",
      "Concierge",
      "Library",
    ],
    distance_center_km: 4,
    hue: 60,
    rooms: [
      {
        name: "Maharaja Suite",
        bed_config: "King",
        max_guests: 2,
        quantity: 6,
        price_per_night: 380,
        meal_plan: "breakfast",
        cancellation_policy: "free",
      },
      {
        name: "Deluxe Room",
        bed_config: "Queen",
        max_guests: 2,
        quantity: 16,
        price_per_night: 200,
        meal_plan: "room_only",
        cancellation_policy: "partial",
      },
    ],
    reviews: [
      {
        author_name: "Priya S.",
        score: 8.5,
        title: "Luxurious Indian experience",
        body: "Beautiful property with authentic touches. Spa is fantastic. Staff was very helpful.",
      },
      {
        author_name: "Arjun K.",
        score: 8,
        title: "Heritage meets modern",
        body: "Great location, excellent food, very clean. A gem in Delhi.",
      },
    ],
  },
  {
    name: "Chandigarh Himalayan View Hotel",
    city: "Chandigarh",
    country: "India",
    type: "hotel",
    stars: 3,
    address: "Sector 22, Chandigarh",
    description:
      "Modern business hotel with views of the foothills. Well-organized rooms, good connectivity, near shopping districts.",
    amenities: ["Wi-Fi", "Restaurant", "Bar", "Gym", "Business center"],
    distance_center_km: 2,
    hue: 200,
    rooms: [
      {
        name: "Executive Room",
        bed_config: "King",
        max_guests: 2,
        quantity: 8,
        price_per_night: 180,
        meal_plan: "breakfast",
        cancellation_policy: "partial",
      },
      {
        name: "Standard Room",
        bed_config: "Twin",
        max_guests: 2,
        quantity: 12,
        price_per_night: 110,
        meal_plan: "room_only",
        cancellation_policy: "partial",
      },
    ],
    reviews: [
      {
        author_name: "Ravi P.",
        score: 7.5,
        title: "Decent for business travel",
        body: "Good rooms, efficient service. Food could be better but overall a solid choice.",
      },
      {
        author_name: "Neha M.",
        score: 7,
        title: "Average but reliable",
        body: "Basic amenities, clean rooms. Nothing fancy but good value.",
      },
    ],
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    for (const prop of properties) {
      console.log(`Adding property: ${prop.name} (${prop.city})`);

      // Insert property
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .insert({
          name: prop.name,
          city: prop.city,
          country: prop.country,
          type: prop.type,
          stars: prop.stars,
          address: prop.address,
          description: prop.description,
          amenities: prop.amenities,
          distance_center_km: prop.distance_center_km,
          hue: prop.hue,
        })
        .select()
        .single();

      if (propertyError) {
        console.error(`❌ Error inserting property: ${propertyError.message}`);
        continue;
      }

      const propertyId = propertyData.id;

      // Insert room types
      for (const room of prop.rooms) {
        const { error: roomError } = await supabase
          .from("room_types")
          .insert({
            property_id: propertyId,
            name: room.name,
            bed_config: room.bed_config,
            max_guests: room.max_guests,
            quantity: room.quantity,
            price_per_night: room.price_per_night,
            meal_plan: room.meal_plan,
            cancellation_policy: room.cancellation_policy,
          });

        if (roomError) {
          console.error(`❌ Error inserting room: ${roomError.message}`);
        }
      }

      // Insert reviews
      for (const review of prop.reviews) {
        const { error: reviewError } = await supabase
          .from("reviews")
          .insert({
            property_id: propertyId,
            author_name: review.author_name,
            score: review.score,
            title: review.title,
            body: review.body,
          });

        if (reviewError) {
          console.error(`❌ Error inserting review: ${reviewError.message}`);
        }
      }

      console.log(
        `✅ Added ${prop.rooms.length} room types and ${prop.reviews.length} reviews\n`
      );
    }

    console.log("✨ Database seeding completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   • ${properties.length} properties created`);
    console.log(
      `   • ${properties.reduce((sum, p) => sum + p.rooms.length, 0)} room types created`
    );
    console.log(
      `   • ${properties.reduce((sum, p) => sum + p.reviews.length, 0)} reviews created`
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();

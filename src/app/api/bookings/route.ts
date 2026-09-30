import { createRequestClient } from "@/lib/supabase/request";
import { apiError, apiSuccess, getErrorResponse } from "@/lib/errors";
import { authorizePayment, getCardLast4 } from "@/lib/payment";
import { z } from "zod";

const createBookingSchema = z.object({
  type: z.enum(["stay", "flight"]),
  room_type_id: z.number().optional(),
  flight_id: z.number().optional(),
  check_in: z.string(),
  check_out: z.string(),
  rooms: z.number().optional(),
  seats: z.number().optional(),
  guests: z.number(),
  lead_guest: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  payment: z.object({
    card_number: z.string(),
    expiry: z.string(),
    cvc: z.string(),
  }),
  trip_id: z.number().optional(),
});

const getBookingsSchema = z.object({
  status: z.enum(["upcoming", "past", "cancelled"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createBookingSchema.parse(body);

    const client = await createRequestClient(request.headers.get("authorization") || undefined);

    // Get user
    const { data: user, error: userError } = await client.auth.getUser();
    if (!user.user) {
      return apiError(401, "UNAUTHENTICATED");
    }

    // Validate and authorize payment
    const authError = authorizePayment(validated.payment);
    if (authError) {
      const { status, body: errorBody } = getErrorResponse(authError);
      return apiError(status, authError);
    }

    // Call create_booking RPC
    const createBookingParams: any = {
      p_type: validated.type,
      p_room_type_id: validated.room_type_id || null,
      p_flight_id: validated.flight_id || null,
      p_start: validated.check_in,
      p_end: validated.check_out,
      p_guests: validated.guests,
      p_units: validated.rooms || validated.seats || 1,
      p_lead_name: validated.lead_guest.name,
      p_lead_email: validated.lead_guest.email,
      p_card_last4: getCardLast4(validated.payment.card_number),
      p_trip_id: validated.trip_id || null,
    };
    
    const { data: booking, error } = await client.rpc("create_booking", createBookingParams);

    if (error) {
      const { status, body: errorBody } = getErrorResponse(error.message);
      return apiError(status, error.message);
    }

    return apiSuccess(booking, 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return apiError(400, "INVALID_INPUT", "Invalid request data");
    }
    console.error("Booking error:", err);
    return apiError(500, "SERVER_ERROR");
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as string | undefined;

    const client = await createRequestClient(request.headers.get("authorization") || undefined);

    // Get user
    const { data: user } = await client.auth.getUser();
    if (!user.user) {
      return apiError(401, "UNAUTHENTICATED");
    }

    // Get bookings for this user
    let query = client
      .from("bookings")
      .select("*")
      .eq("user_id", user.user.id)
      .order("start_date", { ascending: false });

    // Filter by status
    if (status === "upcoming") {
      query = query
        .eq("status", "confirmed")
        .gte("start_date", new Date().toISOString().split("T")[0]);
    } else if (status === "past") {
      query = query
        .eq("status", "confirmed")
        .lt("start_date", new Date().toISOString().split("T")[0]);
    } else if (status === "cancelled") {
      query = query.eq("status", "cancelled");
    }

    const { data: bookings, error } = await query;

    if (error) {
      throw error;
    }

    return apiSuccess(bookings || []);
  } catch (err) {
    console.error("Get bookings error:", err);
    return apiError(500, "SERVER_ERROR");
  }
}

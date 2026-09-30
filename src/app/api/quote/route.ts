import { createRequestClient } from "@/lib/supabase/request";
import { apiError, apiSuccess, getErrorResponse } from "@/lib/errors";
import { z } from "zod";

const quoteBodySchema = z.object({
  type: z.enum(["stay", "flight"]),
  room_type_id: z.number().optional(),
  flight_id: z.number().optional(),
  check_in: z.string(),
  check_out: z.string(),
  rooms: z.number().optional(),
  seats: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = quoteBodySchema.parse(body);

    const client = await createRequestClient(request.headers.get("authorization") || undefined);

    const quoteParams: any = {
      p_type: validated.type,
      p_room_type_id: validated.room_type_id || null,
      p_flight_id: validated.flight_id || null,
      p_check_in: validated.check_in,
      p_check_out: validated.check_out,
      p_units: validated.rooms || validated.seats || 1,
    };

    const { data, error } = await client.rpc("quote_booking", quoteParams);

    if (error) {
      const { status, body: errorBody } = getErrorResponse(error.message);
      return apiError(status, error.message);
    }

    return apiSuccess(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return apiError(400, "INVALID_INPUT", "Invalid request data");
    }
    console.error("Quote error:", err);
    return apiError(500, "SERVER_ERROR");
  }
}

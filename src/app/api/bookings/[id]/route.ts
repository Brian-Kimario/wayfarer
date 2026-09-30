import { createRequestClient } from "@/lib/supabase/request";
import { apiError, apiSuccess } from "@/lib/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return apiError(400, "INVALID_INPUT");
    }

    const client = await createRequestClient(request.headers.get("authorization") || undefined);

    // Get user
    const { data: user } = await client.auth.getUser();
    if (!user.user) {
      return apiError(401, "UNAUTHENTICATED");
    }

    // Get booking (RLS will filter to owned only)
    const { data: booking, error } = await client
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.user.id)
      .single();

    if (error || !booking) {
      return apiError(404, "NOT_FOUND");
    }

    return apiSuccess(booking);
  } catch (err) {
    console.error("Get booking error:", err);
    return apiError(500, "SERVER_ERROR");
  }
}

import { createRequestClient } from "@/lib/supabase/request";
import { apiError, apiSuccess, getErrorResponse } from "@/lib/errors";

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

    // Call preview_cancellation RPC
    const { data, error } = await client.rpc("preview_cancellation", {
      p_booking_id: bookingId,
    });

    if (error) {
      const { status } = getErrorResponse(error.message);
      return apiError(status, error.message);
    }

    if (!data || data.length === 0) {
      return apiError(404, "NOT_FOUND");
    }

    return apiSuccess(data[0]);
  } catch (err) {
    console.error("Refund preview error:", err);
    return apiError(500, "SERVER_ERROR");
  }
}

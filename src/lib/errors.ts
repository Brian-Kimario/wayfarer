export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

const errorMap: Record<string, { status: number; message: string }> = {
  UNAUTHENTICATED: { status: 401, message: "You must be signed in" },
  INVALID_INPUT: { status: 400, message: "Invalid request data" },
  INVALID_DATES: { status: 400, message: "Invalid dates" },
  CAPACITY_EXCEEDED: { status: 400, message: "Too many guests for selected rooms" },
  ALREADY_STARTED: { status: 400, message: "This booking has already started" },
  INVALID_CARD: { status: 400, message: "Invalid card number" },
  CARD_EXPIRED: { status: 400, message: "Card has expired" },
  PAYMENT_DECLINED: { status: 402, message: "Payment was declined" },
  FORBIDDEN: { status: 403, message: "You do not have permission" },
  NOT_A_GUEST: { status: 403, message: "You must have a booking at this property to review it" },
  NOT_FOUND: { status: 404, message: "Not found" },
  SOLD_OUT: { status: 409, message: "Sold out for your dates" },
  ALREADY_CANCELLED: { status: 409, message: "Booking is already cancelled" },
  ALREADY_REVIEWED: { status: 409, message: "You have already reviewed this property" },
  NOT_MODIFIABLE: { status: 409, message: "This booking cannot be modified" },
};

export function getErrorResponse(code: string): { status: number; body: ApiError } {
  const error = errorMap[code] || { status: 500, message: "Server error" };
  return {
    status: error.status,
    body: {
      error: {
        code,
        message: error.message,
      },
    },
  };
}

export function apiError(status: number, code: string, message?: string): Response {
  return new Response(
    JSON.stringify({
      error: {
        code,
        message: message || errorMap[code]?.message || "Server error",
      },
    }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export function apiSuccess<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

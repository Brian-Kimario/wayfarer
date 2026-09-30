"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { formatMoney, formatDate } from "@/lib/format";
import {
  Container,
  Button,
  Input,
  Card,
  LoadingSkeleton,
  ErrorState,
} from "@/components";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"details" | "payment" | "review">(
    "details"
  );

  const roomTypeId = searchParams.get("room_type_id");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  useEffect(() => {
    const checkAuth = async () => {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        router.push(`/login?next=/checkout${window.location.search}`);
        return;
      }
      setUser(user);

      // Get quote
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "stay",
          room_type_id: parseInt(roomTypeId || "0"),
          check_in: checkIn,
          check_out: checkOut,
          rooms: parseInt(rooms || "1"),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setQuote(data);
        setLoading(false);
      } else {
        setError(data.error?.message || "Failed to get quote");
        setLoading(false);
      }
    };

    setLoading(true);
    checkAuth();
  }, [router, roomTypeId, checkIn, checkOut, rooms]);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const client = createClient();
      const { data: { session } } = await client.auth.getSession();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          type: "stay",
          room_type_id: parseInt(roomTypeId || "0"),
          check_in: checkIn,
          check_out: checkOut,
          guests: parseInt(guests || "2"),
          rooms: parseInt(rooms || "1"),
          lead_guest: {
            name: formData.get("name"),
            email: formData.get("email"),
          },
          payment: {
            card_number: formData.get("card_number"),
            expiry: formData.get("expiry"),
            cvc: formData.get("cvc"),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || "Booking failed");
        setSubmitLoading(false);
        return;
      }

      router.push(`/confirmation/${data.id}`);
    } catch (err) {
      setError("An error occurred while processing your booking");
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--color-ivory)" }} className="flex-1 py-12">
        <Container>
          <LoadingSkeleton variant="card" count={2} />
        </Container>
      </div>
    );
  }

  if (!user || !quote) {
    return (
      <div style={{ backgroundColor: "var(--color-ivory)" }} className="flex-1 py-12">
        <Container>
          <ErrorState
            title="Could not load checkout"
            description="There was an issue loading your booking details. Please try again."
            action={{
              label: "Go back",
              onClick: () => router.back(),
            }}
          />
        </Container>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-ivory)" }}>
      {/* Progress Indicator */}
      <div
        className="py-6 md:py-8 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Container>
          <div className="flex items-center justify-center gap-8">
            <div
              className={`flex flex-col items-center ${
                step === "details"
                  ? "text-[var(--color-ocean-700)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === "details"
                    ? "bg-[var(--color-ocean-700)] text-white"
                    : "bg-[var(--color-surface)]"
                }`}
              >
                1
              </div>
              <p className="text-xs mt-2 font-medium">Details</p>
            </div>

            <div className="h-0.5 w-12 bg-[var(--color-border)]" />

            <div
              className={`flex flex-col items-center ${
                step === "review"
                  ? "text-[var(--color-ocean-700)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === "review"
                    ? "bg-[var(--color-ocean-700)] text-white"
                    : "bg-[var(--color-surface)]"
                }`}
              >
                2
              </div>
              <p className="text-xs mt-2 font-medium">Review & Pay</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <Container>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="md:col-span-2">
              <form onSubmit={handleCheckout} className="space-y-6">
                {error && (
                  <ErrorState
                    title="Booking error"
                    description={error}
                  />
                )}

                {/* Guest Details */}
                <Card>
                  <div className="p-6">
                    <h2
                      className="text-xl font-bold mb-6"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Guest details
                    </h2>

                    <div className="space-y-4">
                      <Input
                        label="Full name"
                        type="text"
                        name="name"
                        required
                        defaultValue={user.user_metadata?.name || ""}
                        fullWidth
                      />

                      <Input
                        label="Email address"
                        type="email"
                        name="email"
                        required
                        defaultValue={user.email || ""}
                        fullWidth
                      />
                    </div>
                  </div>
                </Card>

                {/* Payment Details */}
                <Card>
                  <div className="p-6">
                    <h2
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Payment information
                    </h2>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--color-muted)" }}
                    >
                      This is a demo booking. Use card 4242 4242 4242 4242,
                      any future expiry date, and any 3-digit CVC.
                    </p>

                    <div className="space-y-4">
                      <Input
                        label="Card number"
                        type="text"
                        name="card_number"
                        placeholder="1234 5678 9012 3456"
                        required
                        fullWidth
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Expiry date (MM/YY)"
                          type="text"
                          name="expiry"
                          placeholder="12/25"
                          required
                        />

                        <Input
                          label="CVC"
                          type="text"
                          name="cvc"
                          placeholder="123"
                          required
                        />
                      </div>

                      <p
                        className="text-xs"
                        style={{ color: "var(--color-muted)" }}
                      >
                        ✓ Your payment information is secure and encrypted
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    size="lg"
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={submitLoading}
                    disabled={submitLoading}
                    size="lg"
                    fullWidth
                  >
                    Confirm and pay
                  </Button>
                </div>
              </form>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <div className="p-6">
                  <h2
                    className="text-lg font-bold mb-6"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Booking summary
                  </h2>

                  {/* Dates & Details */}
                  <div
                    className="pb-6 mb-6"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: "var(--color-muted)" }}>
                          Check-in
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {formatDate(checkIn || "")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "var(--color-muted)" }}>
                          Check-out
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {formatDate(checkOut || "")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: "var(--color-muted)" }}>
                          Guests
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {guests}
                        </span>
                      </div>
                      {quote.cancellation_text && (
                        <div className="flex justify-between pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                          <span style={{ color: "var(--color-muted)" }}>
                            Cancellation
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "var(--color-success)" }}
                          >
                            {quote.cancellation_text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div
                    className="pb-6 mb-6 space-y-3 text-sm"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-muted)" }}>
                        Subtotal
                      </span>
                      <span style={{ color: "var(--color-ink)" }}>
                        {formatMoney(quote.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-muted)" }}>
                        Taxes & fees
                      </span>
                      <span style={{ color: "var(--color-ink)" }}>
                        {formatMoney(quote.taxes)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Total
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-sunset)" }}
                    >
                      {formatMoney(quote.total)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

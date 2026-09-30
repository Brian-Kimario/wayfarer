"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { formatMoney, formatDate } from "@/lib/format";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      } else {
        setError(data.error?.message || "Failed to get quote");
      }
    };

    checkAuth();
  }, [router, roomTypeId, checkIn, checkOut, rooms]);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
        return;
      }

      router.push(`/confirmation/${data.id}`);
    } catch (err) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  if (!user || !quote) {
    return <div className="flex-1 max-w-6xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="flex-1" style={{ backgroundColor: "var(--page)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "var(--ink)" }}>
          Complete your booking
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded border p-6" style={{ borderColor: "var(--line)" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--ink)" }}>
                Your details
              </h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={user.user_metadata?.name || ""}
                    className="w-full px-4 py-2 border rounded text-sm"
                    style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={user.email || ""}
                    className="w-full px-4 py-2 border rounded text-sm"
                    style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-4" style={{ color: "var(--ink)" }}>
                    Payment details
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
                    Test card: 4242 4242 4242 4242, any future expiry, any CVC
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                        Card number
                      </label>
                      <input
                        type="text"
                        name="card_number"
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-2 border rounded text-sm"
                        style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="12/25"
                          required
                          className="w-full px-4 py-2 border rounded text-sm"
                          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cvc"
                          placeholder="123"
                          required
                          className="w-full px-4 py-2 border rounded text-sm"
                          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && <p style={{ color: "var(--alert)" }} className="text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded text-white font-500"
                  style={{ backgroundColor: "var(--action)" }}
                >
                  {loading ? "Processing..." : "Confirm and pay"}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded border p-6 h-fit sticky top-20" style={{ borderColor: "var(--line)" }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--ink)" }}>
              Order summary
            </h2>

            <div className="space-y-2 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Check in</span>
                <span style={{ color: "var(--ink)" }}>{formatDate(checkIn || "")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Check out</span>
                <span style={{ color: "var(--ink)" }}>{formatDate(checkOut || "")}</span>
              </div>
              {quote.cancellation_text && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted)" }}>Cancellation</span>
                  <span style={{ color: "var(--good)" }}>{quote.cancellation_text}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span style={{ color: "var(--ink)" }}>{formatMoney(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Taxes & fees</span>
                <span style={{ color: "var(--ink)" }}>{formatMoney(quote.taxes)}</span>
              </div>
            </div>

            <div className="py-4 flex justify-between">
              <span className="font-bold" style={{ color: "var(--ink)" }}>
                Total
              </span>
              <span className="font-bold text-lg" style={{ color: "var(--brand)" }}>
                {formatMoney(quote.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

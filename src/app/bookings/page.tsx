"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { formatDate, formatMoney } from "@/lib/format";
import Link from "next/link";

export default function BookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [refundPreview, setRefundPreview] = useState<any>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        router.push("/login?next=/bookings");
        return;
      }
      setUser(user);

      // Fetch bookings
      fetchBookings(tab, user.id);
    };

    checkAuth();
  }, [router, tab]);

  const fetchBookings = async (status: string, userId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings?status=${status}`);
      const data = await response.json();

      if (response.ok) {
        setBookings(data);
      } else {
        setError(data.error?.message || "Failed to load bookings");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const openCancelDialog = async (booking: any) => {
    setSelectedBooking(booking);
    setCancelError("");

    // Fetch refund preview
    try {
      const response = await fetch(`/api/bookings/${booking.id}/refund-preview`);
      const data = await response.json();

      if (response.ok) {
        setRefundPreview(data);
      } else {
        setCancelError(data.error?.message || "Failed to load refund preview");
      }
    } catch (err) {
      setCancelError("An error occurred");
    }

    setShowCancelDialog(true);
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;

    setCancelLoading(true);
    setCancelError("");

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}/cancel`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setShowCancelDialog(false);
        setSelectedBooking(null);
        setRefundPreview(null);
        // Refresh bookings
        await fetchBookings(tab, user.id);
      } else {
        setCancelError(data.error?.message || "Failed to cancel booking");
      }
    } catch (err) {
      setCancelError("An error occurred");
    } finally {
      setCancelLoading(false);
    }
  };

  if (!user) {
    return <div className="flex-1 max-w-6xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="flex-1" style={{ backgroundColor: "var(--page)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "var(--ink)" }}>
          My bookings
        </h1>

        {/* Tabs */}
        <div
          className="flex gap-0 mb-8 rounded border overflow-hidden"
          style={{ borderColor: "var(--line)" }}
        >
          {(["upcoming", "past", "cancelled"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 px-4 text-sm font-500 border-r"
              style={{
                backgroundColor: tab === t ? "var(--brand)" : "white",
                color: tab === t ? "white" : "var(--ink)",
                borderColor: tab === t ? "var(--brand)" : "var(--line)",
                borderRightColor: t === "cancelled" ? "transparent" : "var(--line)",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 p-4 rounded text-sm"
            style={{ backgroundColor: "#fee", color: "var(--alert)" }}
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ color: "var(--muted)" }} className="text-center py-8">
            Loading bookings...
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: "var(--muted)" }} className="mb-4">
              {tab === "upcoming"
                ? "You have no upcoming bookings"
                : tab === "past"
                ? "You have no past bookings"
                : "You have no cancelled bookings"}
            </p>
            {tab === "upcoming" && (
              <Link href="/" className="text-sm font-500" style={{ color: "var(--action)" }}>
                Start booking →
              </Link>
            )}
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded border p-6"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                      Booking code
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--ink)" }}>
                      {booking.code}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-xs font-500 px-3 py-1 rounded inline-block"
                      style={{
                        backgroundColor:
                          booking.status === "confirmed"
                            ? "var(--page)"
                            : booking.status === "cancelled"
                            ? "#fee"
                            : "var(--page)",
                        color:
                          booking.status === "confirmed"
                            ? "var(--good)"
                            : booking.status === "cancelled"
                            ? "var(--alert)"
                            : "var(--ink)",
                      }}
                    >
                      {booking.status === "confirmed"
                        ? "✓ Confirmed"
                        : booking.status === "cancelled"
                        ? "✗ Cancelled"
                        : booking.status}
                    </p>
                  </div>
                </div>

                <div
                  className="grid md:grid-cols-2 gap-4 pb-4 mb-4"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <div>
                    <p className="text-xs font-500 mb-1" style={{ color: "var(--muted)" }}>
                      Check in
                    </p>
                    <p style={{ color: "var(--ink)" }}>{formatDate(booking.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-500 mb-1" style={{ color: "var(--muted)" }}>
                      Check out
                    </p>
                    <p style={{ color: "var(--ink)" }}>{formatDate(booking.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-500 mb-1" style={{ color: "var(--muted)" }}>
                      Guest name
                    </p>
                    <p style={{ color: "var(--ink)" }}>{booking.lead_guest_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-500 mb-1" style={{ color: "var(--muted)" }}>
                      Guests / Units
                    </p>
                    <p style={{ color: "var(--ink)" }}>
                      {booking.guests} guests, {booking.units} unit{booking.units > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-500 mb-1" style={{ color: "var(--muted)" }}>
                      Total paid
                    </p>
                    <p className="font-bold text-lg" style={{ color: "var(--brand)" }}>
                      {formatMoney(booking.total)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === "confirmed" &&
                      new Date(booking.start_date) > new Date() && (
                        <button
                          onClick={() => openCancelDialog(booking)}
                          className="px-4 py-2 rounded text-sm font-500 border"
                          style={{ borderColor: "var(--alert)", color: "var(--alert)" }}
                        >
                          Cancel booking
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel dialog */}
      {showCancelDialog && selectedBooking && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => !cancelLoading && setShowCancelDialog(false)}
        >
          <div
            className="bg-white rounded max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--ink)" }}>
              Cancel booking?
            </h2>

            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Booking code: <strong>{selectedBooking.code}</strong>
            </p>

            {refundPreview && (
              <div className="bg-gray-50 rounded p-4 mb-4" style={{ backgroundColor: "var(--page)" }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--muted)" }}>Original total</span>
                  <span style={{ color: "var(--ink)" }}>{formatMoney(selectedBooking.total)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "var(--muted)" }}>Cancellation fee</span>
                  <span style={{ color: "var(--alert)" }}>
                    {formatMoney(refundPreview.cancellation_fee)}
                  </span>
                </div>
                <div
                  className="flex justify-between font-bold"
                  style={{ borderTop: "1px solid var(--line)", paddingTop: "8px" }}
                >
                  <span style={{ color: "var(--ink)" }}>Refund amount</span>
                  <span style={{ color: "var(--good)" }}>
                    {formatMoney(refundPreview.refund_amount)}
                  </span>
                </div>
              </div>
            )}

            {cancelError && (
              <p style={{ color: "var(--alert)" }} className="text-sm mb-4">
                {cancelError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelLoading}
                className="flex-1 py-2 rounded text-sm font-500 border"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              >
                Keep booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex-1 py-2 rounded text-sm font-500 text-white"
                style={{ backgroundColor: "var(--alert)" }}
              >
                {cancelLoading ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

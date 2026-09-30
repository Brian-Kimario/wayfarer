"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { formatDate, formatMoney } from "@/lib/format";
import Link from "next/link";
import {
  Button,
  Card,
  Badge,
  Container,
  Modal,
  EmptyState,
  CalendarIcon,
  GuestsIcon,
  RoomsIcon,
  AirplaneIcon,
  CheckmarkIcon,
  CancelIcon,
} from "@/components";

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
    return (
      <div className="flex-1" style={{ backgroundColor: "var(--color-ivory)" }}>
        <Container className="py-12">
          <div style={{ color: "var(--color-muted)" }} className="text-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-current border-t-transparent rounded-full"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ backgroundColor: "var(--color-ivory)" }}>
      {/* Header Section */}
      <section
        className="py-8 md:py-12"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Container>
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: "var(--color-ink)" }}
          >
            My Bookings
          </h1>
          <p
            className="text-lg"
            style={{ color: "var(--color-muted)" }}
          >
            Manage and track all your reservations
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <Container>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            {(["upcoming", "past", "cancelled"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor:
                    tab === t ? "var(--color-ocean-700)" : "white",
                  color: tab === t ? "white" : "var(--color-ink)",
                  border:
                    tab === t
                      ? "none"
                      : "1px solid var(--color-border)",
                }}
              >
                {t === "upcoming" && (
                  <>
                    <AirplaneIcon size={18} />
                    Upcoming
                  </>
                )}
                {t === "past" && (
                  <>
                    <CheckmarkIcon size={18} />
                    Past
                  </>
                )}
                {t === "cancelled" && (
                  <>
                    <CancelIcon size={18} />
                    Cancelled
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg text-sm"
              style={{ backgroundColor: "#fee", color: "var(--color-error)" }}
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ color: "var(--color-muted)" }} className="text-center py-12">
              <div className="animate-spin inline-block w-6 h-6 border-3 border-current border-t-transparent rounded-full"></div>
              <p className="mt-2">Loading your bookings...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && bookings.length === 0 && (
            <EmptyState
              icon={
                tab === "upcoming"
                  ? "beach"
                  : tab === "past"
                  ? "list"
                  : "search"
              }
              title={
                tab === "upcoming"
                  ? "No upcoming bookings"
                  : tab === "past"
                  ? "No past bookings"
                  : "No cancelled bookings"
              }
              description={
                tab === "upcoming"
                  ? "Ready for your next adventure?"
                  : "Check back for past and cancelled bookings."
              }
              action={
                tab === "upcoming"
                  ? {
                      label: "Start exploring",
                      href: "/",
                    }
                  : undefined
              }
            />
          )}

          {/* Bookings list */}
          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className="text-xl font-bold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {booking.code}
                          </h3>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "success"
                                : booking.status === "cancelled"
                                ? "error"
                                : "info"
                            }
                          >
                            {booking.status === "confirmed"
                              ? "✓ Confirmed"
                              : booking.status === "cancelled"
                              ? "✕ Cancelled"
                              : booking.status}
                          </Badge>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {booking.lead_guest_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "var(--color-ocean-700)" }}
                        >
                          {formatMoney(booking.total)}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-muted)" }}
                        >
                          Total paid
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 mb-6"
                      style={{
                        borderTop: "1px solid var(--color-border)",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarIcon size={16} color="var(--color-muted)" />
                          <p
                            className="text-xs font-600"
                            style={{ color: "var(--color-muted)" }}
                          >
                            CHECK IN
                          </p>
                        </div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {formatDate(booking.start_date)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarIcon size={16} color="var(--color-muted)" />
                          <p
                            className="text-xs font-600"
                            style={{ color: "var(--color-muted)" }}
                          >
                            CHECK OUT
                          </p>
                        </div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {formatDate(booking.end_date)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <GuestsIcon size={16} color="var(--color-muted)" />
                          <p
                            className="text-xs font-600"
                            style={{ color: "var(--color-muted)" }}
                          >
                            GUESTS
                          </p>
                        </div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {booking.guests}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <RoomsIcon size={16} color="var(--color-muted)" />
                          <p
                            className="text-xs font-600"
                            style={{ color: "var(--color-muted)" }}
                          >
                            ROOMS
                          </p>
                        </div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {booking.units} {booking.units === 1 ? "room" : "rooms"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {booking.status === "confirmed" &&
                        new Date(booking.start_date) > new Date() && (
                          <Button
                            onClick={() => openCancelDialog(booking)}
                            variant="danger"
                            size="sm"
                          >
                            Cancel booking
                          </Button>
                        )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </main>

      {/* Cancel Modal */}
      {showCancelDialog && selectedBooking && (
        <Modal isOpen={true} onClose={() => !cancelLoading && setShowCancelDialog(false)}>
          <div className="max-w-md w-full">
            <h2
              className="text-lg font-bold mb-4"
              style={{ color: "var(--color-ink)" }}
            >
              Cancel this booking?
            </h2>

            <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
              Booking code: <strong>{selectedBooking.code}</strong>
            </p>

            {refundPreview && (
              <Card className="mb-6">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-muted)" }}>
                      Original total
                    </span>
                    <span style={{ color: "var(--color-ink)" }}>
                      {formatMoney(selectedBooking.total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--color-muted)" }}>
                      Cancellation fee
                    </span>
                    <span style={{ color: "var(--color-error)" }}>
                      {formatMoney(refundPreview.cancellation_fee)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between font-bold pt-2"
                    style={{
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <span style={{ color: "var(--color-ink)" }}>
                      Refund amount
                    </span>
                    <span style={{ color: "var(--color-success)" }}>
                      {formatMoney(refundPreview.refund_amount)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {cancelError && (
              <div
                className="mb-4 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "#fee",
                  color: "var(--color-error)",
                }}
              >
                {cancelError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelLoading}
                variant="secondary"
                className="flex-1"
              >
                Keep booking
              </Button>
              <Button
                onClick={handleCancel}
                disabled={cancelLoading}
                variant="danger"
                className="flex-1"
              >
                {cancelLoading ? "Cancelling..." : "Cancel booking"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

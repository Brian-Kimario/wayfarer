import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import { Container, Button, Card } from "@/components";
import Link from "next/link";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

// Confetti component for celebration
function ConfettiExplosion() {
  const confettiCount = 80;
  const colors = [
    "var(--color-sunset)",
    "var(--color-ocean-700)",
    "var(--color-sea-glass)",
    "var(--color-gold)",
  ];

  return (
    <>
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-4"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-20 + Math.random() * 10}%`,
              backgroundColor: `var(${colors[i % colors.length]})`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `fall ${2.5 + Math.random() * 2.5}s ${
                Math.random() * 2
              }s linear forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (!booking) {
    return (
      <Container className="py-12">
        <p style={{ color: "var(--color-ink)" }}>Booking not found</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-ivory)" }} className="flex-1">
      <ConfettiExplosion />
      <div className="relative z-10 py-12 md:py-20">
        <Container size="narrow">
          {/* Success Card */}
          <Card
            variant="elevated"
            className="overflow-hidden mb-8 animate-in fade-in-0 zoom-in-95 duration-500"
          >
            <div className="p-8 md:p-12">
              {/* Success Icon & Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: "var(--color-success)",
                  }}
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h1
                  className="text-4xl font-bold mb-2"
                  style={{ color: "var(--color-ink)" }}
                >
                  Booking confirmed!
                </h1>
                <p
                  className="text-lg"
                  style={{ color: "var(--color-muted)" }}
                >
                  Your reservation has been secured
                </p>
              </div>

              {/* Booking Code */}
              <div
                className="py-6 px-6 rounded-lg mb-8 text-center"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <p
                  className="text-xs font-bold uppercase mb-2"
                  style={{ color: "var(--color-muted)" }}
                >
                  Booking reference
                </p>
                <p
                  className="text-3xl font-mono font-bold"
                  style={{ color: "var(--color-ocean-700)" }}
                >
                  {booking.code}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--color-muted)" }}
                >
                  Keep this code for your records
                </p>
              </div>

              {/* Booking Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div>
                  <p
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Guest name
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {booking.lead_guest_name}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Email
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {booking.lead_guest_email}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Check-in
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {formatDate(booking.start_date)}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Check-out
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {formatDate(booking.end_date)}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Guests
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {booking.guests}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Status
                  </p>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-success)" }}
                  >
                    ✓ Confirmed
                  </p>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-muted)" }}>Subtotal</span>
                  <span style={{ color: "var(--color-ink)" }}>
                    {formatMoney(booking.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-muted)" }}>Taxes & fees</span>
                  <span style={{ color: "var(--color-ink)" }}>
                    {formatMoney(booking.taxes)}
                  </span>
                </div>
                <div
                  className="flex justify-between font-bold text-lg pt-2"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <span style={{ color: "var(--color-ink)" }}>Total paid</span>
                  <span style={{ color: "var(--color-sunset)" }}>
                    {formatMoney(booking.total)}
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/bookings">
                  <Button size="lg" fullWidth>
                    View my bookings
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary" size="lg" fullWidth>
                    Continue exploring
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Info Section */}
          <Card>
            <div className="p-6 md:p-8">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--color-ink)" }}
              >
                What happens next?
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span style={{ color: "var(--color-ink)" }}>
                    A confirmation email has been sent to{" "}
                    <strong>{booking.lead_guest_email}</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span style={{ color: "var(--color-ink)" }}>
                    You can manage your booking from My Bookings anytime
                  </span>
                </li>
                <li className="flex gap-3">
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span style={{ color: "var(--color-ink)" }}>
                    Cancellations are subject to the property's policy
                  </span>
                </li>
              </ul>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
}

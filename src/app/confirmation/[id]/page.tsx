import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import Link from "next/link";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

// Confetti component for celebration
function ConfettiExplosion() {
  const confettiCount = 100;
  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#8b5cf6", "#f97316"];

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
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `fall ${2.5 + Math.random() * 2.5}s ${Math.random() * 2}s linear forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (!booking) {
    return (
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <p>Booking not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ backgroundColor: "var(--page)" }}>
      <ConfettiExplosion />
      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        {/* Premium Ticket-style Card */}
        <div
          className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-in fade-in-0 zoom-in-95 duration-500"
          style={{ borderColor: "var(--line)" }}
        >
          {/* Ticket cut-out effects */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full" style={{ backgroundColor: "var(--page)" }} />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full" style={{ backgroundColor: "var(--page)" }} />

          {/* Success Icon & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 rounded-full mb-4" style={{ backgroundColor: "var(--good)", color: "white" }}>
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--ink)" }}>Booking Confirmed!</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Your reservation has been secured</p>
          </div>

          {/* Dashed Line Divider */}
          <div className="w-full border-t-2 border-dashed mb-6" style={{ borderColor: "var(--line)" }} />

          {/* Booking Code - Large & Prominent */}
          <div className="text-center mb-8 py-4">
            <p className="text-xs font-bold uppercase mb-2" style={{ color: "var(--muted)" }}>Booking Code</p>
            <p className="text-3xl font-mono font-bold" style={{ color: "var(--brand)" }}>{booking.code}</p>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Save this code for your records</p>
          </div>

          {/* Dashed Line Divider */}
          <div className="w-full border-t-2 border-dashed mb-6" style={{ borderColor: "var(--line)" }} />

          {/* Booking Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 rounded-lg" style={{ backgroundColor: "var(--page)" }}>
            <div>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>Guest</p>
              <p style={{ color: "var(--ink)" }} className="font-medium">{booking.lead_guest_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>Email</p>
              <p style={{ color: "var(--ink)" }} className="font-medium">{booking.lead_guest_email}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>Check in</p>
              <p style={{ color: "var(--ink)" }} className="font-medium">{formatDate(booking.start_date)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>Check out</p>
              <p style={{ color: "var(--ink)" }} className="font-medium">{formatDate(booking.end_date)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>Guests</p>
              <p style={{ color: "var(--ink)" }} className="font-medium">{booking.guests}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>Rooms</p>
              <p style={{ color: "var(--ink)" }} className="font-medium">{booking.units}</p>
            </div>
          </div>

          {/* Dashed Line Divider */}
          <div className="w-full border-t-2 border-dashed mb-6" style={{ borderColor: "var(--line)" }} />

          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <span style={{ color: "var(--ink)" }}>{formatMoney(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>Taxes & Fees</span>
              <span style={{ color: "var(--ink)" }}>{formatMoney(booking.taxes)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: "1px solid var(--line)" }}>
              <span style={{ color: "var(--ink)" }}>Total Paid</span>
              <span style={{ color: "var(--brand)" }}>{formatMoney(booking.total)}</span>
            </div>
          </div>

          {/* Dashed Line Divider */}
          <div className="w-full border-t-2 border-dashed my-6" style={{ borderColor: "var(--line)" }} />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/bookings"
              className="inline-block px-6 py-3 rounded text-white font-500 text-center"
              style={{ backgroundColor: "var(--action)" }}
            >
              View My Bookings
            </Link>
            <Link href="/" className="text-sm text-center" style={{ color: "var(--action)" }}>
              Make another booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

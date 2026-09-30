import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import Link from "next/link";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded border p-8 text-center" style={{ borderColor: "var(--line)" }}>
          <p className="text-sm font-500 mb-4" style={{ color: "var(--good)" }}>
            ✓ Booking confirmed
          </p>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--ink)" }}>
            {booking.code}
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Save this confirmation code for your records
          </p>

          <div className="bg-gray-50 rounded p-6 mb-8 text-left" style={{ backgroundColor: "var(--page)" }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                  Guest name
                </p>
                <p style={{ color: "var(--ink)" }}>{booking.lead_guest_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                  Email
                </p>
                <p style={{ color: "var(--ink)" }}>{booking.lead_guest_email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                  Check in
                </p>
                <p style={{ color: "var(--ink)" }}>{formatDate(booking.start_date)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                  Check out
                </p>
                <p style={{ color: "var(--ink)" }}>{formatDate(booking.end_date)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                  Guests
                </p>
                <p style={{ color: "var(--ink)" }}>{booking.guests}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: "var(--muted)" }}>
                  Units
                </p>
                <p style={{ color: "var(--ink)" }}>{booking.units}</p>
              </div>
            </div>

            <div
              className="mt-6 pt-6"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <div className="flex justify-between mb-2">
                <p style={{ color: "var(--muted)" }}>Subtotal</p>
                <p style={{ color: "var(--ink)" }}>{formatMoney(booking.subtotal)}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p style={{ color: "var(--muted)" }}>Taxes & fees</p>
                <p style={{ color: "var(--ink)" }}>{formatMoney(booking.taxes)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <p style={{ color: "var(--ink)" }}>Total</p>
                <p style={{ color: "var(--brand)" }}>{formatMoney(booking.total)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/bookings"
              className="inline-block px-6 py-3 rounded text-white font-500"
              style={{ backgroundColor: "var(--action)" }}
            >
              Go to My Bookings
            </Link>
            <Link href="/" className="text-sm" style={{ color: "var(--action)" }}>
              Continue booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

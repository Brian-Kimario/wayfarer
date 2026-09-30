import { createClient } from "@/lib/supabase/server";
import { getStay } from "@/lib/stays";
import { formatMoney } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StayDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function StayDetailPage({ params, searchParams }: StayDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const stay = await getStay(supabase, parseInt(id), query);

  if (!stay) {
    return (
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <p>Property not found</p>
      </div>
    );
  }

  const checkIn = query.check_in || "";
  const checkOut = query.check_out || "";
  const guests = query.guests || "2";
  const rooms = query.rooms || "1";

  return (
    <div className="flex-1" style={{ backgroundColor: "var(--page)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded border p-6 mb-6" style={{ borderColor: "var(--line)" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "var(--ink)" }}>
                {stay.name}
              </h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {stay.address}
              </p>
            </div>
            {stay.rating && (
              <div
                className="px-4 py-2 rounded text-white text-2xl font-bold"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {stay.rating.avg_score?.toFixed(1) || "—"}
              </div>
            )}
          </div>

          <p className="text-sm mb-4" style={{ color: "var(--ink)" }}>
            {stay.type} • {stay.stars} stars • {stay.distance_center_km} km from centre
          </p>

          <p className="text-sm" style={{ color: "var(--ink)" }}>
            {stay.description}
          </p>

          {stay.amenities && stay.amenities.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold mb-2" style={{ color: "var(--ink)" }}>
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {stay.amenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: "var(--page)", color: "var(--muted)" }}
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded border overflow-hidden" style={{ borderColor: "var(--line)" }}>
          <table className="w-full">
            <thead style={{ backgroundColor: "var(--page)" }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Room type
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Sleeps
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Meal plan
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Price ({query.check_in && query.check_out ? `${(new Date(query.check_out as string).getTime() - new Date(query.check_in as string).getTime()) / (1000 * 60 * 60 * 24)} nights` : "per night"})
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Rooms left
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {stay.room_types.map((room: any) => (
                <tr key={room.id} style={{ borderTop: `1px solid var(--line)` }}>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--ink)" }}>
                    {room.name}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--ink)" }}>
                    {room.max_guests}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--ink)" }}>
                    {room.meal_plan}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--ink)" }}>
                    {room.total_price ? formatMoney(room.total_price) : formatMoney(room.price_per_night)}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--ink)" }}>
                    {room.available ? room.rooms_left : <span style={{ color: "var(--muted)" }}>Sold out</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {room.available && checkIn && checkOut ? (
                      <Link
                        href={`/checkout?room_type_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&rooms=${rooms}`}
                        className="text-sm px-4 py-2 rounded text-white"
                        style={{ backgroundColor: "var(--action)" }}
                      >
                        Reserve
                      </Link>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        Not available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stay.reviews && stay.reviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              Recent reviews ({stay.reviews.length})
            </h2>
            <div className="space-y-4">
              {stay.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white rounded border p-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-bold" style={{ color: "var(--ink)" }}>
                      {review.author_name}
                    </p>
                    <p className="font-bold" style={{ color: "var(--brand)" }}>
                      {review.score.toFixed(1)}
                    </p>
                  </div>
                  <p className="font-500 text-sm mb-1" style={{ color: "var(--ink)" }}>
                    {review.title}
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {review.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

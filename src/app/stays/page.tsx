import { createClient } from "@/lib/supabase/server";
import { searchStays } from "@/lib/stays";
import { formatDate, formatMoney } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function StaysSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const results = await searchStays(supabase, params);

  const checkIn = params.check_in || "";
  const checkOut = params.check_out || "";

  return (
    <div className="flex-1" style={{ backgroundColor: "var(--page)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
          {params.destination}: {results.total} properties found
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          {formatDate(checkIn)} to {formatDate(checkOut)} ({results.nights} nights)
        </p>

        {results.total === 0 ? (
          <div className="bg-white rounded border p-8 text-center" style={{ borderColor: "var(--line)" }}>
            <p style={{ color: "var(--ink)" }}>No properties match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.results.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded border p-4 flex gap-4"
                style={{ borderColor: "var(--line)" }}
              >
                <div
                  className="w-48 h-32 rounded flex-shrink-0 flex items-center justify-center text-white text-3xl"
                  style={{ backgroundColor: `hsl(${property.hue} 20% 72%)` }}
                >
                  🏨
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>
                        {property.name}
                      </h2>
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {property.type} • {property.stars} stars • {property.distance_center_km} km from centre
                      </p>
                    </div>
                    {property.avg_score && (
                      <div
                        className="px-3 py-1 rounded text-white text-sm font-bold"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {property.avg_score.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm font-bold mb-2" style={{ color: "var(--ink)" }}>
                    {property.display_room.name}
                  </p>
                  <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                    {property.display_room.meal_plan === "room_only" ? "Room only" : property.display_room.meal_plan}
                    {" • "}
                    {property.display_room.cancellation_policy === "free" ? (
                      <span style={{ color: "var(--good)" }}>Free cancellation</span>
                    ) : (
                      property.display_room.cancellation_policy
                    )}
                  </p>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {results.nights} nights, {params.guests} guest{params.guests !== "1" ? "s" : ""}
                      </p>
                      {property.display_room.rooms_left <= 3 && (
                        <p className="text-xs font-bold" style={{ color: "var(--alert)" }}>
                          Only {property.display_room.rooms_left} left at this price!
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: "var(--ink)" }}>
                        {formatMoney(property.display_room.total_stay_price)}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        per {results.nights} night{results.nights !== 1 ? "s" : ""}
                      </p>
                      <Link
                        href={`/stay/${property.id}?check_in=${checkIn}&check_out=${checkOut}&guests=${params.guests}&rooms=${params.rooms || 1}`}
                        className="inline-block mt-2 px-4 py-2 rounded text-white text-sm font-500"
                        style={{ backgroundColor: "var(--action)" }}
                      >
                        See availability
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

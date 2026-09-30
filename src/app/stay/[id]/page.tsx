import { createClient } from "@/lib/supabase/server";
import { getStay } from "@/lib/stays";
import { formatMoney } from "@/lib/format";
import { Container, Card, Rating, Badge } from "@/components";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StayDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function StayDetailPage({
  params,
  searchParams,
}: StayDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const stay = await getStay(supabase, parseInt(id), query);

  if (!stay) {
    return (
      <Container className="py-12">
        <p style={{ color: "var(--color-ink)" }}>Property not found</p>
      </Container>
    );
  }

  const checkIn = query.check_in || "";
  const checkOut = query.check_out || "";
  const guests = query.guests || "2";
  const rooms = query.rooms || "1";

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  return (
    <div style={{ backgroundColor: "var(--color-ivory)" }}>
      {/* Property Header */}
      <section
        className="py-8 md:py-12"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Container>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                {stay.name}
              </h1>
              <p
                className="text-lg"
                style={{ color: "var(--color-muted)" }}
              >
                {stay.address}
              </p>
            </div>
            {stay.rating && (
              <div>
                <Rating
                  score={stay.rating.avg_score || 0}
                  count={stay.reviews?.length}
                  size="lg"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="primary">{stay.type}</Badge>
            <Badge variant="info">
              {stay.stars} stars
            </Badge>
            <Badge variant="info">
              {stay.distance_center_km} km from centre
            </Badge>
          </div>

          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--color-ink)" }}
          >
            {stay.description}
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <Container>
          {/* Amenities */}
          {stay.amenities && stay.amenities.length > 0 && (
            <section className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-ink)" }}
              >
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stay.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span style={{ color: "var(--color-ink)" }}>
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Room Selection Table */}
          <section className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "var(--color-ink)" }}
            >
              Select room
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "var(--color-surface)" }}>
                  <tr>
                    <th
                      className="text-left px-4 py-3 text-sm font-bold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Room type
                    </th>
                    <th
                      className="text-left px-4 py-3 text-sm font-bold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Sleeps
                    </th>
                    <th
                      className="text-left px-4 py-3 text-sm font-bold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Meal plan
                    </th>
                    <th
                      className="text-left px-4 py-3 text-sm font-bold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Price
                    </th>
                    <th
                      className="text-left px-4 py-3 text-sm font-bold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Available
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {stay.room_types.map((room: any) => (
                    <tr
                      key={room.id}
                      style={{
                        borderBottom: `1px solid var(--color-border)`,
                      }}
                    >
                      <td
                        className="px-4 py-3 text-sm font-medium"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {room.name}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {room.max_guests}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {room.meal_plan.replace("_", " ")}
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-bold"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {room.total_price
                          ? formatMoney(room.total_price)
                          : formatMoney(room.price_per_night)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {room.available ? (
                          <Badge variant="success">
                            {room.rooms_left} left
                          </Badge>
                        ) : (
                          <Badge variant="error">Sold out</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {room.available && checkIn && checkOut ? (
                          <Link
                            href={`/checkout?room_type_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&rooms=${rooms}`}
                          >
                            <button
                              className="px-4 py-2 bg-[var(--color-ocean-700)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-ocean-950)] transition-colors"
                            >
                              Select
                            </button>
                          </Link>
                        ) : (
                          <span
                            className="text-xs"
                            style={{ color: "var(--color-muted)" }}
                          >
                            Unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reviews */}
          {stay.reviews && stay.reviews.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-ink)" }}
              >
                Guest reviews ({stay.reviews.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {stay.reviews.slice(0, 6).map((review: any) => (
                  <Card key={review.id}>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="font-bold"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {review.author_name}
                        </h3>
                        <Rating score={review.score} size="sm" showLabel />
                      </div>
                      <p
                        className="font-semibold text-sm mb-2"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {review.title}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {review.body}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
    </div>
  );
}

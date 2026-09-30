import { createClient } from "@/lib/supabase/server";
import { searchStays } from "@/lib/stays";
import { formatDate, formatMoney } from "@/lib/format";
import {
  Container,
  PropertyCardWithImage,
  EmptyState,
  LoadingSkeleton,
} from "@/components";
import SearchFilters from "@/components/SearchFilters";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function StaysSearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const results = await searchStays(supabase, params);

  const checkIn = params.check_in || "";
  const checkOut = params.check_out || "";
  const destination = params.destination || "";
  const guests = params.guests || "1";
  const sort = params.sort || "recommended";

  return (
    <div
      className="flex-1"
      style={{ backgroundColor: "var(--color-ivory)" }}
    >
      {/* Search Summary Section */}
      <section
        className="py-6 md:py-8"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Container>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: "var(--color-ink)" }}
          >
            {destination}: {results.total} properties
          </h1>
          <p
            className="text-lg mb-6"
            style={{ color: "var(--color-muted)" }}
          >
            {formatDate(checkIn)} to {formatDate(checkOut)} •{" "}
            {results.nights} night{results.nights !== 1 ? "s" : ""} •{" "}
            {guests} guest{guests !== "1" ? "s" : ""}
          </p>

          {/* Modify Search Link */}
          <a
            href="/"
            className="inline-flex items-center text-sm font-medium"
            style={{ color: "var(--color-ocean-700)" }}
          >
            ← Modify search
          </a>
        </Container>
      </section>

      {/* Results with Filters */}
      <section className="py-12 md:py-16">
        <Container>
          {/* Live region for search results updates */}
          <div
            role="region"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            Search results for {destination}: {results.total} properties available from {formatDate(checkIn)} to {formatDate(checkOut)} for {guests} guest{guests !== '1' ? 's' : ''}
          </div>

          {results.total === 0 ? (
            <EmptyState
              icon="🔍"
              title="No properties found"
              description="Try adjusting your search dates, location, or number of guests."
              action={{
                label: "Back to search",
                href: "/",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <SearchFilters
                  currentSort={sort}
                  destination={destination}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  rooms={params.rooms || "1"}
                />
              </div>

              {/* Results Grid */}
              <div className="lg:col-span-3">
                {/* Sort Options */}
                <div className="mb-6 flex justify-between items-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Sorted by: {sort === "price_asc" ? "Price: low to high" : sort === "price_desc" ? "Price: high to low" : sort === "rating" ? "Review score" : sort === "stars" ? "Star rating" : sort === "distance" ? "Distance" : "Recommended"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.results.map((property) => (
                    <PropertyCardWithImage
                      key={property.id}
                      id={property.id}
                      name={property.name}
                      location={property.city}
                      imageColor={property.hue ? property.hue.toString() : undefined}
                      rating={property.avg_score || undefined}
                      reviewCount={property.review_count || undefined}
                      price={property.display_room.total_stay_price}
                      priceLabel={`per ${results.nights} night${results.nights !== 1 ? "s" : ""}`}
                      roomType={property.display_room.name}
                      amenities={[
                        property.display_room.meal_plan
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          property.display_room.meal_plan.slice(1),
                      ]}
                      freeCancellation={
                        property.display_room.cancellation_policy === "free"
                      }
                      limited={
                        property.display_room.rooms_left > 0 &&
                        property.display_room.rooms_left <= 3
                      }
                      nights={results.nights}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      guests={guests}
                      rooms={params.rooms || "1"}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

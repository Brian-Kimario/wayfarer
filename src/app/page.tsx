import {
  HeroSection,
  SearchWidget,
  DestinationGrid,
  Container,
  Card,
  HeroImage,
  PropertyCardWithImage,
  EmptyState,
} from "@/components";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getPopularStays() {
  try {
    const supabase = await createClient();
    
    const { data: properties, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        name,
        city,
        stars,
        amenities,
        hue,
        room_types (
          id,
          price_per_night,
          quantity,
          cancellation_policy
        ),
        property_ratings (
          avg_score,
          review_count
        )
      `
      )
      .limit(6);

    if (error || !properties) {
      console.error("Error fetching properties:", error);
      return [];
    }

    return properties.map((prop: any) => ({
      id: prop.id,
      name: prop.name,
      city: prop.city,
      stars: prop.stars,
      hue: prop.hue,
      rating: prop.property_ratings?.[0]?.avg_score || 0,
      reviewCount: prop.property_ratings?.[0]?.review_count || 0,
      price: prop.room_types?.[0]?.price_per_night || 0,
      roomType: prop.room_types?.[0]?.name || "Room",
      cancellationPolicy: prop.room_types?.[0]?.cancellation_policy,
      amenities: prop.amenities || [],
    }));
  } catch (err) {
    console.error("Failed to fetch popular stays:", err);
    return [];
  }
}

export default async function Home() {
  const popularStays = await getPopularStays();

  const destinations = [
    {
      name: "Dar es Salaam",
      country: "Tanzania",
      properties: 12,
      emoji: "🏝️",
      imageColor: "200",
    },
    {
      name: "Zanzibar",
      country: "Tanzania",
      properties: 18,
      emoji: "🌴",
      imageColor: "200",
    },
    {
      name: "Nairobi",
      country: "Kenya",
      properties: 24,
      emoji: "🦁",
      imageColor: "45",
    },
    {
      name: "Dubai",
      country: "UAE",
      properties: 42,
      emoji: "🏙️",
      imageColor: "30",
    },
    {
      name: "Chandigarh",
      country: "India",
      properties: 8,
      emoji: "🕌",
      imageColor: "60",
    },
    {
      name: "Delhi",
      country: "India",
      properties: 28,
      emoji: "🏛️",
      imageColor: "60",
    },
    {
      name: "Paris",
      country: "France",
      properties: 56,
      emoji: "🗼",
      imageColor: "280",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      properties: 31,
      emoji: "🕌",
      imageColor: "200",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section with Search */}
      <HeroSection
        title="Plan somewhere worth remembering."
        subtitle="Find a stay, book a flight, and build your trip in one place."
      >
        <SearchWidget />
      </HeroSection>

      {/* Main Content */}
      <main style={{ backgroundColor: "var(--color-ivory)" }}>
        {/* Popular Destinations */}
        <section className="py-12 md:py-16 lg:py-20">
          <Container>
            <div className="mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: "var(--color-ink)" }}
              >
                Explore destinations
              </h2>
              <p
                className="text-lg"
                style={{ color: "var(--color-muted)" }}
              >
                Discover some of the world's most incredible places to visit.
              </p>
            </div>
            <DestinationGrid destinations={destinations} />
          </Container>
        </section>

        {/* Popular Stays Section */}
        <section
          className="py-12 md:py-16 lg:py-20"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <Container>
            <div className="mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: "var(--color-ink)" }}
              >
                Popular stays
              </h2>
              <p
                className="text-lg"
                style={{ color: "var(--color-muted)" }}
              >
                Find a place that fits your travel style.
              </p>
            </div>

            {popularStays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularStays.map((stay) => (
                  <PropertyCardWithImage
                    key={stay.id}
                    id={stay.id}
                    name={stay.name}
                    location={stay.city}
                    imageColor={stay.hue?.toString()}
                    rating={stay.rating}
                    reviewCount={stay.reviewCount}
                    price={stay.price}
                    priceLabel="per night"
                    roomType={stay.roomType}
                    amenities={stay.amenities?.slice(0, 2) || []}
                    freeCancellation={stay.cancellationPolicy === "free"}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🏨"
                title="No stays available"
                description="Check back soon for popular stays in your favorite destinations."
              />
            )}
          </Container>
        </section>

        {/* Why Wayfarer Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <Container>
            <div className="mb-12 text-center">
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: "var(--color-ink)" }}
              >
                Why choose Wayfarer?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🌍",
                  title: "Everything for the trip",
                  description:
                    "Search stays and flights in one place. Build your entire itinerary without switching sites.",
                },
                {
                  icon: "💰",
                  title: "Know the price",
                  description:
                    "See taxes and totals before booking. No hidden fees, no surprises at checkout.",
                },
                {
                  icon: "📋",
                  title: "Keep your plans together",
                  description:
                    "Save bookings and organize them into trips. Easy access to all your reservations.",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--color-muted)" }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Footer CTA */}
        <section
          className="py-12 md:py-16 lg:py-20"
          style={{ backgroundColor: "var(--color-ocean-950)" }}
        >
          <Container>
            <div className="text-center">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
              >
                Ready for your next adventure?
              </h2>
              <p
                className="text-lg mb-8 opacity-90 max-w-2xl mx-auto"
                style={{ color: "white" }}
              >
                Search for stays in your favorite destination or explore new
                places. Your next unforgettable trip starts here.
              </p>
              <a href="/stays?destination=Dar%20es%20Salaam" className="inline-block">
                <button
                  className="px-8 py-3 bg-[var(--color-sunset)] text-white rounded-lg text-lg font-bold hover:bg-[var(--color-terracotta)] transition-colors"
                >
                  Start exploring
                </button>
              </a>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer
          className="py-12 md:py-16 border-t"
          style={{
            backgroundColor: "var(--color-ivory)",
            borderColor: "var(--color-border)",
          }}
        >
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div>
                <div className="flex flex-col mb-4">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--color-ocean-950)" }}
                  >
                    WAYFARER
                  </span>
                  <span
                    className="text-xs font-medium tracking-wide"
                    style={{ color: "var(--color-muted)" }}
                  >
                    travel better
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Plan your next trip with confidence. Search stays, book flights, and organize it all in one place.
                </p>
              </div>

              {/* Explore */}
              <div>
                <h4
                  className="font-bold mb-4 text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  Explore
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/stays"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      Search Stays
                    </a>
                  </li>
                  <li>
                    <a
                      href="/flights"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      Find Flights
                    </a>
                  </li>
                  <li>
                    <a
                      href="/trips"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      Plan Trips
                    </a>
                  </li>
                </ul>
              </div>

              {/* Account */}
              <div>
                <h4
                  className="font-bold mb-4 text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  Account
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/bookings"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      My Bookings
                    </a>
                  </li>
                  <li>
                    <a
                      href="/wishlist"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      Wishlist
                    </a>
                  </li>
                  <li>
                    <a
                      href="/login"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      Sign In
                    </a>
                  </li>
                </ul>
              </div>

              {/* About */}
              <div>
                <h4
                  className="font-bold mb-4 text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  About
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      How Wayfarer Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-sm"
                      style={{ color: "var(--color-ocean-700)" }}
                    >
                      Help & Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div
              className="pt-8 border-t text-center text-sm"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              <p>© {new Date().getFullYear()} Wayfarer. All rights reserved.</p>
            </div>
          </Container>
        </footer>
      </main>
    </div>
  );
}

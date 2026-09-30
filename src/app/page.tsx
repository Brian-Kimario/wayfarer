import {
  HeroSection,
  SearchWidget,
  DestinationGrid,
  Container,
  Card,
  HeroImage,
  PropertyCardWithImage,
  EmptyState,
  BeachIcon,
  PalmTreeIcon,
  LionIcon,
  CityIcon,
  TempleIcon,
  PalaceIcon,
  EiffelTowerIcon,
  WorldIcon,
  MoneyIcon,
  ListIcon,
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
      icon: "beach",
      imageColor: "200",
    },
    {
      name: "Zanzibar",
      country: "Tanzania",
      properties: 18,
      icon: "palm",
      imageColor: "200",
    },
    {
      name: "Nairobi",
      country: "Kenya",
      properties: 24,
      icon: "lion",
      imageColor: "45",
    },
    {
      name: "Dubai",
      country: "UAE",
      properties: 42,
      icon: "city",
      imageColor: "30",
    },
    {
      name: "Chandigarh",
      country: "India",
      properties: 8,
      icon: "temple",
      imageColor: "60",
    },
    {
      name: "Delhi",
      country: "India",
      properties: 28,
      icon: "palace",
      imageColor: "60",
    },
    {
      name: "Paris",
      country: "France",
      properties: 56,
      icon: "eiffel",
      imageColor: "280",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      properties: 31,
      icon: "temple",
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
        <section className="py-10 md:py-12 lg:py-14">
          <Container>
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Explore destinations
              </h2>
              <p
                className="text-base md:text-lg"
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
          className="py-10 md:py-12 lg:py-14"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <Container>
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Popular stays
              </h2>
              <p
                className="text-base md:text-lg"
                style={{ color: "var(--color-muted)" }}
              >
                Find a place that fits your travel style.
              </p>
            </div>

            {popularStays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
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
                icon="hotel"
                title="No stays available"
                description="Check back soon for popular stays in your favorite destinations."
              />
            )}
          </Container>
        </section>

        {/* Why Wayfarer Section */}
        <section className="py-12 md:py-14 lg:py-16">
          <Container>
            <div className="mb-10 text-center">
              <h2
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Why choose Wayfarer?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              {[
                {
                  icon: WorldIcon,
                  title: "Everything for the trip",
                  description:
                    "Search stays and flights in one place. Build your entire itinerary without switching sites.",
                  gradient: "135deg, hsl(200, 60%, 55%), hsl(200, 70%, 40%)"
                },
                {
                  icon: MoneyIcon,
                  title: "Know the price",
                  description:
                    "See taxes and totals before booking. No hidden fees, no surprises at checkout.",
                  gradient: "135deg, hsl(30, 70%, 55%), hsl(30, 80%, 40%)"
                },
                {
                  icon: ListIcon,
                  title: "Keep your plans together",
                  description:
                    "Save bookings and organize them into trips. Easy access to all your reservations.",
                  gradient: "135deg, hsl(160, 60%, 50%), hsl(160, 70%, 35%)"
                },
              ].map((item, idx) => (
                <div key={idx} className="h-72 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                  {/* Background with gradient */}
                  <div
                    className="h-full flex flex-col justify-between p-8 relative group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `linear-gradient(${item.gradient})`
                    }}
                  >
                    {/* Icon */}
                    <div className="flex justify-center opacity-20">
                      <item.icon size={64} color="white" />
                    </div>

                    {/* Text Content */}
                    <div className="text-white text-center">
                      <h3 className="text-2xl font-bold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed opacity-95">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Footer CTA */}
        <section
          className="py-10 md:py-12 lg:py-14"
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
          className="py-10 md:py-12 border-t"
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

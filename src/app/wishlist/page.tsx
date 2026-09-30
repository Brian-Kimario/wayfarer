"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import Link from "next/link";
import {
  Container,
  Card,
  Button,
  EmptyState,
  PropertyCardWithImage,
} from "@/components";

export default function WishlistPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        router.push("/login?next=/wishlist");
        return;
      }
      setUser(user);

      // Fetch wishlist
      fetchWishlist();
    };

    checkAuth();
  }, [router]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();

      if (!user) {
        router.push("/login?next=/wishlist");
        return;
      }

      // Get wishlist entries
      const { data: wishlistData, error: wishlistError } = await client
        .from("wishlist")
        .select(
          `
          property_id,
          properties (
            id,
            name,
            city,
            stars,
            amenities,
            hue,
            room_types (
              id,
              price_per_night,
              cancellation_policy
            ),
            property_ratings (
              avg_score,
              review_count
            )
          )
        `
        )
        .eq("user_id", user.id);

      if (wishlistError) {
        setError("Failed to load wishlist");
        return;
      }

      // Transform data
      const items = (wishlistData || []).map((item: any) => {
        const prop = item.properties;
        return {
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
        };
      });

      setWishlist(items);
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (propertyId: number) => {
    try {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();

      if (!user) return;

      await client
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      // Update local state
      setWishlist(wishlist.filter((item) => item.id !== propertyId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
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
            Saved stays
          </h1>
          <p
            className="text-lg"
            style={{ color: "var(--color-muted)" }}
          >
            Your collection of favorite properties
          </p>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <Container>
          {error && (
            <div
              className="mb-6 p-4 rounded-lg border-l-4"
              style={{
                borderLeftColor: "var(--color-error)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p style={{ color: "var(--color-error)" }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div style={{ color: "var(--color-muted)" }} className="text-center py-12">
              <div className="animate-spin inline-block w-6 h-6 border-3 border-current border-t-transparent rounded-full"></div>
              <p className="mt-2">Loading your wishlist...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <EmptyState
              icon="heart"
              title="No saved stays yet"
              description="Save places you like while exploring. Your saved stays will appear here."
              action={{
                label: "Start exploring",
                href: "/stays",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCardWithImage
                    id={property.id}
                    name={property.name}
                    location={property.city}
                    imageColor={property.hue?.toString()}
                    rating={property.rating}
                    reviewCount={property.reviewCount}
                    price={property.price}
                    priceLabel="per night"
                    roomType={property.roomType}
                    amenities={property.amenities?.slice(0, 2) || []}
                    freeCancellation={property.cancellationPolicy === "free"}
                  />
                  <button
                    onClick={() => removeFromWishlist(property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full text-white transition-colors"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = "rgba(184, 64, 64, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    }}
                    aria-label={`Remove ${property.name} from wishlist`}
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

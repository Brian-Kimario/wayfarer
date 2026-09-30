import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatMoney } from "@/lib/format";
import Card from "./Card";
import Rating from "./Rating";
import Badge from "./Badge";

interface PropertyCardProps {
  id: number;
  name: string;
  location: string;
  image?: string;
  imageColor?: string;
  rating?: number;
  reviewCount?: number;
  price: number;
  priceLabel?: string;
  roomType?: string;
  amenities?: string[];
  freeCancellation?: boolean;
  nights?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  rooms?: string;
  limited?: boolean;
}

export default function PropertyCard({
  id,
  name,
  location,
  image,
  imageColor,
  rating,
  reviewCount,
  price,
  priceLabel = "per night",
  roomType,
  amenities,
  freeCancellation,
  nights = 1,
  checkIn,
  checkOut,
  guests = "1",
  rooms = "1",
  limited = false,
}: PropertyCardProps) {
  const href =
    checkIn && checkOut && guests
      ? `/stay/${id}?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&rooms=${rooms}`
      : `/stay/${id}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${name} in ${location}`}
            fill
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{
              backgroundColor: imageColor
                ? `hsl(${imageColor} 20% 72%)`
                : "var(--color-surface)",
            }}
            role="img"
            aria-label={`Property image placeholder for ${name}`}
          >
            🏨
          </div>
        )}
        {limited && (
          <div className="absolute top-3 right-3">
            <Badge variant="error">Limited</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3
            className="font-bold text-lg line-clamp-1"
            style={{ color: "var(--color-ink)" }}
          >
            {name}
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            {location}
          </p>
        </div>

        {/* Rating */}
        {rating && (
          <div className="mb-3">
            <Rating score={rating} count={reviewCount} size="sm" />
          </div>
        )}

        {/* Room Type & Amenities */}
        {roomType && (
          <p
            className="text-sm font-medium mb-2"
            style={{ color: "var(--color-ink)" }}
          >
            {roomType}
          </p>
        )}

        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 2).map((amenity, idx) => (
              <Badge key={idx} variant="info">
                {amenity}
              </Badge>
            ))}
          </div>
        )}

        {/* Policies */}
        {freeCancellation && (
          <p
            className="text-xs font-medium mb-3"
            style={{ color: "var(--color-success)" }}
          >
            ✓ Free cancellation
          </p>
        )}

        {/* Price & Action */}
        <div className="flex items-end justify-between pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--color-ink)" }}
            >
              {formatMoney(price)}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              {priceLabel}
            </p>
          </div>
          <Link href={href}>
            <button
              className="px-4 py-2 bg-[var(--color-ocean-700)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-ocean-950)] transition-colors"
              aria-label={`View ${name} in ${location}, ${formatMoney(price)} ${priceLabel}`}
            >
              View
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

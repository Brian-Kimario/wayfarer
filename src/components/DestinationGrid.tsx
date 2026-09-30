import React from "react";
import Link from "next/link";
import Card from "./Card";

interface Destination {
  name: string;
  country: string;
  properties: number;
  imageColor?: string;
  emoji?: string;
}

interface DestinationGridProps {
  destinations: Destination[];
  baseParams?: {
    checkIn: string;
    checkOut: string;
    guests: string;
  };
}

export default function DestinationGrid({
  destinations,
  baseParams,
}: DestinationGridProps) {
  const today = new Date().toISOString().split("T")[0];
  const twoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const checkIn = baseParams?.checkIn || today;
  const checkOut = baseParams?.checkOut || twoWeeks;
  const guests = baseParams?.guests || "2";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {destinations.map((dest) => (
        <Link
          key={dest.name}
          href={`/stays?destination=${encodeURIComponent(
            dest.name
          )}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&rooms=1`}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-all overflow-hidden">
            {/* Image */}
            <div
              className="h-32 flex items-center justify-center text-4xl font-bold"
              style={{
                backgroundColor: dest.imageColor
                  ? `hsl(${dest.imageColor} 20% 72%)`
                  : "var(--color-surface)",
              }}
            >
              {dest.emoji || "✈️"}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3
                className="font-bold text-lg mb-1"
                style={{ color: "var(--color-ink)" }}
              >
                {dest.name}
              </h3>
              <p
                className="text-sm mb-3"
                style={{ color: "var(--color-muted)" }}
              >
                {dest.country}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-ocean-700)" }}
              >
                {dest.properties} properties
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

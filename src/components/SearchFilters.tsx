"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SearchFiltersProps {
  currentSort: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  rooms: string;
}

export default function SearchFilters({
  currentSort,
  destination,
  checkIn,
  checkOut,
  guests,
  rooms,
}: SearchFiltersProps) {
  const baseParams = new URLSearchParams({
    destination,
    check_in: checkIn,
    check_out: checkOut,
    guests,
    rooms,
  });

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price_asc", label: "Price: low to high" },
    { value: "price_desc", label: "Price: high to low" },
    { value: "rating", label: "Review score" },
    { value: "stars", label: "Star rating" },
    { value: "distance", label: "Distance from centre" },
  ];

  return (
    <div
      className="sticky top-[72px] p-6 rounded-lg"
      style={{
        backgroundColor: "var(--color-white)",
        border: `1px solid var(--color-border)`,
      }}
    >
      <h3
        className="font-bold text-lg mb-6"
        style={{ color: "var(--color-ink)" }}
      >
        Sort results
      </h3>

      <div className="space-y-2">
        {sortOptions.map((option) => (
          <Link
            key={option.value}
            href={`/stays?${baseParams.toString()}&sort=${option.value}`}
          >
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                currentSort === option.value
                  ? "bg-[var(--color-ocean-700)] text-white"
                  : ""
              }`}
              style={
                currentSort === option.value
                  ? { backgroundColor: "var(--color-ocean-700)", color: "white" }
                  : {
                      backgroundColor: "transparent",
                      color: "var(--color-ink)",
                      border: `1px solid var(--color-border)`,
                    }
              }
            >
              {option.label}
            </button>
          </Link>
        ))}
      </div>

      {/* Additional filters section placeholder */}
      <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
        <h4
          className="font-bold text-sm mb-4"
          style={{ color: "var(--color-ink)" }}
        >
          More filters coming soon
        </h4>
        <p
          className="text-xs"
          style={{ color: "var(--color-muted)" }}
        >
          Price range, amenities, property type, and more filtering options will be available soon.
        </p>
      </div>
    </div>
  );
}

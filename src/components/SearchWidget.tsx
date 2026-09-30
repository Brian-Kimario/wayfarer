"use client";

import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";

interface SearchWidgetProps {
  defaultDestination?: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: string;
}

export default function SearchWidget({
  defaultDestination = "Dar es Salaam",
  defaultCheckIn = "",
  defaultCheckOut = "",
  defaultGuests = "2",
}: SearchWidgetProps) {
  const [destination, setDestination] = useState(defaultDestination);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(defaultGuests);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams({
      destination,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      rooms: "1",
    });

    // Navigate to search results
    window.location.href = `/stays?${params.toString()}`;
  };

  // Set default dates if not provided
  React.useEffect(() => {
    if (!defaultCheckIn) {
      const today = new Date();
      const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      setCheckIn(today.toISOString().split("T")[0]);
      setCheckOut(twoWeeks.toISOString().split("T")[0]);
    }
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-lg shadow-lg p-6 md:p-8"
      aria-label="Search stays by destination and dates"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-3">
        {/* Destination */}
        <div className="lg:col-span-1">
          <Input
            label="Destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter city"
            fullWidth
          />
        </div>

        {/* Check-in */}
        <div className="lg:col-span-1">
          <Input
            label="Check-in"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            fullWidth
          />
        </div>

        {/* Check-out */}
        <div className="lg:col-span-1">
          <Input
            label="Check-out"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            fullWidth
          />
        </div>

        {/* Guests */}
        <div className="lg:col-span-1">
          <Input
            label="Guests"
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            fullWidth
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            size="md"
            ariaLabel={isLoading ? "Searching for stays..." : "Search for stays"}
          >
            Search
          </Button>
        </div>
      </div>

      <p
        className="text-xs mt-4"
        style={{ color: "var(--color-muted)" }}
      >
        ✓ Free cancellation on most stays • ✓ Best price guaranteed
      </p>
    </form>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "./Card";

interface Destination {
  name: string;
  country: string;
  properties: number;
  imageColor?: string;
  icon?: string;
}

interface DestinationGridProps {
  destinations: Destination[];
  baseParams?: {
    checkIn: string;
    checkOut: string;
    guests: string;
  };
}

interface DestinationImage {
  url: string;
  alt: string;
}

// Map destinations to Unsplash search keywords for better image matching
const destinationKeywords: Record<string, string> = {
  "Dar es Salaam": "Dar es Salaam Tanzania beach",
  "Zanzibar": "Zanzibar island tropical beach",
  "Nairobi": "Nairobi Kenya city skyline",
  "Dubai": "Dubai UAE desert cityscape",
  "Chandigarh": "Chandigarh India city",
  "Delhi": "Delhi India ancient architecture",
  "Paris": "Paris France Eiffel Tower",
  "Istanbul": "Istanbul Turkey Bosphorus",
};

async function fetchDestinationImage(destination: string): Promise<DestinationImage | null> {
  try {
    const keyword = destinationKeywords[destination] || destination;
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      console.warn("Unsplash access key not found");
      return null;
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      return {
        url: photo.urls.regular,
        alt: photo.alt_description || destination,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch image for ${destination}:`, error);
    return null;
  }
}

function DestinationCard({
  dest,
  checkIn,
  checkOut,
  guests,
}: {
  dest: Destination;
  checkIn: string;
  checkOut: string;
  guests: string;
}) {
  const [imageData, setImageData] = useState<DestinationImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinationImage(dest.name).then((img) => {
      setImageData(img);
      setLoading(false);
    });
  }, [dest.name]);

  return (
    <Link
      href={`/stays?destination=${encodeURIComponent(
        dest.name
      )}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&rooms=1`}
    >
      <Card className="h-64 md:h-72 cursor-pointer hover:shadow-xl transition-all overflow-hidden relative group">
        {/* Background Image with dark overlay */}
        {imageData ? (
          <>
            <Image
              src={imageData.url}
              alt={imageData.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors" />
          </>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br group-hover:scale-105 transition-transform duration-300"
            style={{
              backgroundColor: dest.imageColor
                ? `hsl(${dest.imageColor} 30% 65%)`
                : "var(--color-surface)",
              backgroundImage: `linear-gradient(135deg, hsla(${dest.imageColor || 0}, 30%, 65%, 0.8), hsla(${dest.imageColor || 0}, 40%, 50%, 0.9))`,
            }}
          />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {/* Text at bottom */}
          <div className="text-white text-center">
            <h3 className="font-bold text-2xl md:text-3xl mb-1">{dest.name}</h3>
            <p className="text-sm md:text-base opacity-90 mb-3">{dest.country}</p>
            <p className="text-xs md:text-sm font-medium opacity-80">
              {dest.properties} properties
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
      </Card>
    </Link>
  );
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {destinations.map((dest) => (
        <DestinationCard
          key={dest.name}
          dest={dest}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
        />
      ))}
    </div>
  );
}

/**
 * PropertyCardWithImage
 * Wrapper around PropertyCard that fetches and injects real images from Unsplash
 */

'use client';

import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import { searchUnsplashImages } from '@/lib/images';

interface PropertyCardWithImageProps {
  id: number;
  name: string;
  location: string;
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

export default function PropertyCardWithImage(props: PropertyCardWithImageProps) {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Search for high-quality hotel images based on location
        const query = `${props.location} hotel ${props.roomType || 'room'}`;
        const results = await searchUnsplashImages(query, 1, true);

        if (results.length > 0) {
          setImage(results[0].urls.regular);
        }
      } catch (error) {
        console.error('Failed to fetch property image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [props.location, props.roomType]);

  return <PropertyCard {...props} image={image} />;
}

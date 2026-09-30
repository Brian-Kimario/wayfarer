/**
 * HeroImage Component
 * Displays high-quality travel images with photographer attribution
 * Used for homepage banner, property showcase, flight headers
 */

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCategoryImage, getImageWithAttribution } from '@/lib/images';
import type { IMAGE_CATEGORIES } from '@/lib/images';

interface HeroImageProps {
  category: keyof typeof IMAGE_CATEGORIES;
  alt?: string;
  height?: number;
  width?: number;
  priority?: boolean;
  className?: string;
  showAttribution?: boolean;
}

function HeroImage({
  category,
  alt = 'Travel destination',
  height = 400,
  width = 1200,
  priority = false,
  className = '',
  showAttribution = true,
}: HeroImageProps) {
  const [imageData, setImageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const photo = await getCategoryImage(category);
        if (photo) {
          setImageData(photo);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to load hero image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [category]);

  if (error || !imageData) {
    // Fallback gradient background
    return (
      <div
        className={`bg-gradient-to-r from-ocean-700 via-sea-glass to-sunset ${className}`}
        style={{ height: `${height}px`, width: '100%' }}
        role="img"
        aria-label={alt}
      />
    );
  }

  const attribution = getImageWithAttribution(imageData);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-700 via-sea-glass to-sunset animate-pulse" />
      )}

      <Image
        src={attribution.url}
        alt={attribution.alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />

      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {showAttribution && (
        <div
          className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-3 py-2 rounded-tl-lg"
          role="contentinfo"
        >
          Photo by{' '}
          <a
            href={attribution.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
            aria-label={`Photo by ${attribution.photographer} on Unsplash`}
          >
            {attribution.photographer}
          </a>
          {' on '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            Unsplash
          </a>
        </div>
      )}
    </div>
  );
}

export default HeroImage;

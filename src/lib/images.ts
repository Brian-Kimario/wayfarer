/**
 * Image service for fetching high-quality travel photos from Unsplash
 * Used throughout the Wayfarer platform for hero banners, property cards, flights, and trips
 */

const UNSPLASH_API_BASE = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

/**
 * Curated image categories for Wayfarer with Unsplash collection IDs
 */
export const IMAGE_CATEGORIES = {
  HOTEL: { query: 'luxury hotel interior', collection: '3178291' },
  BEACH_RESORT: { query: 'beach resort tropical', collection: '3355984' },
  MOUNTAIN_LODGE: { query: 'mountain cabin lodge', collection: '3178291' },
  CITY_HOTEL: { query: 'modern city hotel', collection: '3178291' },
  FLIGHT: { query: 'airplane cabin interior', collection: '3178291' },
  DESTINATION: { query: 'travel destination landscape', collection: '3355984' },
  BEACH: { query: 'tropical beach sand ocean', collection: '3355984' },
  ADVENTURE: { query: 'travel adventure outdoor', collection: '3178291' },
  BUSINESS_TRIP: { query: 'business travel airport', collection: '3178291' },
  CRUISE: { query: 'luxury cruise ship', collection: '3178291' },
};

/**
 * Cache for storing fetched images to reduce API calls
 */
const imageCache = new Map<string, UnsplashPhoto[]>();

/**
 * Fetch a single image from Unsplash by ID (for specific curated images)
 */
export async function getUnsplashImage(photoId: string): Promise<UnsplashPhoto | null> {
  if (!ACCESS_KEY) {
    console.warn('NEXT_PUBLIC_UNSPLASH_ACCESS_KEY not set');
    return null;
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/photos/${photoId}?client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} - ${response.statusText}`);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Unsplash image:', error);
    return null;
  }
}

/**
 * Search for images by query (with caching)
 */
export async function searchUnsplashImages(
  query: string,
  count: number = 1,
  useCache: boolean = true
): Promise<UnsplashPhoto[]> {
  if (!ACCESS_KEY) {
    console.warn('NEXT_PUBLIC_UNSPLASH_ACCESS_KEY not set');
    return [];
  }

  // Check cache first
  if (useCache && imageCache.has(query)) {
    return imageCache.get(query) || [];
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} - ${response.statusText}`);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    // Cache the results
    if (useCache) {
      imageCache.set(query, results);
    }

    return results;
  } catch (error) {
    console.error('Failed to search Unsplash images:', error);
    return [];
  }
}

/**
 * Get a curated image for a specific category with fallback
 */
export async function getCategoryImage(
  category: keyof typeof IMAGE_CATEGORIES
): Promise<UnsplashPhoto | null> {
  const catConfig = IMAGE_CATEGORIES[category];
  const images = await searchUnsplashImages(catConfig.query, 1);
  return images.length > 0 ? images[0] : null;
}

/**
 * Generate optimized image URL with Unsplash parameters
 */
export function getOptimizedImageUrl(
  photoUrl: string,
  width?: number,
  height?: number,
  quality: 'low' | 'mid' | 'high' = 'mid'
): string {
  if (!photoUrl) return '';

  const params = new URLSearchParams();

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());

  // Quality mapping for Unsplash CDN
  const qualityMap = { low: 60, mid: 80, high: 100 };
  params.append('q', qualityMap[quality].toString());

  // Optimize for format
  params.append('auto', 'format');

  const separator = photoUrl.includes('?') ? '&' : '?';
  return `${photoUrl}${separator}${params.toString()}`;
}

/**
 * Preload hero images for better performance
 */
export async function preloadHeroImages(): Promise<void> {
  const heroCategories: (keyof typeof IMAGE_CATEGORIES)[] = [
    'BEACH_RESORT',
    'MOUNTAIN_LODGE',
    'CITY_HOTEL',
    'DESTINATION',
  ];

  await Promise.allSettled(
    heroCategories.map((cat) => getCategoryImage(cat))
  );
}

/**
 * Get image with photographer attribution
 */
export function getImageWithAttribution(photo: UnsplashPhoto): {
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
} {
  return {
    url: photo.urls.regular,
    alt: photo.alt_description || 'Travel destination image',
    photographer: photo.user.name,
    photographerUrl: `https://unsplash.com/@${photo.user.username}`,
  };
}

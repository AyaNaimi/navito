/**
 * useGooglePlaces Hook - For Vite projects with proper API key initialization
 * 
 * Usage:
 *   const { places, loading } = useGooglePlaces({
 *     apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
 *     location: { lat: 31.6295, lng: -7.9811 },
 *     type: 'restaurants',
 *   });
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PlaceResult,
  searchTopRatedRestaurants,
  searchTouristAttractions,
  searchActivities,
  getPlaceDetails,
} from './placesService';

interface UseGooglePlacesOptions {
  /** Google Maps API key (use import.meta.env.VITE_GOOGLE_MAPS_API_KEY for Vite) */
  apiKey: string;
  /** Location to search around */
  location: { lat: number; lng: number };
  /** Search radius in meters */
  radius?: number;
  /** Type of places to search */
  type: 'restaurants' | 'attractions' | 'activities';
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Cache results (default: true) */
  useCache?: boolean;
}

interface UseGooglePlacesReturn {
  places: PlaceResult[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  selectedPlace: PlaceResult | null;
  setSelectedPlace: (place: PlaceResult | null) => void;
  getDetails: (placeId: string) => Promise<any>;
}

const CACHE = new Map<string, { data: PlaceResult[]; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Hook to fetch and manage Google Places
 */
export function useGooglePlaces({
  apiKey,
  location,
  radius = 2000,
  type,
  autoFetch = true,
  useCache = true,
}: UseGooglePlacesOptions): UseGooglePlacesReturn {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key
  const cacheKey = `${type}:${location.lat}:${location.lng}:${radius}`;

  const fetch = useCallback(async () => {
    // Validate API key
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.length < 10) {
      setError(
        'Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file'
      );
      setPlaces([]);
      setLoading(false);
      return;
    }

    // Check cache
    if (useCache && CACHE.has(cacheKey)) {
      const cached = CACHE.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        setPlaces(cached.data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      let results: PlaceResult[];

      switch (type) {
        case 'restaurants':
          results = await searchTopRatedRestaurants(location, apiKey, radius);
          break;
        case 'attractions':
          results = await searchTouristAttractions(location, apiKey, radius);
          break;
        case 'activities':
          results = await searchActivities(location, apiKey, radius);
          break;
        default:
          throw new Error(`Unknown place type: ${type}`);
      }

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Cache results
      if (useCache) {
        CACHE.set(cacheKey, { data: results, timestamp: Date.now() });
      }

      setPlaces(results);
      setError(null);
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Google Places error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch places');
        setPlaces([]);
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey, cacheKey, location, radius, type, useCache]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetch();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [autoFetch, fetch]);

  const getDetails = useCallback(
    (placeId: string) => getPlaceDetails(placeId, apiKey),
    [apiKey]
  );

  return {
    places,
    loading,
    error,
    fetch,
    selectedPlace,
    setSelectedPlace,
    getDetails,
  };
}

/**
 * Hook to fetch multiple place types at once
 * 
 * @example
 * const results = useMultiplePlaces({
 *   apiKey: 'YOUR_KEY',
 *   location: { lat: 31.6295, lng: -7.9811 },
 *   types: ['restaurants', 'attractions'],
 * });
 */
interface UseMultiplePlacesOptions {
  apiKey: string;
  location: { lat: number; lng: number };
  radius?: number;
  types: Array<'restaurants' | 'attractions' | 'activities'>;
  autoFetch?: boolean;
}

export function useMultiplePlaces({
  apiKey,
  location,
  radius = 2000,
  types,
  autoFetch = true,
}: UseMultiplePlacesOptions) {
  const [allPlaces, setAllPlaces] = useState<Record<string, PlaceResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoFetch) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      const results: Record<string, PlaceResult[]> = {};

      try {
        const promises = types.map(async (type) => {
          try {
            let data: PlaceResult[];
            switch (type) {
              case 'restaurants':
                data = await searchTopRatedRestaurants(location, apiKey, radius);
                break;
              case 'attractions':
                data = await searchTouristAttractions(location, apiKey, radius);
                break;
              case 'activities':
                data = await searchActivities(location, apiKey, radius);
                break;
              default:
                data = [];
            }
            results[type] = data;
          } catch (err) {
            results[type] = [];
            console.error(`Error fetching ${type}:`, err);
          }
        });

        await Promise.all(promises);
        setAllPlaces(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch places');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [apiKey, location, radius, types, autoFetch]);

  return { places: allPlaces, loading, error };
}

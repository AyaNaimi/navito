/**
 * useOpenStreetMap Hook
 * 
 * React hook for querying OpenStreetMap data via Overpass API
 * No API key needed - completely free!
 */

import { useCallback, useEffect, useState } from 'react';
import {
  OSMPlace,
  queryOverpassAPI,
  searchRestaurants,
  searchMonuments,
  searchActivities,
} from './overpassService';

interface UseOpenStreetMapOptions {
  location: { lat: number; lng: number };
  radius?: number;
  type: 'restaurants' | 'monuments' | 'activities';
  autoFetch?: boolean;
}

interface UseOpenStreetMapReturn {
  places: OSMPlace[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  selectedPlace: OSMPlace | null;
  setSelectedPlace: (place: OSMPlace | null) => void;
}

const CACHE = new Map<string, { data: OSMPlace[]; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Hook to fetch and manage OpenStreetMap places
 * 
 * @example
 * const { places, loading } = useOpenStreetMap({
 *   location: { lat: 31.6295, lng: -7.9811 },
 *   type: 'restaurants',
 * });
 */
export function useOpenStreetMap({
  location,
  radius = 2000,
  type,
  autoFetch = true,
}: UseOpenStreetMapOptions): UseOpenStreetMapReturn {
  const [places, setPlaces] = useState<OSMPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<OSMPlace | null>(null);

  const cacheKey = `osm:${type}:${location.lat}:${location.lng}:${radius}`;

  const fetch = useCallback(async () => {
    // Check cache
    const cached = CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setPlaces(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let results: OSMPlace[];

      switch (type) {
        case 'restaurants':
          results = await searchRestaurants(location.lat, location.lng, radius);
          break;
        case 'monuments':
          results = await searchMonuments(location.lat, location.lng, radius);
          break;
        case 'activities':
          results = await searchActivities(location.lat, location.lng, radius);
          break;
        default:
          throw new Error(`Unknown place type: ${type}`);
      }

      // Cache results
      CACHE.set(cacheKey, { data: results, timestamp: Date.now() });
      setPlaces(results);
      setError(null);
    } catch (err) {
      console.error('OpenStreetMap error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch places');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, location, radius, type]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return {
    places,
    loading,
    error,
    fetch,
    selectedPlace,
    setSelectedPlace,
  };
}

/**
 * Hook to fetch multiple place types at once
 */
interface UseMultipleOSMOptions {
  location: { lat: number; lng: number };
  radius?: number;
  types: Array<'restaurants' | 'monuments' | 'activities'>;
  autoFetch?: boolean;
}

export function useMultipleOpenStreetMap({
  location,
  radius = 2000,
  types,
  autoFetch = true,
}: UseMultipleOSMOptions) {
  const [allPlaces, setAllPlaces] = useState<Record<string, OSMPlace[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoFetch) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      const results: Record<string, OSMPlace[]> = {};

      try {
        const promises = types.map(async (type) => {
          try {
            let data: OSMPlace[];
            switch (type) {
              case 'restaurants':
                data = await searchRestaurants(location.lat, location.lng, radius);
                break;
              case 'monuments':
                data = await searchMonuments(location.lat, location.lng, radius);
                break;
              case 'activities':
                data = await searchActivities(location.lat, location.lng, radius);
                break;
              default:
                data = [];
            }
            results[type] = data;
          } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            results[type] = [];
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
  }, [location, radius, types, autoFetch]);

  return { places: allPlaces, loading, error };
}

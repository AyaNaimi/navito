/**
 * Google Places API Service (Working Version)
 * 
 * Handles:
 * - NearbySearch for restaurants, landmarks, attractions
 * - Photo retrieval
 * - Proper API initialization with @googlemaps/js-api-loader
 */

import { Loader } from '@googlemaps/js-api-loader';

export interface PlaceResult {
  placeId: string;
  name: string;
  vicinity: string;
  latitude: number;
  longitude: number;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  photoRef?: string;
  openNow?: boolean;
  types: string[];
  phoneNumber?: string;
  website?: string;
  formattedAddress?: string;
}

export interface NearbySearchRequest {
  location: { lat: number; lng: number };
  radius?: number; // meters, default 1500
  type?: string; // e.g., 'restaurant', 'tourist_attraction'
  keyword?: string;
  rankBy?: 'prominence' | 'distance';
}

export interface NearbySearchResponse {
  results: PlaceResult[];
  nextPageToken?: string;
  status: string;
}

// Cache for loaded Google Maps API
let googleMapsLoaded = false;
let googleLoaderPromise: Promise<any> | null = null;

/**
 * Initialize Google Maps API with Places library
 */
export async function initializeGoogleMaps(apiKey: string) {
  if (googleMapsLoaded) {
    return;
  }

  if (googleLoaderPromise) {
    return googleLoaderPromise;
  }

  googleLoaderPromise = new Promise(async (resolve, reject) => {
    try {
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places', 'maps'],
      });

      await loader.load();
      googleMapsLoaded = true;
      resolve(window.google);
    } catch (error) {
      console.error('Failed to load Google Maps API:', error);
      reject(error);
    }
  });

  return googleLoaderPromise;
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(
  photoReference: string,
  apiKey: string,
  maxWidth: number = 400
): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
}

/**
 * Format price level (0-4) to currency symbols
 */
export function formatPriceLevel(level?: number): string | null {
  if (level === undefined) return null;
  const symbols = ['Gratuit', '$', '$$', '$$$', '$$$$'];
  return symbols[level] || null;
}

/**
 * Perform a NearbySearch using Google Places API
 */
export async function nearbySearch(
  request: NearbySearchRequest,
  apiKey: string
): Promise<PlaceResult[]> {
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
  }

  // Initialize Google Maps if not already done
  await initializeGoogleMaps(apiKey);

  return new Promise((resolve, reject) => {
    const google = (window as any).google;

    if (!google?.maps?.places) {
      reject(new Error('Google Maps Places library not loaded'));
      return;
    }

    // Create hidden container for PlacesService
    const container = document.createElement('div');
    const service = new google.maps.places.PlacesService(container);

    const searchRequest = {
      location: new google.maps.LatLng(request.location.lat, request.location.lng),
      radius: request.radius || 1500,
      ...(request.type && { type: request.type }),
      ...(request.keyword && { keyword: request.keyword }),
    };

    service.nearbySearch(searchRequest, (results: any[], status: string) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        console.warn('NearbySearch status:', status);
        resolve([]);
        return;
      }

      const places: PlaceResult[] = results.slice(0, 20).map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        vicinity: place.vicinity || place.formatted_address || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        photoRef: place.photos?.[0]?.photo_reference,
        openNow: place.opening_hours?.open_now,
        types: place.types || [],
        formattedAddress: place.formatted_address,
      }));

      resolve(places);
    });
  });
}

/**
 * Search for top-rated restaurants in a location
 */
export async function searchTopRatedRestaurants(
  location: { lat: number; lng: number },
  apiKey: string,
  radius: number = 2000
): Promise<PlaceResult[]> {
  const results = await nearbySearch(
    {
      location,
      radius,
      type: 'restaurant',
      keyword: 'restaurant cafe food',
    },
    apiKey
  );

  return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Search for tourist attractions and landmarks (monuments)
 */
export async function searchTouristAttractions(
  location: { lat: number; lng: number },
  apiKey: string,
  radius: number = 2000
): Promise<PlaceResult[]> {
  const results = await nearbySearch(
    {
      location,
      radius,
      type: 'tourist_attraction',
      keyword: 'tourist attraction landmark historic monument',
    },
    apiKey
  );

  return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Search for activities/entertainment venues
 */
export async function searchActivities(
  location: { lat: number; lng: number },
  apiKey: string,
  radius: number = 2000
): Promise<PlaceResult[]> {
  const results = await nearbySearch(
    {
      location,
      radius,
      type: 'tourist_attraction',
      keyword: 'activities spa tour adventure park amusement',
    },
    apiKey
  );

  return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Get place details (phone, website, etc.)
 */
export async function getPlaceDetails(placeId: string, apiKey: string) {
  const google = (window as any).google;

  if (!google?.maps?.places) {
    throw new Error('Google Maps Places library not loaded');
  }

  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    const service = new google.maps.places.PlacesService(container);

    service.getDetails(
      {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'formatted_phone_number',
          'website',
          'opening_hours',
          'rating',
          'user_ratings_total',
          'reviews',
          'photos',
        ],
      },
      (result: any, status: string) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Place details error: ${status}`));
        }
      }
    );
  });
}

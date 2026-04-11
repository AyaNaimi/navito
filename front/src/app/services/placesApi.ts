import { MapMarkerData } from '../components/CurrentLocationMap';

export interface PlaceItem {
  id: number;
  type: 'restaurant' | 'monument' | 'activity';
  name: string;
  city: string;
  address?: string;
  phone?: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  price: string | number;
  image: string;
  description: string;
  // Extra fields to avoid breaking the Detail pages
  cuisine?: string;
  duration?: string;
  hours?: string;
  avgPrice?: number;
  tips?: string;
  groupSize?: string;
  includes?: string;
  isPromoted?: boolean;
}

// Ensure the API call doesn't hang forever
const TIMEOUT_MS = 15000;

export async function fetchRealPlacesLocal(lat: number, lng: number, radiusMs: number = 3000): Promise<PlaceItem[]> {
  const overpassQuery = `
    [out:json][timeout:10];
    (
      node["amenity"="restaurant"](around:${radiusMs},${lat},${lng});
      node["historic"](around:${radiusMs},${lat},${lng});
      node["tourism"="museum"](around:${radiusMs},${lat},${lng});
      node["tourism"="attraction"](around:${radiusMs},${lat},${lng});
      way["amenity"="restaurant"](around:${radiusMs},${lat},${lng});
      way["historic"](around:${radiusMs},${lat},${lng});
      way["tourism"="museum"](around:${radiusMs},${lat},${lng});
      way["tourism"="attraction"](around:${radiusMs},${lat},${lng});
    );
    out center 40;
  `;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    // We send POST request to Overpass API to get elements
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Overpass API responded with ${response.status}`);
    }

    const data = await response.json();
    const elements = data.elements || [];

    const results: PlaceItem[] = [];

    elements.forEach((el: any) => {
      // Overpass nodes have lat/lon directly, ways have it inside center object
      const elementLat = el.lat || (el.center && el.center.lat);
      const elementLng = el.lon || (el.center && el.center.lon);
      
      const name = el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:fr'];
      if (!name || !elementLat || !elementLng) return;

      const isRestaurant = el.tags?.amenity === 'restaurant' || el.tags?.amenity === 'cafe' || el.tags?.amenity === 'fast_food';
      const isMonument = el.tags?.historic || el.tags?.tourism === 'museum' || el.tags?.tourism === 'monument';

      let type: 'restaurant' | 'monument' | 'activity' = 'activity';
      if (isRestaurant) type = 'restaurant';
      else if (isMonument) type = 'monument';

      // Extract real address bits
      const street = el.tags?.['addr:street'];
      const houseNumber = el.tags?.['addr:housenumber'];
      const fullAddress = street ? `${houseNumber ? houseNumber + ' ' : ''}${street}` : undefined;
      const realCity = el.tags?.['addr:city'] || el.tags?.['is_in:city'] || 'Location';
      const phone = el.tags?.phone || el.tags?.['contact:phone'];

      // Use more deterministic mock rating based on ID
      const rating = Number(((el.id % 15) / 10 + 3.5).toFixed(1));
      const reviews = (el.id % 500) + 10;
      
      // Determine image logically
      let img = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'; // generic
      if (isRestaurant) img = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
      if (type === 'monument' && !isRestaurant) img = 'https://images.unsplash.com/photo-1548013149-16010375f426?auto=format&fit=crop&w=800&q=80';

      results.push({
        id: el.id,
        type,
        name,
        city: realCity,
        address: fullAddress,
        phone: phone,
        lat: elementLat,
        lng: elementLng,
        rating: isNaN(rating) ? 4.2 : rating,
        reviews,
        price: isRestaurant ? (el.id % 150) + 50 : 'Free',
        avgPrice: isRestaurant ? (el.id % 150) + 50 : 0,
        image: img,
        description: el.tags?.description || el.tags?.wikipedia || `Welcome to ${name}, located in a great area. Expand this description logically or read more about it online.`,
        cuisine: el.tags?.cuisine || 'Local',
        hours: el.tags?.opening_hours || '9:00 AM - 5:00 PM',
        duration: '1-2 hours',
        tips: 'Highly recommended by locals. Perfect spot for tourists.',
        groupSize: '1-10 people',
        includes: 'Entrance, Guided suggestions',
      });
    });

    return results;
  } catch (error) {
    console.warn('Real Places API Call Failed', error);
    return []; // Return fallback / empty if rate limit or network error
  }
}

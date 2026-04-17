/**
 * Overpass API Service
 * 
 * Query OpenStreetMap data using Overpass API (free, no key needed)
 * Finds restaurants, monuments, and activities from OSM data
 */

export interface OSMPlace {
  id: number;
  name?: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'monument' | 'activity';
  tags?: Record<string, string>;
  category?: string;
  openingHours?: string;
  website?: string;
  phone?: string;
}

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

/**
 * Build Overpass QL query for places
 */
function buildOverpassQuery(
  lat: number,
  lng: number,
  radius: number,
  placeType: 'restaurant' | 'monument' | 'activity'
): string {
  const bbox = getBbox(lat, lng, radius);

  const queries = {
    restaurant: `
      [bbox:${bbox}];
      (
        node["amenity"="restaurant"];
        node["amenity"="cafe"];
        node["amenity"="bar"];
        way["amenity"="restaurant"];
        way["amenity"="cafe"];
        way["amenity"="bar"];
      );
      out geom;
    `,
    monument: `
      [bbox:${bbox}];
      (
        node["historic"~"memorial|monument|ruins|castle|arch"];
        node["tourism"~"attraction|museum|historical"];
        node["building"="castle"];
        way["historic"~"memorial|monument|ruins|castle|arch"];
        way["tourism"~"attraction|museum"];
      );
      out geom;
    `,
    activity: `
      [bbox:${bbox}];
      (
        node["leisure"~"park|playground|sports_centre|swimming_pool"];
        node["tourism"="theme_park"];
        node["amenity"~"spa|gym|cinema"];
        way["leisure"~"park|playground|sports_centre"];
        way["tourism"="theme_park"];
      );
      out geom;
    `,
  };

  return queries[placeType];
}

/**
 * Calculate bounding box from center and radius
 * Returns: south,west,north,east
 */
function getBbox(lat: number, lng: number, radiusMeters: number): string {
  const radiusDeg = radiusMeters / 111000; // approximate degrees
  
  return [
    (lat - radiusDeg).toFixed(4),
    (lng - radiusDeg).toFixed(4),
    (lat + radiusDeg).toFixed(4),
    (lng + radiusDeg).toFixed(4),
  ].join(',');
}

/**
 * Query Overpass API for places
 */
export async function queryOverpassAPI(
  lat: number,
  lng: number,
  radius: number,
  placeType: 'restaurant' | 'monument' | 'activity'
): Promise<OSMPlace[]> {
  try {
    const query = buildOverpassQuery(lat, lng, radius, placeType);

    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    const places = parseOverpassResponse(data, placeType);

    return places.sort((a, b) => {
      // Sort by name or category
      const nameA = a.name || a.category || '';
      const nameB = b.name || b.category || '';
      return nameA.localeCompare(nameB);
    });
  } catch (error) {
    console.error('Overpass API error:', error);
    return [];
  }
}

/**
 * Parse Overpass API response
 */
function parseOverpassResponse(
  data: any,
  placeType: 'restaurant' | 'monument' | 'activity'
): OSMPlace[] {
  if (!data.elements) return [];

  return data.elements
    .filter((el: any) => el.lat && el.lon)
    .filter((el: any) => el.tags?.name) // Only with names
    .slice(0, 50) // Limit to 50 results
    .map((element: any) => {
      const tags = element.tags || {};
      const category = getPlaceCategory(tags, placeType);

      return {
        id: element.id,
        name: tags.name || 'Unknown',
        lat: element.lat,
        lng: element.lon,
        type: placeType,
        tags,
        category,
        openingHours: tags.opening_hours,
        website: tags.website || tags.contact?.website,
        phone: tags.phone || tags.contact?.phone,
      };
    });
}

/**
 * Determine place category from OSM tags
 */
function getPlaceCategory(tags: Record<string, string>, type: string): string {
  if (type === 'restaurant') {
    return tags.amenity === 'cafe' ? 'Café' : 'Restaurant';
  }
  if (type === 'monument') {
    if (tags.historic) {
      const historic = tags.historic;
      return historic.includes('castle') ? 'Castle' :
             historic.includes('monument') ? 'Monument' :
             historic.includes('ruins') ? 'Ruins' : 'Historic Site';
    }
    return tags.tourism === 'museum' ? 'Museum' : 'Attraction';
  }
  if (type === 'activity') {
    return tags.leisure === 'park' ? 'Park' :
           tags.leisure === 'swimming_pool' ? 'Swimming Pool' :
           tags.leisure === 'sports_centre' ? 'Sports Center' :
           tags.tourism === 'theme_park' ? 'Theme Park' :
           tags.amenity === 'spa' ? 'Spa' : 'Activity';
  }
  return 'Place';
}

/**
 * Get place icon
 */
export function getPlaceIcon(placeType: 'restaurant' | 'monument' | 'activity') {
  const icons = {
    restaurant: '🍽️',
    monument: '🏛️',
    activity: '⚡',
  };
  return icons[placeType];
}

/**
 * Search restaurants
 */
export async function searchRestaurants(
  lat: number,
  lng: number,
  radius: number = 2000
): Promise<OSMPlace[]> {
  return queryOverpassAPI(lat, lng, radius, 'restaurant');
}

/**
 * Search monuments and attractions
 */
export async function searchMonuments(
  lat: number,
  lng: number,
  radius: number = 2000
): Promise<OSMPlace[]> {
  return queryOverpassAPI(lat, lng, radius, 'monument');
}

/**
 * Search activities
 */
export async function searchActivities(
  lat: number,
  lng: number,
  radius: number = 2000
): Promise<OSMPlace[]> {
  return queryOverpassAPI(lat, lng, radius, 'activity');
}

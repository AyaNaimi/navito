import axios from 'axios';

export interface MapPlace {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  image: string;
  price?: string | number;
  category: 'monuments' | 'restaurants' | 'activities';
  tags?: string[];
  description?: string;
}

/**
 * Free Alternative Map Service using stable OpenStreetMap mirrors:
 * - Photon (Komoot) for Search: Extremely fast and generous
 * - OSRM for Routing
 */

const searchCache: Record<string, MapPlace[]> = {};

// Keywords to get better images from Unsplash
const getPremiumImage = (name: string, category: string) => {
  const n = name.toLowerCase();
  if (category === 'restaurants') {
    if (n.includes('cafe')) return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80';
    if (n.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80';
    if (n.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
  }
  
  if (n.includes('mosque')) return 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800&q=80';
  if (n.includes('palace')) return 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e84?w=800&q=80';
  if (n.includes('garden')) return 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80';
  if (n.includes('museum')) return 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80';
  
  return 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?w=800&q=80'; // Default Morocco vibe
};

export const mapService = {
  /**
   * Search for nearby places using Photon by Komoot (Stable, Free, Fast)
   */
  searchPlaces: async (
    query: string, 
    location: { lat: number, lng: number } = { lat: 31.62947, lng: -7.9811 }, 
    type: 'tourist_attraction' | 'restaurant' | 'point_of_interest' = 'tourist_attraction'
  ): Promise<MapPlace[]> => {
    // Generate cache key based on query, type and approximate location (rounded to 2 decimals)
    const latKey = Math.round(location.lat * 100) / 100;
    const lngKey = Math.round(location.lng * 100) / 100;
    const cacheKey = `${query}-${type}-${latKey}-${lngKey}`;
    
    if (searchCache[cacheKey]) return searchCache[cacheKey];

    try {
      // Use the query as is, but bias towards the current location coordinates
      // We don't append a hardcoded city name here to allow the coordinates to do the filtering
      const response = await axios.get(`https://photon.komoot.io/api/`, {
        params: {
          q: query,
          limit: 30,
          lat: location.lat,
          lon: location.lng,
          location_bias_scale: 0.8, // Bias results towards the provided coordinates
          lang: 'fr'
        }
      });

      if (response.data && response.data.features) {
        const results = response.data.features.map((feature: any) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          const isRestaurant = type === 'restaurant' || props.osm_value === 'restaurant' || props.osm_key === 'amenity' || props.type === 'restaurant';
          const cat = isRestaurant ? 'restaurants' : (type === 'tourist_attraction' ? 'monuments' : 'activities');
          
          return {
            id: props.osm_id?.toString() || Math.random().toString(),
            name: props.name || 'Lieu d\'intérêt',
            location: `${props.street || props.district || 'Marrakech'}, ${props.city || 'Médina'}`,
            lat: coords[1],
            lng: coords[0],
            rating: 4.2 + (Math.random() * 0.7),
            reviews: Math.floor(Math.random() * 800) + 50,
            image: getPremiumImage(props.name || '', cat),
            price: isRestaurant ? Math.floor(Math.random() * 200) + 50 : 'Gratuit',
            category: cat,
            tags: [props.osm_value, props.osm_key].filter(Boolean),
            description: `Découvrez ${props.name || 'ce lieu'} au cœur de Marrakech. Un endroit chargé d'histoire et de culture marocaine.`
          };
        });

        searchCache[cacheKey] = results;
        return results;
      }

      return [];
    } catch (error) {
      console.error('Error in searchPlaces:', error);
      return [];
    }
  },

  /**
   * Get directions using OSRM (Free)
   */
  getDirections: async (origin: string, destination: string) => {
    try {
      const geocode = async (name: string) => {
        const res = await axios.get(`https://photon.komoot.io/api/`, {
          params: { q: `${name} Marrakech`, limit: 1 }
        });
        if (res.data.features && res.data.features[0]) {
          const coords = res.data.features[0].geometry.coordinates;
          return { lat: coords[1], lon: coords[0] };
        }
        return null;
      };

      const start = await geocode(origin);
      const end = await geocode(destination);

      if (!start || !end) return null;

      const osrmResponse = await axios.get(
        `http://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
      );

      if (osrmResponse.data.code !== 'Ok') return null;

      const route = osrmResponse.data.routes[0];
      return {
        distanceKm: route.distance / 1000,
        durationMin: Math.ceil(route.duration / 60),
        startLocation: { lat: start.lat, lng: start.lon },
        endLocation: { lat: end.lat, lng: end.lon },
        coordinates: route.geometry.coordinates.map((c: any) => ({
          latitude: c[1],
          longitude: c[0]
        })),
      };
    } catch (error) {
      console.error('Error in getDirections:', error);
      return null;
    }
  },

  /**
   * Get center coordinates for a city
   */
  getCityCoordinates: async (cityName: string, country?: string) => {
    try {
      const searchQuery = country 
        ? `${cityName}, ${country}` 
        : `${cityName}, World`;
      
      const res = await axios.get(`https://photon.komoot.io/api/`, {
        params: { q: searchQuery, limit: 1 }
      });
      if (res.data.features && res.data.features[0]) {
        const coords = res.data.features[0].geometry.coordinates;
        return { lat: coords[1], lng: coords[0] };
      }
    } catch (error) {
      console.error('Error fetching city coordinates:', error);
    }
    return { lat: 31.6295, lng: -7.9811 }; // Fallback to Marrakech
  }
};

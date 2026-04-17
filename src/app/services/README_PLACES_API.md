/**
 * GOOGLE PLACES API INTEGRATION GUIDE
 * ===================================
 * 
 * This guide explains how to use Google Places API with React to search for:
 * - Top-rated restaurants
 * - Tourist attractions and landmarks
 * - Activities and entertainment venues
 * 
 * ## Quick Start
 * 
 * 1. Get API Key:
 *    - Go to https://console.cloud.google.com/
 *    - Create project and enable: Maps JavaScript API + Places API
 *    - Generate API key
 * 
 * 2. Add to .env:
 *    REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
 * 
 * 3. Use the hook:
 *    const { places, loading } = useGooglePlaces({
 *      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
 *      location: { lat: 31.6295, lng: -7.9811 },
 *      type: 'restaurants',
 *    });
 */

// ============================================================================
// FILES IN THIS MODULE
// ============================================================================

/**
 * 1. placesService.ts
 *    Core service functions for Google Places API
 *    
 *    Functions:
 *    - nearbySearch(request, apiKey): Generic nearby search
 *    - searchTopRatedRestaurants(location, apiKey, radius)
 *    - searchTouristAttractions(location, apiKey, radius)
 *    - searchActivities(location, apiKey, radius)
 *    - getPlaceDetails(placeId, apiKey)
 *    - getPhotoUrl(photoRef, apiKey)
 *    - formatPriceLevel(level)
 * 
 *    Types:
 *    - PlaceResult: Individual place data
 *    - NearbySearchRequest: Search parameters
 *    - NearbySearchResponse: API response
 */

/**
 * 2. useGooglePlaces.ts
 *    React hooks for easier integration
 *    
 *    Hooks:
 *    - useGooglePlaces(): Single place type search with caching
 *    - useMultiplePlaces(): Search multiple types at once
 * 
 *    Features:
 *    - Automatic caching (5 minute TTL)
 *    - Error handling
 *    - Request cancellation
 *    - Sorted by rating by default
 */

/**
 * 3. RestaurantLocationFinder.tsx
 *    Complete production-ready component
 *    
 *    Features:
 *    - Interactive map with @vis.gl/react-google-maps
 *    - Restaurant list with cards
 *    - Search/filter by rating
 *    - Photo display
 *    - Click-to-call and website links
 *    - Open/closed status
 * 
 *    Usage:
 *    <RestaurantLocationFinder
 *      apiKey="YOUR_KEY"
 *      city="Marrakech"
 *      location={{ lat: 31.6295, lng: -7.9811 }}
 *      searchType="restaurants"
 *    />
 */

/**
 * 4. PLACES_API_EXAMPLES.tsx
 *    Various usage examples and patterns
 */

// ============================================================================
// API ENDPOINTS REFERENCE
// ============================================================================

/**
 * GOOGLE PLACES NEARBY SEARCH
 * ===========================
 * 
 * Finds places within a specified search radius of a location
 * 
 * REST API: https://maps.googleapis.com/maps/api/place/nearbysearch/json
 * 
 * Parameters:
 * - location (required): latitude,longitude
 * - radius (required): 0-50000 meters
 * - type (optional): restaurant, tourist_attraction, museum, etc.
 * - keyword (optional): search term
 * - rankby (optional): prominence (default) or distance
 * - pagetoken (optional): for pagination
 * 
 * Response includes:
 * - place_id
 * - name
 * - rating (0-5)
 * - user_ratings_total
 * - vicinity
 * - icon
 * - photos (with photo_reference)
 * - opening_hours
 * - price_level (0-4)
 * - types (array of place types)
 * 
 * Limits:
 * - Returns up to 20 results per request
 * - Use pagetoken for more results
 * - Each request = 1-10 API units
 */

/**
 * PLACE DETAILS API
 * =================
 * 
 * Get detailed information about a specific place
 * https://maps.googleapis.com/maps/api/place/details/json
 * 
 * Parameters:
 * - place_id (required)
 * - fields (optional): which fields to return
 * 
 * Important fields:
 * - formatted_phone_number
 * - website
 * - opening_hours.weekday_text
 * - reviews (with ratings and text)
 * - formatted_address
 * - geometry
 * - permanently_closed
 * 
 * Cost: Each request = 1 Place Details API call + field fees
 */

// ============================================================================
// PLACE TYPES & KEYWORDS FOR COMMON SEARCHES
// ============================================================================

export const PLACE_TYPES = {
  RESTAURANTS: {
    types: ['restaurant', 'cafe', 'food'],
    keywords: 'restaurant cafe food dining',
  },
  LANDMARKS: {
    types: ['tourist_attraction', 'museum', 'place_of_worship', 'point_of_interest'],
    keywords: 'tourist attraction landmark historic monument',
  },
  HOTELS: {
    types: ['lodging', 'hotel'],
    keywords: 'hotel accommodation lodging',
  },
  ACTIVITIES: {
    types: ['amusement_park', 'spa', 'gym', 'park', 'stadium'],
    keywords: 'activities spa tour adventure park',
  },
  SHOPPING: {
    types: ['shopping_mall', 'store'],
    keywords: 'shopping mall retail center',
  },
  TRANSPORTATION: {
    types: ['taxi_stand', 'transit_station'],
    keywords: 'taxi transport station',
  },
};

// ============================================================================
// EXAMPLE SEARCHES BY RADIUS
// ============================================================================

export const SEARCH_RADII = {
  NEARBY: 500, // Walk around area
  LOCAL: 1500, // Neighborhood
  CITY: 3000, // City-wide
  REGION: 5000, // Regional search
};

// ============================================================================
// RESPONSIVE USAGE PATTERNS
// ============================================================================

/**
 * PATTERN 1: Search in User's Current Location
 * 
 * const [location, setLocation] = useState(null);
 * 
 * useEffect(() => {
 *   navigator.geolocation.getCurrentPosition((pos) => {
 *     setLocation({
 *       lat: pos.coords.latitude,
 *       lng: pos.coords.longitude,
 *     });
 *   });
 * }, []);
 * 
 * const { places } = useGooglePlaces({
 *   apiKey,
 *   location: location || { lat: 0, lng: 0 },
 *   type: 'restaurants',
 * });
 */

/**
 * PATTERN 2: Search with Dynamic City
 * 
 * Function to get coordinates from city name:
 * 
 * async function getCityCoordinates(cityName: string) {
 *   const response = await fetch(
 *     `https://maps.googleapis.com/maps/api/geocode/json?` +
 *     `address=${encodeURIComponent(cityName)}&key=${apiKey}`
 *   );
 *   const data = await response.json();
 *   return {
 *     lat: data.results[0].geometry.location.lat,
 *     lng: data.results[0].geometry.location.lng,
 *   };
 * }
 */

/**
 * PATTERN 3: Combine with Text Search
 * 
 * For text search (searches by name, not location):
 * Endpoint: https://maps.googleapis.com/maps/api/place/textsearch/json
 * 
 * Useful for:
 * - "Italian restaurants near Paris"
 * - "Coffee shops with wifi"
 */

// ============================================================================
// COST OPTIMIZATION
// ============================================================================

/**
 * API Pricing (as of 2026):
 * 
 * Nearby Search: $2.50 per 1000 requests
 * Place Details: $3.50 per 1000 requests (+$0.50 per field)
 * 
 * Optimization Tips:
 * 1. Use caching (built into useGooglePlaces hook)
 * 2. Limit results with radius parameter
 * 3. Only request needed fields in Place Details
 * 4. Implement pagination with nextPageToken
 * 5. Cache photos locally to avoid re-downloading
 * 
 * Example: Search 1000 restaurants = $2.50
 *          Get details for 100 = $3.50 + field costs
 *          Total ~$6 per 1000 users
 */

// ============================================================================
// COMMON ISSUES & SOLUTIONS
// ============================================================================

export const TROUBLESHOOTING = {
  CORS_ERROR: {
    issue: 'CORS error when calling Places API',
    solution: `
      The Places API must be called from server-side or through a CORS proxy.
      Solution in this code:
      - We use google.maps.places.PlacesService which works client-side
      - It's loaded via @vis.gl/react-google-maps
      - Make sure Maps JS API is loaded before using Places
    `,
  },
  
  EMPTY_RESULTS: {
    issue: 'No results returned for search',
    solution: `
      1. Check location coordinates are correct
      2. Increase search radius
      3. Try different keywords
      4. Verify API has Places API enabled
      5. Check API key restrictions aren't blocking requests
    `,
  },
  
  NO_PHOTOS: {
    issue: 'Place has no photo_reference',
    solution: `
      Not all places have photos.
      - Show a placeholder icon instead
      - Use category icon (utensils for restaurants, etc.)
      - Request Google Business photos separately for premium results
    `,
  },
  
  SLOW_PERFORMANCE: {
    issue: 'Lots of API calls slowing down the app',
    solution: `
      1. Enable caching (default in useGooglePlaces)
      2. Debounce search requests
      3. Use pagination for large result sets
      4. Load place details on-demand, not for all results
      5. Lazy load images with loading="lazy"
    `,
  },
};

// ============================================================================
// ADVANCED FEATURES
// ============================================================================

/**
 * 1. NEARBY SEARCH WITH PAGINATION
 * 
 * The Places API returns up to 20 results per request.
 * For more, use the nextPageToken response parameter.
 * 
 * let allResults = [];
 * let nextToken = null;
 * 
 * do {
 *   const response = await nearbySearch(request, apiKey);
 *   allResults = [...allResults, ...response.results];
 *   nextToken = response.nextPageToken;
 *   
 *   // Wait 2 seconds before requesting next page
 *   if (nextToken) await new Promise(r => setTimeout(r, 2000));
 * } while (nextToken);
 */

/**
 * 2. FILTER RESULTS BY RATING & PRICE
 * 
 * After getting results:
 * 
 * const filteredResults = results
 *   .filter(p => (p.rating || 0) >= minRating)
 *   .filter(p => !minPrice || p.priceLevel >= minPrice)
 *   .filter(p => !maxPrice || p.priceLevel <= maxPrice);
 */

/**
 * 3. SEARCH FOR SPECIFIC CUISINES
 * 
 * Include cuisine in keyword:
 * const keyword = 'Italian restaurant';
 * const keyword = 'Chinese food';
 */

/**
 * 4. REAL-TIME OPEN/CLOSED STATUS
 * 
 * results.map(place => ({
 *   ...place,
 *   status: place.opening_hours?.open_now ? 'Open' : 'Closed'
 * }))
 */

/**
 * 5. DISTANCE CALCULATION
 * 
 * function calculateDistance(lat1, lng1, lat2, lng2) {
 *   const R = 6371; // Earth's radius in km
 *   const dLat = (lat2 - lat1) * Math.PI / 180;
 *   const dLng = (lng2 - lng1) * Math.PI / 180;
 *   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
 *     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
 *     Math.sin(dLng/2) * Math.sin(dLng/2);
 *   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 *   return R * c;
 * }
 * 
 * Then sort: results.sort((a, b) => 
 *   calculateDistance(lat, lng, a.latitude, a.longitude) -
 *   calculateDistance(lat, lng, b.latitude, b.longitude)
 * )
 */

// ============================================================================
// INTEGRATION WITH YOUR EXISTING CODE
// ============================================================================

/**
 * Your app already has PlacesExplorer.tsx which uses a similar approach.
 * This module is designed to be:
 * 
 * 1. COMPLEMENTARY: Re-use with PlacesExplorer if you prefer
 * 2. MORE FOCUSED: Specialized for restaurants + attractions
 * 3. CLEANER: Separates services from components
 * 4. MORE FLEXIBLE: Easy to use in any component
 * 
 * You can:
 * - Use standalone for restaurant/attraction pages
 * - Integrate with existing explore pages
 * - Add to your Tours/Onboarding flow
 * - Use in recommendation engines
 */

export default 'GOOGLE_PLACES_API_DOCUMENTATION';

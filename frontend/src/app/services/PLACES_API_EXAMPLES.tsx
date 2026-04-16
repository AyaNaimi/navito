/**
 * EXAMPLES: Using Google Places API with React
 * 
 * This file demonstrates various ways to integrate Google Places API
 * in your React components for restaurant and landmark search.
 */

// ============================================================================
// EXAMPLE 1: Simple Restaurant Search Hook
// ============================================================================

import { useGooglePlaces } from './useGooglePlaces';
import { Star, MapPin } from 'lucide-react';

export function SimpleRestaurantSearchExample() {
  const { places, loading, error } = useGooglePlaces({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    location: { lat: 31.6295, lng: -7.9811 }, // Marrakech
    type: 'restaurants',
    radius: 2000,
  });

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2>Top Rated Restaurants</h2>
      {places.map((place) => (
        <div key={place.placeId} className="border p-4 rounded">
          <h3 className="font-bold">{place.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4" />
            <span>{place.rating?.toFixed(1)}</span>
            {place.userRatingsTotal && <span>({place.userRatingsTotal})</span>}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{place.vicinity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Restaurant List with Map Integration (@vis.gl/react-google-maps)
// ============================================================================

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface RestaurantMapProps {
  apiKey: string;
  city: string;
  location: { lat: number; lng: number };
}

export function RestaurantWithMapExample({ apiKey, city, location }: RestaurantMapProps) {
  const { places, selectedPlace, setSelectedPlace } = useGooglePlaces({
    apiKey,
    location,
    type: 'restaurants',
  });

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex gap-4 h-screen">
        {/* Map */}
        <div className="flex-1">
          <Map zoom={13} center={location} mapId="restaurant-map">
            {places.map((place) => (
              <AdvancedMarker
                key={place.placeId}
                position={{ lat: place.latitude, lng: place.longitude }}
                onClick={() => setSelectedPlace(place)}
                title={place.name}
              >
                <Pin
                  background={selectedPlace?.placeId === place.placeId ? '#3b82f6' : '#f59e0b'}
                  glyphColor="white"
                />
              </AdvancedMarker>
            ))}
          </Map>
        </div>

        {/* Restaurant List */}
        <div className="w-80 overflow-y-auto border-l">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Restaurants in {city}</h2>
            {places.map((place) => (
              <div
                key={place.placeId}
                className={`p-3 mb-2 cursor-pointer rounded border ${
                  selectedPlace?.placeId === place.placeId
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlace(place)}
              >
                <h3 className="font-semibold">{place.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  <span>{place.rating?.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

// ============================================================================
// EXAMPLE 3: Tourist Attractions/Landmarks Finder
// ============================================================================

import { Building2, Camera } from 'lucide-react';

export function TouristAttractionsExample() {
  const { places, loading } = useGooglePlaces({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    location: { lat: 31.6295, lng: -7.9811 },
    type: 'attractions',
    radius: 3000, // 3km for attractions
  });

  if (loading) return <div>Discovering landmarks...</div>;

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Top Attractions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {places.map((place) => (
          <div key={place.placeId} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2">{place.name}</h3>
              {place.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{place.rating.toFixed(1)}</span>
                </div>
              )}
              <p className="text-xs text-gray-600">{place.vicinity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Multiple Place Types (Restaurants + Attractions + Activities)
// ============================================================================

import { useMultiplePlaces } from './useGooglePlaces';
import { UtensilsCrossed as Utensils } from 'lucide-react';

export function MultiPlaceTypeExample() {
  const { places, loading } = useMultiplePlaces({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    location: { lat: 31.6295, lng: -7.9811 },
    types: ['restaurants', 'attractions', 'activities'],
    radius: 2000,
  });

  if (loading) return <div>Loading...</div>;

  const typeConfig = {
    restaurants: { icon: Utensils, color: 'bg-orange-100' },
    attractions: { icon: Building2, color: 'bg-blue-100' },
    activities: { icon: Camera, color: 'bg-green-100' },
  };

  return (
    <div className="space-y-6">
      {Object.entries(places).map(([type, placeList]) => {
        if (placeList.length === 0) return null;
        const config = typeConfig[type as keyof typeof typeConfig];
        const Icon = config.icon;

        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5" />
              <h3 className="text-lg font-semibold capitalize">{type}</h3>
            </div>
            <div className="grid gap-3">
              {placeList.slice(0, 5).map((place) => (
                <div
                  key={place.placeId}
                  className={`p-3 rounded ${config.color} cursor-pointer hover:shadow`}
                >
                  <h4 className="font-semibold">{place.name}</h4>
                  {place.rating && (
                    <p className="text-xs">⭐ {place.rating.toFixed(1)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: With Place Details (Phone, Website, Hours)
// ============================================================================

import { Phone, ExternalLink, Clock } from 'lucide-react';

export function RestaurantDetailsExample() {
  const { places, selectedPlace, setSelectedPlace, getDetails } = useGooglePlaces({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    location: { lat: 31.6295, lng: -7.9811 },
    type: 'restaurants',
  });

  const [details, setDetails] = React.useState<any>(null);

  const handleSelectPlace = async (place) => {
    setSelectedPlace(place);
    try {
      const placeDetails = await getDetails(place.placeId);
      setDetails(placeDetails);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Restaurant List */}
      <div className="border rounded">
        <div className="p-4 border-b">
          <h3 className="font-bold">Restaurants</h3>
        </div>
        <div className="overflow-y-auto max-h-96">
          {places.map((place) => (
            <div
              key={place.placeId}
              className={`p-3 border-b cursor-pointer ${
                selectedPlace?.placeId === place.placeId ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectPlace(place)}
            >
              <h4 className="font-semibold text-sm">{place.name}</h4>
              <p className="text-xs text-gray-600">{place.vicinity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="border rounded p-4">
        {selectedPlace ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{selectedPlace.name}</h3>

            {/* Rating */}
            {selectedPlace.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span>{selectedPlace.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-600">
                  ({selectedPlace.userRatingsTotal} reviews)
                </span>
              </div>
            )}

            {/* Address */}
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{selectedPlace.vicinity}</span>
            </div>

            {/* Phone */}
            {details?.formatted_phone_number && (
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${details.formatted_phone_number}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {details.formatted_phone_number}
                </a>
              </div>
            )}

            {/* Website */}
            {details?.website && (
              <div className="flex gap-2 items-center">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            {/* Hours */}
            {details?.opening_hours && (
              <div className="flex gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  {details.opening_hours.open_now ? (
                    <span className="text-green-600 font-semibold">Open Now</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Closed</span>
                  )}
                  {details.opening_hours.weekday_text && (
                    <ul className="mt-2 space-y-1">
                      {details.opening_hours.weekday_text.map((day, i) => (
                        <li key={i} className="text-xs">
                          {day}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select a restaurant to see details</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Usage in Main App - How to Setup
// ============================================================================

/**
 * In your main App.tsx or routing configuration:
 * 
 * 1. Add environment variable to .env:
 *    REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
 * 
 * 2. Enable these APIs in Google Cloud Console:
 *    - Maps JavaScript API
 *    - Places API
 *    - Natural Language API (optional)
 * 
 * 3. Set API key restrictions:
 *    - Application restrictions: HTTP referrers
 *    - API restrictions: Select the APIs above
 * 
 * 4. Use in your routes:
 * 
 *    import RestaurantLocationFinder from './pages/RestaurantLocationFinder';
 *    
 *    <Route
 *      path="/restaurants"
 *      element={
 *        <RestaurantLocationFinder
 *          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
 *          city="Marrakech"
 *          location={{ lat: 31.6295, lng: -7.9811 }}
 *        />
 *      }
 *    />
 */

export const SETUP_INSTRUCTIONS = `
SETUP INSTRUCTIONS FOR GOOGLE PLACES API
=========================================

1. CREATE GOOGLE CLOUD PROJECT
   - Go to https://console.cloud.google.com/
   - Create a new project
   - Enable billing

2. ENABLE REQUIRED APIS
   - Maps JavaScript API
   - Places API
   - Geolocation API (optional)

3. CREATE API KEY
   - Go to Credentials
   - Create API Key
   - Restrict to HTTP referrers (your domain)
   - Restrict API access to: Maps JS, Places API

4. SET ENVIRONMENT VARIABLE
   In .env file:
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here

5. INSTALL DEPENDENCIES
   npm install @vis.gl/react-google-maps

6. USE IN COMPONENTS
   import { useGooglePlaces } from './services/useGooglePlaces';
   
   const { places, loading } = useGooglePlaces({
     apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
     location: { lat: 31.6295, lng: -7.9811 },
     type: 'restaurants',
   });
`;

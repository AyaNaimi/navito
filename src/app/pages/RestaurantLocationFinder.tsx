/**
 * RestaurantLocationFinder Component
 * 
 * Features:
 * - Search for top-rated restaurants in a specific city
 * - Display restaurants on Google Map with custom markers
 * - Show restaurant details (name, rating, photos, address)
 * - Filter and sort results
 * - Uses @vis.gl/react-google-maps for map rendering
 * 
 * Usage:
 * <RestaurantLocationFinder
 *   apiKey="YOUR_GOOGLE_MAPS_API_KEY"
 *   city="Marrakech"
 *   location={{ lat: 31.6295, lng: -7.9811 }}
 * />
 */

import { useCallback, useEffect, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Loader2,
  MapPin,
  Phone,
  ExternalLink,
  Star,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  searchTopRatedRestaurants,
  searchTouristAttractions,
  getPhotoUrl,
  formatPriceLevel,
  PlaceResult,
} from '../services/placesService';

interface RestaurantLocationFinderProps {
  /** Your Google Maps JavaScript API key */
  apiKey: string;
  /** City name for display */
  city: string;
  /** Center location coordinates */
  location: { lat: number; lng: number };
  /** Search radius in meters (default: 2000) */
  radius?: number;
  /** Which type to search: 'restaurants' or 'attractions' */
  searchType?: 'restaurants' | 'attractions';
}

/**
 * Individual restaurant/place card component
 */
function PlaceCard({
  place,
  apiKey,
  isSelected,
  onSelect,
}: {
  place: PlaceResult;
  apiKey: string;
  isSelected: boolean;
  onSelect: (place: PlaceResult) => void;
}) {
  const photoUrl = place.photoRef ? getPhotoUrl(place.photoRef, apiKey, 300) : null;
  const priceLabel = formatPriceLevel(place.priceLevel);

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent shadow'
      }`}
      onClick={() => onSelect(place)}
    >
      {/* Photo */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={place.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-gray-300" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{place.name}</h3>

        {/* Rating */}
        {place.rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{place.rating.toFixed(1)}</span>
            </div>
            {place.userRatingsTotal && (
              <span className="text-sm text-gray-600">
                ({place.userRatingsTotal.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        {/* Address */}
        <div className="flex gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{place.vicinity}</span>
        </div>

        {/* Price Level */}
        {priceLabel && (
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{priceLabel}</span>
            {place.openNow !== undefined && (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  place.openNow
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {place.openNow ? 'Open Now' : 'Closed'}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {place.phoneNumber && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${place.phoneNumber}`;
              }}
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          )}
          {place.website && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(place.website, '_blank');
              }}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Site
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Map component with markers
 */
function MapView({
  apiKey,
  location,
  places,
  selectedPlace,
  onPlaceSelect,
}: {
  apiKey: string;
  location: { lat: number; lng: number };
  places: PlaceResult[];
  selectedPlace: PlaceResult | null;
  onPlaceSelect: (place: PlaceResult) => void;
}) {
  const map = useMap();

  return (
    <Map
      zoom={13}
      center={location}
      mapId="restaurant-map"
      onClick={() => onPlaceSelect(null)}
    >
      {/* Center marker */}
      <AdvancedMarker
        position={location}
        title="Search center"
      >
        <Pin background="blue" borderColor="blue" glyphColor="white" />
      </AdvancedMarker>

      {/* Place markers */}
      {places.map((place) => (
        <AdvancedMarker
          key={place.placeId}
          position={{ lat: place.latitude, lng: place.longitude }}
          onClick={() => onPlaceSelect(place)}
          title={place.name}
        >
          <Pin
            background={selectedPlace?.placeId === place.placeId ? '#3b82f6' : '#f59e0b'}
            borderColor={selectedPlace?.placeId === place.placeId ? '#1e3a8a' : '#b45309'}
            glyphColor="white"
          />
        </AdvancedMarker>
      ))}

      {/* InfoWindow for selected place */}
      {selectedPlace && (
        <InfoWindow
          position={{
            lat: selectedPlace.latitude,
            lng: selectedPlace.longitude,
          }}
          onCloseClick={() => onPlaceSelect(null)}
        >
          <div className="p-2 max-w-xs">
            <h4 className="font-bold mb-1">{selectedPlace.name}</h4>
            {selectedPlace.rating && (
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{selectedPlace.rating.toFixed(1)}</span>
              </div>
            )}
            <p className="text-xs text-gray-600">{selectedPlace.vicinity}</p>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

/**
 * Main component
 */
export default function RestaurantLocationFinder({
  apiKey,
  city,
  location,
  radius = 2000,
  searchType = 'restaurants',
}: RestaurantLocationFinderProps) {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'distance'>('rating');
  const [expandedCards, setExpandedCards] = useState<boolean>(true);

  // Fetch places on mount or when parameters change
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const results =
          searchType === 'restaurants'
            ? await searchTopRatedRestaurants(location, apiKey, radius)
            : await searchTouristAttractions(location, apiKey, radius);

        // Sort by rating (or distance could be implemented)
        const sorted = results.sort((a, b) =>
          sortBy === 'rating' ? (b.rating || 0) - (a.rating || 0) : 0
        );

        setPlaces(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch places');
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [location, apiKey, radius, searchType, sortBy]);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold mb-4">
            {searchType === 'restaurants'
              ? `Top Restaurants in ${city}`
              : `Tourist Attractions in ${city}`}
          </h1>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance')}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedCards(!expandedCards)}
            >
              {expandedCards ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-4 overflow-hidden p-4">
          {/* Map */}
          <div className="flex-1 rounded-lg overflow-hidden">
            <MapView
              apiKey={apiKey}
              location={location}
              places={places}
              selectedPlace={selectedPlace}
              onPlaceSelect={setSelectedPlace}
            />
          </div>

          {/* Places List */}
          <div
            className={`overflow-y-auto transition-all ${
              expandedCards ? 'w-96' : 'w-0'
            }`}
          >
            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-2">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && places.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                No places found
              </div>
            )}

            <div className="space-y-3 p-2">
              {places.map((place) => (
                <PlaceCard
                  key={place.placeId}
                  place={place}
                  apiKey={apiKey}
                  isSelected={selectedPlace?.placeId === place.placeId}
                  onSelect={setSelectedPlace}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

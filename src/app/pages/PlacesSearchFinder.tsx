/**
 * PlacesSearchFinder - Working Component for Google Places API
 * 
 * Searches for restaurants, monuments, and activities using Google Places API
 * Supports multiple search types with interactive map and cards
 * 
 * Usage:
 * <PlacesSearchFinder
 *   apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
 *   location={{ lat: 31.6295, lng: -7.9811 }}
 *   city="Marrakech"
 * />
 */

import { useCallback, useEffect, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from '@vis.gl/react-google-maps';
import {
  Loader2,
  MapPin,
  Star,
  Building2,
  UtensilsCrossed,
  Zap,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useGooglePlaces } from '../services/useGooglePlaces';
import { getPhotoUrl, formatPriceLevel } from '../services/placesService';

interface PlacesSearchFinderProps {
  apiKey: string;
  location: { lat: number; lng: number };
  city: string;
  radius?: number;
}

const SEARCH_TYPES = {
  restaurants: {
    label: 'Restaurants',
    icon: UtensilsCrossed,
    color: '#f59e0b',
    pinBg: '#f59e0b',
  },
  monuments: {
    label: 'Monuments & Attractions',
    icon: Building2,
    color: '#6366f1',
    pinBg: '#6366f1',
  },
  activities: {
    label: 'Activities',
    icon: Zap,
    color: '#10b981',
    pinBg: '#10b981',
  },
};

type SearchKey = 'restaurants' | 'monuments' | 'activities';

interface PlaceCardProps {
  place: any;
  apiKey: string;
  isSelected: boolean;
  onSelect: (place: any) => void;
  typeConfig: (typeof SEARCH_TYPES)[SearchKey];
}

function PlaceCard({ place, apiKey, isSelected, onSelect, typeConfig }: PlaceCardProps) {
  const Icon = typeConfig.icon;
  const photoUrl = place.photoRef ? getPhotoUrl(place.photoRef, apiKey, 300) : null;
  const priceLabel = formatPriceLevel(place.priceLevel);

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all border-2 relative ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
      onClick={() => onSelect(place)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(place)}
    >
      {/* Photo */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={place.name}
          className="w-full h-40 object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {/* Badge */}
      <div
        className="absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1"
        style={{ backgroundColor: typeConfig.color }}
      >
        <Icon className="w-3 h-3" />
        {typeConfig.label}
      </div>

      {/* Content */}
      <div className="p-3 relative">
        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">{place.name}</h3>

        {/* Rating */}
        {place.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-700">{place.rating.toFixed(1)}</span>
            {place.userRatingsTotal && (
              <span className="text-xs text-gray-500">({place.userRatingsTotal})</span>
            )}
          </div>
        )}

        {/* Address */}
        <div className="flex gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{place.vicinity}</span>
        </div>

        {/* Status & Price */}
        <div className="flex gap-2 flex-wrap">
          {place.openNow !== undefined && (
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                place.openNow
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {place.openNow ? 'Open' : 'Closed'}
            </span>
          )}
          {priceLabel && (
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
              {priceLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MapSection({
  apiKey,
  location,
  places,
  selectedPlace,
  onSelectPlace,
  typeConfig,
}: {
  apiKey: string;
  location: { lat: number; lng: number };
  places: any[];
  selectedPlace: any | null;
  onSelectPlace: (place: any) => void;
  typeConfig: (typeof SEARCH_TYPES)[SearchKey];
}) {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        zoom={13}
        center={location}
        mapId="places-map"
        onClick={() => onSelectPlace(null)}
      >
        {/* Center marker */}
        <AdvancedMarker position={location} title={`Center`}>
          <Pin background="blue" borderColor="blue" glyphColor="white" />
        </AdvancedMarker>

        {/* Place markers */}
        {places.map((place) => (
          <AdvancedMarker
            key={place.placeId}
            position={{ lat: place.latitude, lng: place.longitude }}
            onClick={() => onSelectPlace(place)}
            title={place.name}
          >
            <Pin
              background={selectedPlace?.placeId === place.placeId ? '#3b82f6' : typeConfig.pinBg}
              borderColor={selectedPlace?.placeId === place.placeId ? '#1e40af' : typeConfig.pinBg}
              glyphColor="white"
            />
          </AdvancedMarker>
        ))}

        {/* Info window for selected place */}
        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.latitude,
              lng: selectedPlace.longitude,
            }}
            onCloseClick={() => onSelectPlace(null)}
          >
            <div className="p-2 max-w-xs">
              <h4 className="font-bold text-sm mb-1">{selectedPlace.name}</h4>
              {selectedPlace.rating && (
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  <span className="text-xs">{selectedPlace.rating.toFixed(1)}</span>
                </div>
              )}
              <p className="text-xs text-gray-600">{selectedPlace.vicinity}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}


export default function PlacesSearchFinder({
  apiKey,
  location,
  city,
  radius = 2000,
}: PlacesSearchFinderProps) {
  const [activeTab, setActiveTab] = useState<SearchKey>('restaurants');
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Fetch all three types simultaneously
  const restaurantsQuery = useGooglePlaces({
    apiKey,
    location,
    radius,
    type: 'restaurants',
    autoFetch: true,
  });

  const monumentsQuery = useGooglePlaces({
    apiKey,
    location,
    radius,
    type: 'attractions',
    autoFetch: true,
  });

  const activitiesQuery = useGooglePlaces({
    apiKey,
    location,
    radius,
    type: 'activities',
    autoFetch: true,
  });

  const queries = {
    restaurants: restaurantsQuery,
    monuments: monumentsQuery,
    activities: activitiesQuery,
  };

  const currentQuery = queries[activeTab];
  const typeConfig = SEARCH_TYPES[activeTab];

  // Handle tab change and reset selected place
  const handleTabChange = (tab: SearchKey) => {
    setActiveTab(tab);
    setSelectedPlace(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Explore {city}</h1>
          <p className="text-sm text-gray-600">
            Discover restaurants, monuments, and activities around you
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(Object.entries(SEARCH_TYPES) as [SearchKey, (typeof SEARCH_TYPES)[SearchKey]][]).map(
            ([key, config]) => {
              const Icon = config.icon;
              const query = queries[key];
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === key
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    activeTab === key ? { backgroundColor: config.color } : undefined
                  }
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                  {query.places.length > 0 && (
                    <span className="text-xs ml-1 opacity-90">({query.places.length})</span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Map */}
        <div className="flex-1 rounded-lg overflow-hidden border border-gray-200">
          {currentQuery.error ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{currentQuery.error}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Please check your API key in the .env file
                </p>
              </div>
            </div>
          ) : (
            <MapSection
              apiKey={apiKey}
              location={location}
              places={currentQuery.places}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
              typeConfig={typeConfig}
            />
          )}
        </div>

        {/* Places List */}
        <div className="w-80 bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col">
          {/* List Header */}
          <div className="p-3 border-b flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm">{typeConfig.label}</h2>
              <p className="text-xs text-gray-600">
                {currentQuery.loading ? 'Loading...' : `${currentQuery.places.length} found`}
              </p>
            </div>
            {currentQuery.loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {currentQuery.error && (
              <div className="p-4 m-2 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700 text-xs">{currentQuery.error}</p>
              </div>
            )}

            {!currentQuery.loading && currentQuery.places.length === 0 && !currentQuery.error && (
              <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                <div className="text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  No {typeConfig.label.toLowerCase()} found
                </div>
              </div>
            )}

            <div className="space-y-2 p-2">
              {currentQuery.places.map((place) => (
                <PlaceCard
                  key={place.placeId}
                  place={place}
                  apiKey={apiKey}
                  isSelected={selectedPlace?.placeId === place.placeId}
                  onSelect={setSelectedPlace}
                  typeConfig={typeConfig}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * OpenStreetMapFinder Component
 * 
 * Search restaurants, monuments, and activities on OpenStreetMap
 * No API key needed - completely free!
 * 
 * Uses:
 * - Leaflet for map display
 * - Overpass API for place data
 * - React Leaflet for React integration
 */

import React, { useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import {
  Loader2,
  MapPin,
  AlertCircle,
  Search,
  Phone,
  Globe,
  Clock,
  Building2,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { useOpenStreetMap } from '../services/useOpenStreetMap';
import { getPlaceIcon, OSMPlace } from '../services/overpassService';

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
  });
};

interface OpenStreetMapFinderProps {
  location: { lat: number; lng: number };
  city: string;
  radius?: number;
}

const SEARCH_TYPES = {
  restaurants: {
    label: 'Restaurants',
    icon: UtensilsCrossed,
    color: '#f59e0b',
    markerColor: '#f59e0b',
  },
  monuments: {
    label: 'Monuments & Attractions',
    icon: Building2,
    color: '#6366f1',
    markerColor: '#6366f1',
  },
  activities: {
    label: 'Activities',
    icon: Zap,
    color: '#10b981',
    markerColor: '#10b981',
  },
};

type SearchKey = 'restaurants' | 'monuments' | 'activities';

function MarkerCluster({
  places,
  selectedPlace,
  onSelectPlace,
  typeConfig,
}: {
  places: OSMPlace[];
  selectedPlace: OSMPlace | null;
  onSelectPlace: (place: OSMPlace) => void;
  typeConfig: (typeof SEARCH_TYPES)[SearchKey];
}) {
  return (
    <>
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createMarkerIcon(
            selectedPlace?.id === place.id ? '#3b82f6' : typeConfig.markerColor
          )}
          eventHandlers={{
            click: () => onSelectPlace(place),
          }}
        >
          <Popup closeButton={true}>
            <div className="w-48" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-sm mb-2">{place.name}</h3>
              {place.category && (
                <p className="text-xs text-gray-600 mb-2">{place.category}</p>
              )}
              <div className="text-xs space-y-1">
                {place.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
                      {place.phone}
                    </a>
                  </div>
                )}
                {place.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                {place.openingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{place.openingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function PlaceItemCard({
  place,
  isSelected,
  onSelect,
  typeConfig,
}: {
  place: OSMPlace;
  isSelected: boolean;
  onSelect: (place: OSMPlace) => void;
  typeConfig: (typeof SEARCH_TYPES)[SearchKey];
}) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
        isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={() => onSelect(place)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(place)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{place.name}</h3>
          {place.category && (
            <p className="text-xs text-gray-600 mt-1">{place.category}</p>
          )}
        </div>
        <span className="text-lg flex-shrink-0">{getPlaceIcon(place.type)}</span>
      </div>

      {(place.phone || place.website) && (
        <div className="flex gap-2 mt-2">
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              Call
            </a>
          )}
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
              onClick={(e) => e.stopPropagation()}
            >
              Website
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function MapComponent({
  location,
  places,
  selectedPlace,
  onSelectPlace,
  typeConfig,
}: {
  location: { lat: number; lng: number };
  places: OSMPlace[];
  selectedPlace: OSMPlace | null;
  onSelectPlace: (place: OSMPlace) => void;
  typeConfig: (typeof SEARCH_TYPES)[SearchKey];
}) {
  const mapRef = useRef<L.Map | null>(null);

  useMapEvent('load', () => {
    if (mapRef.current && selectedPlace) {
      mapRef.current.setView([selectedPlace.lat, selectedPlace.lng], 16);
    }
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerCluster
        places={places}
        selectedPlace={selectedPlace}
        onSelectPlace={onSelectPlace}
        typeConfig={typeConfig}
      />
    </>
  );
}

export default function OpenStreetMapFinder({
  location,
  city,
  radius = 2000,
}: OpenStreetMapFinderProps) {
  const [activeTab, setActiveTab] = useState<SearchKey>('restaurants');

  const restaurantsQuery = useOpenStreetMap({
    location,
    radius,
    type: 'restaurants',
  });

  const monumentsQuery = useOpenStreetMap({
    location,
    radius,
    type: 'monuments',
  });

  const activitiesQuery = useOpenStreetMap({
    location,
    radius,
    type: 'activities',
  });

  const queries = {
    restaurants: restaurantsQuery,
    monuments: monumentsQuery,
    activities: activitiesQuery,
  };

  const currentQuery = queries[activeTab];
  const typeConfig = SEARCH_TYPES[activeTab];

  const handleTabChange = (tab: SearchKey) => {
    setActiveTab(tab);
    currentQuery.setSelectedPlace(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Explore {city}
          </h1>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            OpenStreetMap • Free • No API Key Needed
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
                    <span className="text-xs ml-1 opacity-90">
                      ({query.places.length})
                    </span>
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
                <p className="text-sm font-medium text-gray-900">
                  {currentQuery.error}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Please try again or try a different location
                </p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              className="w-full h-full"
            >
              <MapComponent
                location={location}
                places={currentQuery.places}
                selectedPlace={currentQuery.selectedPlace}
                onSelectPlace={currentQuery.setSelectedPlace}
                typeConfig={typeConfig}
              />
            </MapContainer>
          )}
        </div>

        {/* Places List */}
        <div className="w-80 bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col">
          {/* List Header */}
          <div className="p-3 border-b flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm">{typeConfig.label}</h2>
              <p className="text-xs text-gray-600">
                {currentQuery.loading
                  ? 'Loading...'
                  : `${currentQuery.places.length} found`}
              </p>
            </div>
            {currentQuery.loading && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {currentQuery.error && (
              <div className="p-4 m-2 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700 text-xs">{currentQuery.error}</p>
              </div>
            )}

            {!currentQuery.loading &&
              currentQuery.places.length === 0 &&
              !currentQuery.error && (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                  <div className="text-center">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No {typeConfig.label.toLowerCase()} found
                  </div>
                </div>
              )}

            <div className="space-y-2 p-2">
              {currentQuery.places.map((place) => (
                <PlaceItemCard
                  key={place.id}
                  place={place}
                  isSelected={currentQuery.selectedPlace?.id === place.id}
                  onSelect={currentQuery.setSelectedPlace}
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

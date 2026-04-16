/**
 * PlacesExplorer — Navito Travel Assistant
 *
 * Fetches real place data from Google Places API (Nearby Search / Text Search)
 * and renders them as:
 *   • an interactive Google Map (via @vis.gl/react-google-maps) with custom markers
 *   • a scrollable card list on the side / below
 *
 * Usage:
 *   <PlacesExplorer
 *     apiKey="YOUR_GOOGLE_MAPS_API_KEY"
 *     center={{ lat: 31.6295, lng: -7.9811 }}
 *     cityName="Marrakech"
 *   />
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from '@vis.gl/react-google-maps';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Phone,
  Star,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlaceCategory = 'monuments' | 'restaurants' | 'activities';

export type PlaceItem = {
  placeId: string;
  name: string;
  vicinity: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number; // 0-4
  icon?: string;
  photoRef?: string;
  openNow?: boolean;
  types: string[];
  category: PlaceCategory;
  phoneNumber?: string;
  website?: string;
};

export type PlacesExplorerProps = {
  /** Your Google Maps JavaScript API key (must have Places API enabled) */
  apiKey: string;
  /** Map center coordinates */
  center: { lat: number; lng: number };
  /** City display name */
  cityName?: string;
  /** Search radius in meters (default: 3000) */
  radius?: number;
  /** Map height (default: 400px) */
  mapHeight?: string;
  /** Callback when user selects a place */
  onPlaceSelect?: (place: PlaceItem) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  PlaceCategory,
  {
    label: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    pinBg: string;
    pinGlyph: string;
    googleTypes: string[];
    keyword: string;
  }
> = {
  monuments: {
    label: 'Monuments',
    icon: Building2,
    color: '#6366f1',
    pinBg: '#6366f1',
    pinGlyph: '#fff',
    googleTypes: ['tourist_attraction', 'museum', 'place_of_worship', 'point_of_interest'],
    keyword: 'tourist attraction monument historic',
  },
  restaurants: {
    label: 'Restaurants',
    icon: UtensilsCrossed,
    color: '#f59e0b',
    pinBg: '#f59e0b',
    pinGlyph: '#fff',
    googleTypes: ['restaurant', 'cafe', 'food'],
    keyword: 'restaurant cafe food',
  },
  activities: {
    label: 'Activités',
    icon: Zap,
    color: '#10b981',
    pinBg: '#10b981',
    pinGlyph: '#fff',
    googleTypes: ['amusement_park', 'spa', 'gym', 'park', 'stadium'],
    keyword: 'activities spa tour adventure',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPhotoUrl(photoRef: string, apiKey: string, maxWidth = 400) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${apiKey}`;
}

function priceLevelLabel(level?: number) {
  if (level === undefined) return null;
  return ['Gratuit', '$', '$$', '$$$', '$$$$'][level] ?? null;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchNearbyPlaces(
  center: { lat: number; lng: number },
  category: PlaceCategory,
  radius: number,
  apiKey: string,
): Promise<PlaceItem[]> {
  const cfg = CATEGORY_CONFIG[category];

  // We use the Nearby Search endpoint via a CORS proxy or direct (must be server-side in prod).
  // For client-side usage (dev/demo), we call the Maps JS API via the global google.maps object
  // that @vis.gl/react-google-maps loads for us.
  return new Promise((resolve, reject) => {
    const win = window as typeof window & {
      google?: { maps?: { places?: { PlacesService: unknown } } };
    };

    if (!win.google?.maps?.places) {
      reject(new Error('Google Maps Places library not loaded'));
      return;
    }

    // Need a hidden div for PlacesService
    const el = document.createElement('div');
    // @ts-expect-error – dynamic google maps
    const service = new win.google.maps.places.PlacesService(el);

    const request = {
      location: center,
      radius,
      type: cfg.googleTypes[0],
      keyword: cfg.keyword,
    };

    // @ts-expect-error – dynamic google maps
    service.nearbySearch(request, (results, status) => {
      // @ts-expect-error – dynamic google maps
      if (status !== win.google.maps.places.PlacesServiceStatus.OK || !results) {
        // Return empty array instead of rejecting so UI degrades gracefully
        resolve([]);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const places: PlaceItem[] = (results as any[]).slice(0, 20).map((r: any) => ({
        placeId: r.place_id,
        name: r.name,
        vicinity: r.vicinity ?? '',
        lat: r.geometry.location.lat(),
        lng: r.geometry.location.lng(),
        rating: r.rating,
        userRatingsTotal: r.user_ratings_total,
        priceLevel: r.price_level,
        icon: r.icon,
        photoRef: r.photos?.[0]?.photo_reference,
        openNow: r.opening_hours?.open_now,
        types: r.types ?? [],
        category,
      }));

      resolve(places);
    });
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlaceCard({
  place,
  isSelected,
  apiKey,
  onSelect,
}: {
  place: PlaceItem;
  isSelected: boolean;
  apiKey: string;
  onSelect: (p: PlaceItem) => void;
}) {
  const cfg = CATEGORY_CONFIG[place.category];
  const Icon = cfg.icon;
  const photoUrl = place.photoRef ? getPhotoUrl(place.photoRef, apiKey) : null;

  return (
    <div
      onClick={() => onSelect(place)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(place)}
      className="place-card"
      style={{
        borderColor: isSelected ? cfg.color : 'transparent',
        boxShadow: isSelected ? `0 0 0 2px ${cfg.color}40` : undefined,
      }}
    >
      {/* Photo */}
      <div className="place-card__photo">
        {photoUrl ? (
          <img src={photoUrl} alt={place.name} loading="lazy" className="place-card__img" />
        ) : (
          <div className="place-card__img-placeholder">
            <Icon className="place-card__img-icon" style={{ color: cfg.color }} />
          </div>
        )}
        {/* Category badge */}
        <span className="place-card__badge" style={{ background: cfg.color }}>
          <Icon style={{ width: 10, height: 10 }} />
          {cfg.label}
        </span>
        {/* Open/Closed */}
        {place.openNow !== undefined && (
          <span
            className="place-card__open-badge"
            style={{ background: place.openNow ? '#10b981' : '#ef4444' }}
          >
            {place.openNow ? 'Ouvert' : 'Fermé'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="place-card__body">
        <h3 className="place-card__title">{place.name}</h3>

        <div className="place-card__location">
          <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />
          <span>{place.vicinity}</span>
        </div>

        <div className="place-card__meta">
          {place.rating && (
            <span className="place-card__rating">
              <Star style={{ width: 12, height: 12, fill: '#f59e0b', color: '#f59e0b' }} />
              {place.rating.toFixed(1)}
              {place.userRatingsTotal && (
                <span className="place-card__reviews">({place.userRatingsTotal.toLocaleString()})</span>
              )}
            </span>
          )}
          {priceLevelLabel(place.priceLevel) && (
            <span className="place-card__price" style={{ color: cfg.color }}>
              {priceLevelLabel(place.priceLevel)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomMarker({
  place,
  isSelected,
  onSelect,
}: {
  place: PlaceItem;
  isSelected: boolean;
  onSelect: (p: PlaceItem) => void;
}) {
  const cfg = CATEGORY_CONFIG[place.category];

  return (
    <AdvancedMarker
      position={{ lat: place.lat, lng: place.lng }}
      onClick={() => onSelect(place)}
      title={place.name}
    >
      <Pin
        background={isSelected ? '#fff' : cfg.pinBg}
        borderColor={cfg.pinBg}
        glyphColor={isSelected ? cfg.pinBg : cfg.pinGlyph}
        scale={isSelected ? 1.4 : 1.0}
      />
    </AdvancedMarker>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function PlacesExplorerInner({
  apiKey,
  center,
  cityName,
  radius = 3000,
  onPlaceSelect,
  mapHeight = '420px',
}: PlacesExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<PlaceCategory>('monuments');
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [mapId] = useState('navito-places-map');
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch when category or center changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSelectedPlace(null);
    setInfoOpen(false);

    fetchNearbyPlaces(center, activeCategory, radius, apiKey)
      .then((data) => {
        if (!cancelled) {
          setPlaces(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Erreur lors du chargement des lieux');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, center.lat, center.lng, radius, apiKey]);

  const handleSelect = useCallback(
    (place: PlaceItem) => {
      setSelectedPlace(place);
      setInfoOpen(true);
      onPlaceSelect?.(place);

      // Scroll the card list to make the selected card visible
      if (listRef.current) {
        const cardEl = listRef.current.querySelector(`[data-place-id="${place.placeId}"]`);
        cardEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    },
    [onPlaceSelect],
  );

  // Scroll card list left / right
  const scrollList = (dir: 'left' | 'right') => {
    if (!listRef.current) return;
    listRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <div className="places-explorer">
      {/* ── Header ── */}
      <div className="places-explorer__header">
        <div className="places-explorer__title-row">
          <MapPin className="places-explorer__title-icon" />
          <h2 className="places-explorer__title">
            Explorer {cityName ?? 'votre ville'}
          </h2>
          <span className="places-explorer__count">
            {loading ? '…' : `${places.length} lieux`}
          </span>
        </div>

        {/* Category tabs */}
        <div className="places-explorer__tabs">
          {(Object.keys(CATEGORY_CONFIG) as PlaceCategory[]).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const Icon = cfg.icon;
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="places-explorer__tab"
                style={
                  isActive
                    ? { background: cfg.color, color: '#fff', borderColor: cfg.color }
                    : {}
                }
              >
                <Icon style={{ width: 14, height: 14 }} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Map ── */}
      <div className="places-explorer__map-wrapper" style={{ height: mapHeight }}>
        <Map
          mapId={mapId}
          defaultCenter={center}
          center={center}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Markers for all places */}
          {places.map((place) => (
            <CustomMarker
              key={place.placeId}
              place={place}
              isSelected={selectedPlace?.placeId === place.placeId}
              onSelect={handleSelect}
            />
          ))}

          {/* InfoWindow for selected place */}
          {infoOpen && selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div className="places-explorer__infowindow">
                <strong>{selectedPlace.name}</strong>
                <p>{selectedPlace.vicinity}</p>
                {selectedPlace.rating && (
                  <span className="places-explorer__infowindow-rating">
                    ⭐ {selectedPlace.rating.toFixed(1)}
                  </span>
                )}
                {selectedPlace.openNow !== undefined && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      color: selectedPlace.openNow ? '#10b981' : '#ef4444',
                    }}
                  >
                    {selectedPlace.openNow ? '✓ Ouvert' : '✕ Fermé'}
                  </span>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>

        {/* Loading overlay */}
        {loading && (
          <div className="places-explorer__loading-overlay">
            <Loader2 className="places-explorer__spinner" />
            <span>Chargement des lieux…</span>
          </div>
        )}
      </div>

      {/* ── Card list ── */}
      <div className="places-explorer__cards-section">
        {error && (
          <div className="places-explorer__error">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <div className="places-explorer__empty">
            Aucun lieu trouvé dans cette zone. Essayez d'augmenter le rayon de recherche.
          </div>
        )}

        {places.length > 0 && (
          <div className="places-explorer__cards-row">
            <button
              onClick={() => scrollList('left')}
              className="places-explorer__scroll-btn places-explorer__scroll-btn--left"
              aria-label="Précédent"
            >
              <ChevronLeft />
            </button>

            <div ref={listRef} className="places-explorer__cards-list">
              {places.map((place) => (
                <div
                  key={place.placeId}
                  data-place-id={place.placeId}
                  className="places-explorer__card-wrapper"
                >
                  <PlaceCard
                    place={place}
                    isSelected={selectedPlace?.placeId === place.placeId}
                    apiKey={apiKey}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollList('right')}
              className="places-explorer__scroll-btn places-explorer__scroll-btn--right"
              aria-label="Suivant"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* ── Selected place detail panel ── */}
      {selectedPlace && (
        <div
          className="places-explorer__detail"
          style={{ borderLeftColor: CATEGORY_CONFIG[selectedPlace.category].color }}
        >
          <div className="places-explorer__detail-content">
            {/* Image on the left */}
            <div className="places-explorer__detail-image">
              {selectedPlace.photoRef ? (
                <img
                  src={getPhotoUrl(selectedPlace.photoRef, apiKey, 400)}
                  alt={selectedPlace.name}
                  className="places-explorer__detail-img"
                />
              ) : (
                <div
                  className="places-explorer__detail-img-placeholder"
                  style={{ background: CATEGORY_CONFIG[selectedPlace.category].color }}
                >
                  {(() => {
                    const Icon = CATEGORY_CONFIG[selectedPlace.category].icon;
                    return <Icon style={{ width: 32, height: 32, color: '#fff' }} />;
                  })()}
                </div>
              )}
              {/* Category badge on image */}
              <span
                className="places-explorer__detail-img-badge"
                style={{ background: CATEGORY_CONFIG[selectedPlace.category].color }}
              >
                {CATEGORY_CONFIG[selectedPlace.category].label}
              </span>
            </div>

            {/* Details on the right */}
            <div className="places-explorer__detail-info">
              <div className="places-explorer__detail-header">
                <div className="flex-1 min-w-0">
                  <h3 className="places-explorer__detail-name">{selectedPlace.name}</h3>
                  <p className="places-explorer__detail-address">
                    <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />
                    <span className="truncate">{selectedPlace.vicinity}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="places-explorer__detail-close"
                >
                  ✕
                </button>
              </div>

              <div className="places-explorer__detail-meta">
                {selectedPlace.rating && (
                  <span className="places-explorer__detail-meta-item">
                    <Star style={{ width: 13, height: 13, fill: '#f59e0b', color: '#f59e0b' }} />
                    {selectedPlace.rating.toFixed(1)}
                    {selectedPlace.userRatingsTotal && (
                      <span style={{ color: '#9ca3af', marginLeft: 2, fontSize: 11 }}>
                        ({selectedPlace.userRatingsTotal.toLocaleString()})
                      </span>
                    )}
                  </span>
                )}
                {priceLevelLabel(selectedPlace.priceLevel) && (
                  <span
                    className="places-explorer__detail-meta-item"
                    style={{ color: CATEGORY_CONFIG[selectedPlace.category].color }}
                  >
                    {priceLevelLabel(selectedPlace.priceLevel)}
                  </span>
                )}
                {selectedPlace.openNow !== undefined && (
                  <span
                    className="places-explorer__detail-meta-item"
                    style={{ color: selectedPlace.openNow ? '#10b981' : '#ef4444' }}
                  >
                    <Clock style={{ width: 12, height: 12 }} />
                    {selectedPlace.openNow ? 'Ouvert' : 'Fermé'}
                  </span>
                )}
              </div>

              <div className="places-explorer__detail-actions">
                {selectedPlace.phoneNumber && (
                  <a
                    href={`tel:${selectedPlace.phoneNumber}`}
                    className="places-explorer__detail-btn"
                  >
                    <Phone style={{ width: 13, height: 13 }} /> Appeler
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="places-explorer__detail-btn places-explorer__detail-btn--primary"
                  style={{ background: CATEGORY_CONFIG[selectedPlace.category].color }}
                >
                  <ExternalLink style={{ width: 13, height: 13 }} /> Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Export: wraps with APIProvider ──────────────────────────────────────────

export default function PlacesExplorer(props: PlacesExplorerProps) {
  return (
    <APIProvider
      apiKey={props.apiKey}
      libraries={['places']}
    >
      <PlacesExplorerInner {...props} />
    </APIProvider>
  );
}

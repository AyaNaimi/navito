/**
 * Explore.tsx — Navito Travel Assistant
 *
 * Uses backend API to fetch places, activities, and restaurants.
 * Falls back to Google Places API only if VITE_GOOGLE_MAPS_API_KEY is set.
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AlertCircle, ChevronDown, Loader2, MapPin, Navigation, Search } from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import PlacesExplorer from '../components/PlacesExplorer';
import ExploreContent from '../components/ExploreContent';
import { useAppContext } from '../context/AppContext';
import { cities, type City } from '../data/mockData';
import { detectLocation, fetchCities, type ApiCity } from '../services/api';

const GOOGLE_MAPS_API_KEY = (import.meta as unknown as { env: Record<string, string> }).env
  ?.VITE_GOOGLE_MAPS_API_KEY ?? '';

function getCityCoords(cityName: string): { lat: number; lng: number } {
  const found = cities.find((c) => c.name === cityName);
  return found ? { lat: found.lat, lng: found.lng } : { lat: 33.5731, lng: -7.5898 };
}

function getCityId(cityName: string, citiesList: City[]): number | undefined {
  const found = citiesList.find((c) => c.name === cityName);
  return found?.id;
}

type PlacePrediction = {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

function ExploreAddressSearch({
  apiKey,
  country,
  authMode,
  authToken,
  onResolvedLocation,
}: {
  apiKey: string;
  country: string;
  authMode: 'guest' | 'login' | null;
  authToken: string | null;
  onResolvedLocation: (payload: {
    lat: number;
    lng: number;
    label: string;
    city?: string;
    country?: string;
  }) => void;
}) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  useEffect(() => {
    const win = window as typeof window & { google?: any };
    if (!apiKey || !win.google?.maps?.places || autocompleteRef.current) {
      return;
    }

    autocompleteRef.current = new win.google.maps.places.AutocompleteService();
    geocoderRef.current = new win.google.maps.Geocoder();
  }, [apiKey]);

  useEffect(() => {
    const win = window as typeof window & { google?: any };
    if (!query.trim()) {
      setPredictions([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    if (!win.google?.maps?.places || !autocompleteRef.current) {
      setSearchError('La recherche Google Maps est en cours de chargement.');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      setSearchError(null);

      autocompleteRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: country ? { country: country === 'Morocco' ? 'ma' : undefined } : undefined,
          types: ['geocode'],
        },
        (results: PlacePrediction[] | null, status: string) => {
          setIsSearching(false);

          if (status !== win.google.maps.places.PlacesServiceStatus.OK || !results?.length) {
            setPredictions([]);
            if (status !== win.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setSearchError('Aucune suggestion exploitable pour cette adresse.');
            }
            return;
          }

          setPredictions(results);
        },
      );
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [country, query]);

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    const win = window as typeof window & { google?: any };
    if (!geocoderRef.current || !win.google?.maps) {
      setSearchError('Le service de geocodage Google Maps n est pas disponible.');
      return;
    }

    setIsResolving(true);
    setSearchError(null);
    setQuery(prediction.description);
    setPredictions([]);

    geocoderRef.current.geocode(
      { placeId: prediction.place_id },
      async (results: any[] | null, status: string) => {
        if (status !== 'OK' || !results?.length) {
          setIsResolving(false);
          setSearchError('Impossible de centrer la carte sur cette adresse.');
          return;
        }

        const result = results[0];
        const location = result.geometry?.location;
        const lat = typeof location?.lat === 'function' ? location.lat() : null;
        const lng = typeof location?.lng === 'function' ? location.lng() : null;

        if (lat == null || lng == null) {
          setIsResolving(false);
          setSearchError('Coordonnees introuvables pour cette adresse.');
          return;
        }

        const cityComponent = result.address_components?.find((component: any) =>
          component.types?.includes('locality') || component.types?.includes('administrative_area_level_1'),
        );
        const countryComponent = result.address_components?.find((component: any) =>
          component.types?.includes('country'),
        );

        let detectedCity = cityComponent?.long_name ?? '';
        let detectedCountry = countryComponent?.long_name ?? '';

        try {
          const response = await detectLocation(
            { latitude: lat, longitude: lng },
            authMode === 'login' ? authToken : null,
          );

          detectedCity = response.data?.city?.name ?? detectedCity;
          detectedCountry = response.data?.country?.name ?? detectedCountry;
        } catch {
          // We keep the Google-formatted address even if backend reverse-geocoding fails.
        }

        onResolvedLocation({
          lat,
          lng,
          label: result.formatted_address ?? prediction.description,
          city: detectedCity,
          country: detectedCountry,
        });

        setIsResolving(false);
      },
    );
  };

  return (
    <div className="explore-page__search-card">
      <div className="explore-page__search-head">
        <div>
          <p className="explore-page__search-title">Rechercher une adresse precise</p>
          <p className="explore-page__search-text">
            Utilisez Google Maps pour choisir un quartier, un hotel ou une adresse, puis recalculer les recommandations autour.
          </p>
        </div>
      </div>

      <div className="explore-page__search-box">
        <Search className="explore-page__search-icon" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex: Jemaa el-Fna, Marrakech"
          className="explore-page__search-input"
        />
        {(isSearching || isResolving) && <Loader2 className="explore-page__search-spinner" />}
      </div>

      {predictions.length > 0 && (
        <div className="explore-page__search-results">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => void handleSelectPrediction(prediction)}
              className="explore-page__search-result"
            >
              <span className="explore-page__search-result-main">
                {prediction.structured_formatting?.main_text ?? prediction.description}
              </span>
              <span className="explore-page__search-result-secondary">
                {prediction.structured_formatting?.secondary_text ?? prediction.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {searchError && <p className="explore-page__search-feedback is-error">{searchError}</p>}
    </div>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const {
    authMode,
    authToken,
    city,
    country,
    setCity,
    setCountry,
    exploreMode,
    currentPosition,
    useCurrentLocation,
  } = useAppContext();

  const [isApiKeyWarning, setIsApiKeyWarning] = useState(!GOOGLE_MAPS_API_KEY);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [apiCities, setApiCities] = useState<ApiCity[]>([]);

  useEffect(() => {
    fetchCities()
      .then((response) => {
        setApiCities(response.data ?? []);
      })
      .catch(() => {
        setApiCities([]);
      });
  }, []);

  const mapCenter =
    exploreMode === 'current-location' && currentPosition
      ? currentPosition
      : getCityCoords(city);

  const displayCity =
    exploreMode === 'current-location'
      ? locationLabel ?? 'Votre position actuelle'
      : city || 'Maroc';

  const currentCityId = getCityId(city, cities) ?? apiCities.find(c => c.name === city)?.id;

  const handleUsePreciseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalisation n est pas disponible sur cet appareil.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await detectLocation(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            authMode === 'login' ? authToken : null,
          );

          const detectedCountry = response.data?.country?.name ?? '';
          const detectedCity = response.data?.city?.name ?? '';

          if (detectedCountry) {
            setCountry(detectedCountry);
          }
          if (detectedCity) {
            setCity(detectedCity);
          }

          useCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationLabel(
            detectedCity
              ? `${detectedCity}${detectedCountry ? `, ${detectedCountry}` : ''}`
              : 'Votre position actuelle',
          );
        } catch {
          useCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationLabel('Votre position actuelle');
          setLocationError(
            'Position detectee, mais la ville exacte n a pas pu etre resolue. Les recommandations proches restent actives.',
          );
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setLocationError('Impossible d acceder a votre position. Autorisez la localisation pour des recommandations plus precises.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleResolvedAddress = ({
    lat,
    lng,
    label,
    city: resolvedCity,
    country: resolvedCountry,
  }: {
    lat: number;
    lng: number;
    label: string;
    city?: string;
    country?: string;
  }) => {
    if (resolvedCountry) {
      setCountry(resolvedCountry);
    }
    if (resolvedCity) {
      setCity(resolvedCity);
    }

    useCurrentLocation({ lat, lng });
    setLocationLabel(label);
    setLocationError(null);
  };

  return (
    <div className="explore-page">
      <div className="explore-page__topbar">
        <div className="explore-page__topbar-inner">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="explore-page__location-row"
          >
            <MapPin className="explore-page__location-icon" />
            <span className="explore-page__location-label">{displayCity}</span>

            {city && (
              <button
                onClick={() => navigate('/country')}
                className="explore-page__change-btn"
              >
                Changer <ChevronDown style={{ width: 14, height: 14 }} />
              </button>
            )}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="explore-page__title"
          >
            Explorer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="explore-page__subtitle"
          >
            Monuments, restaurants et activites a proximite
          </motion.p>
        </div>
      </div>

      <div className="explore-page__body">
        {isApiKeyWarning && GOOGLE_MAPS_API_KEY && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="explore-page__warning"
          >
            <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
            <div>
              <strong>Cle API Google Maps detectee</strong>
              <p>
                La carte Google Maps est activee. Les lieux seront affiches sur la carte.
              </p>
              <button
                onClick={() => setIsApiKeyWarning(false)}
                className="explore-page__warning-dismiss"
              >
                Masquer
              </button>
            </div>
          </motion.div>
        )}

        {!city && exploreMode !== 'current-location' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="explore-page__no-city"
          >
            <div className="explore-page__no-city-icon">
              <MapPin style={{ width: 56, height: 56, color: '#0D9488' }} />
            </div>
            <h2>Choisissez une ville</h2>
            <p>
              Selectionnez un pays et une ville pour explorer les lieux a
              proximite depuis notre base de donnees.
            </p>
            <button
              onClick={() => navigate('/country')}
              className="explore-page__no-city-btn"
            >
              Choisir une ville
            </button>
          </motion.div>
        )}

        {(city || exploreMode === 'current-location') && GOOGLE_MAPS_API_KEY && (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <div className="explore-page__controls-grid">
              <div className="explore-page__locator-card">
                <div>
                  <p className="explore-page__locator-title">Geolocalisation</p>
                  <p className="explore-page__locator-text">
                    Recentrez la carte sur votre position actuelle pour obtenir des recommandations vraiment proches.
                  </p>
                  {(locationError || (exploreMode === 'current-location' && currentPosition)) && (
                    <p className={`explore-page__locator-feedback ${locationError ? 'is-error' : 'is-success'}`}>
                      {locationError
                        ? locationError
                        : `Position active: ${locationLabel ?? 'Votre position actuelle'} (${mapCenter.lat.toFixed(4)}, ${mapCenter.lng.toFixed(4)})`}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleUsePreciseLocation}
                  className="explore-page__locator-btn"
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="explore-page__locator-btn-icon explore-page__locator-btn-icon--spin" />
                      Localisation...
                    </>
                  ) : (
                    <>
                      <Navigation className="explore-page__locator-btn-icon" />
                      Utiliser ma position
                    </>
                  )}
                </button>
              </div>

              <ExploreAddressSearch
                apiKey={GOOGLE_MAPS_API_KEY}
                country={country}
                authMode={authMode}
                authToken={authToken}
                onResolvedLocation={handleResolvedAddress}
              />
            </div>
          </APIProvider>
        )}

        {(city || exploreMode === 'current-location') && GOOGLE_MAPS_API_KEY && (
          <PlacesExplorer
            apiKey={GOOGLE_MAPS_API_KEY}
            center={mapCenter}
            cityName={displayCity}
            radius={3000}
            mapHeight="400px"
            onPlaceSelect={(place) => {
              console.log('[Navito] Place selected:', place);
            }}
          />
        )}

        {(city || exploreMode === 'current-location') && !GOOGLE_MAPS_API_KEY && currentCityId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="explore-page__db-content"
          >
            <ExploreContent
              cityId={currentCityId}
              cityName={displayCity}
              center={mapCenter}
            />
          </motion.div>
        )}

        {(city || exploreMode === 'current-location') && !GOOGLE_MAPS_API_KEY && !currentCityId && (
          <div className="explore-page__no-key-fallback">
            <div className="explore-page__no-key-icon">
              <MapPin style={{ width: 48, height: 48, color: '#94a3b8' }} />
            </div>
            <h3>Ville non identifiee</h3>
            <p>
              Impossible de trouver l'ID de la ville. Veuillez selectionner une ville supportee.
            </p>
            <button
              onClick={() => navigate('/country')}
              className="explore-page__no-city-btn"
            >
              Choisir une ville
            </button>
          </div>
        )}
      </div>

      <BottomNav />

      <style>{`
        :root {
          --navito-teal: #0d9488;
          --navito-teal-light: #f0fdfa;
        }

        .explore-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(160deg, #f0fdfa 0%, #f8fafc 50%, #fff 100%);
          font-family: 'Inter', system-ui, sans-serif;
          padding-bottom: 72px;
        }

        .explore-page__topbar {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .explore-page__topbar-inner {
          padding: 20px 20px 16px;
          max-width: 900px;
          margin: 0 auto;
        }
        .explore-page__location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .explore-page__location-icon {
          width: 16px;
          height: 16px;
          color: var(--navito-teal);
        }
        .explore-page__location-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--navito-teal);
        }
        .explore-page__change-btn {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 4px 10px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .explore-page__change-btn:hover {
          background: #e2e8f0;
          color: #374151;
        }
        .explore-page__title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }
        .explore-page__subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .explore-page__body {
          flex: 1;
          padding: 20px 16px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .explore-page__controls-grid {
          display: grid;
          gap: 16px;
        }
        .explore-page__db-content {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .explore-page__locator-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 18px;
          background: linear-gradient(135deg, #ecfeff 0%, #f8fafc 100%);
          border: 1px solid #bae6fd;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(14, 116, 144, 0.08);
        }
        .explore-page__search-card {
          padding: 16px 18px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #dbeafe;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }
        .explore-page__search-head {
          margin-bottom: 12px;
        }
        .explore-page__search-title {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }
        .explore-page__search-text {
          margin: 0;
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }
        .explore-page__search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          height: 52px;
          border-radius: 16px;
          border: 1px solid #cbd5e1;
          background: #fff;
        }
        .explore-page__search-icon {
          width: 16px;
          height: 16px;
          color: #64748b;
          flex-shrink: 0;
        }
        .explore-page__search-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 14px;
          color: #0f172a;
          background: transparent;
        }
        .explore-page__search-input::placeholder {
          color: #94a3b8;
        }
        .explore-page__search-spinner {
          width: 16px;
          height: 16px;
          color: #0d9488;
          animation: explore-page-spin 0.9s linear infinite;
        }
        .explore-page__search-results {
          margin-top: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
          overflow: hidden;
        }
        .explore-page__search-result {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 14px;
          text-align: left;
          background: #fff;
          border: none;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .explore-page__search-result:last-child {
          border-bottom: none;
        }
        .explore-page__search-result:hover {
          background: #f8fafc;
        }
        .explore-page__search-result-main {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .explore-page__search-result-secondary {
          font-size: 12px;
          color: #64748b;
        }
        .explore-page__search-feedback {
          margin: 10px 0 0;
          font-size: 12px;
          font-weight: 600;
        }
        .explore-page__search-feedback.is-error {
          color: #b45309;
        }
        .explore-page__locator-title {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }
        .explore-page__locator-text {
          margin: 0;
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }
        .explore-page__locator-feedback {
          margin: 10px 0 0;
          font-size: 12px;
          font-weight: 600;
          color: #0f766e;
        }
        .explore-page__locator-feedback.is-error {
          color: #b45309;
        }
        .explore-page__locator-feedback.is-success {
          color: #0f766e;
        }
        .explore-page__locator-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 190px;
          padding: 12px 18px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
          box-shadow: 0 10px 24px rgba(13, 148, 136, 0.26);
        }
        .explore-page__locator-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(13, 148, 136, 0.32);
        }
        .explore-page__locator-btn:disabled {
          cursor: wait;
          opacity: 0.75;
        }
        .explore-page__locator-btn-icon {
          width: 16px;
          height: 16px;
        }
        .explore-page__locator-btn-icon--spin {
          animation: explore-page-spin 0.9s linear infinite;
        }
        @keyframes explore-page-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .explore-page__warning {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f0fdfa;
          border: 1px solid #99f6e4;
          border-radius: 14px;
          color: #0f766e;
          font-size: 13px;
          line-height: 1.5;
        }
        .explore-page__warning p {
          margin: 4px 0 0;
          color: #115e59;
        }
        .explore-page__warning code {
          background: #ccfbf1;
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 11px;
        }
        .explore-page__warning-dismiss {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #0f766e;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .explore-page__no-city {
          text-align: center;
          padding: 60px 24px;
          background: #fff;
          border-radius: 24px;
          border: 1px dashed #cbd5e1;
        }
        .explore-page__no-city-icon {
          font-size: 56px;
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
        }
        .explore-page__no-city h2 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .explore-page__no-city p {
          font-size: 14px;
          color: #64748b;
          max-width: 320px;
          margin: 0 auto 20px;
          line-height: 1.6;
        }
        .explore-page__no-city-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--navito-teal);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .explore-page__no-city-btn:hover {
          background: #0f766e;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13,148,136,0.35);
        }

        .explore-page__no-key-fallback {
          text-align: center;
          padding: 48px 24px;
          background: #fff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
        }
        .explore-page__no-key-icon {
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
        }
        .explore-page__no-key-fallback h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .explore-page__no-key-fallback p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }
        .explore-page__no-key-fallback code {
          background: #f1f5f9;
          border-radius: 4px;
          padding: 1px 5px;
          font-family: monospace;
          font-size: 12px;
        }
        @media (max-width: 640px) {
          .explore-page__controls-grid {
            grid-template-columns: 1fr;
          }
          .explore-page__locator-card {
            flex-direction: column;
            align-items: stretch;
          }
          .explore-page__locator-btn {
            width: 100%;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}

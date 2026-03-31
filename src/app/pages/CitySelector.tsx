import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MapPinned, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { supportedCitiesByCountry } from '../data/locationData';

export default function CitySelector() {
  const navigate = useNavigate();
  const { country, city, setCity, useCurrentLocation } = useAppContext();
  const [isLocating, setIsLocating] = useState(false);

  const cities = supportedCitiesByCountry[country] ?? [];

  const handleUseCurrentLocation = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      useCurrentLocation();
      navigate('/explore');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        useCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
        navigate('/explore');
      },
      () => {
        useCurrentLocation();
        navigate('/explore');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="size-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b p-6">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="animate-enter-hero">
          <h1 className="text-3xl font-bold text-gray-900">
            {cities.length ? 'Choisissez la ville' : 'Ville non disponible'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {cities.length
              ? `Contenu disponible pour ${country}. Sélectionnez une ville pour explorer le contenu local.`
              : `Aucun contenu local n'est encore disponible pour ${country}. Utilisez la carte actuelle.`}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {cities.length ? (
          <div className="grid gap-4">
            {cities.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setCity(item.name);
                  navigate('/home');
                }}
                className={`animate-enter-card overflow-hidden rounded-3xl border bg-white text-left transition-all hover:-translate-y-0.5 hover:border-[#0D9488] ${
                  city === item.name ? 'border-[#0D9488]' : 'border-gray-200'
                }`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="grid grid-cols-[120px_1fr] gap-4 p-4">
                  <div className="h-28 overflow-hidden rounded-2xl">
                    <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-2 flex items-center gap-2 text-[#0D9488]">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.country}</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">{item.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Recommandations, restaurants, activités et transport adaptés à cette ville.
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
              <MapPinned className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-gray-900">Passez par la carte actuelle</p>
            <p className="mt-2 text-sm text-gray-600">
              Navito utilisera votre position actuelle pour lancer l’exploration.
            </p>
          </div>
        )}
      </div>

      <div className="border-t bg-white p-6">
        <Button onClick={handleUseCurrentLocation} className="h-12 w-full rounded-2xl bg-[#0D9488] hover:bg-[#0D9488]/90">
          <Navigation className="mr-2 h-5 w-5" />
          {isLocating ? 'Localisation en cours...' : 'Choisir directement avec la carte actuelle'}
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { supportedCitiesByCountry } from '../data/locationData';
import { detectLocation, fetchCities, type ApiCity } from '../services/api';

export default function CitySelector() {
  const navigate = useNavigate();
  const { authToken, authMode, country, city, setCountry, setCity, useCurrentLocation } = useAppContext();
  const [isLocating, setIsLocating] = useState(false);
  const [remoteCities, setRemoteCities] = useState<ApiCity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const localCities = supportedCitiesByCountry[country] ?? [];
  const localImages = useMemo(
    () => new Map(localCities.map((item) => [item.name.toLowerCase(), item.image])),
    [localCities]
  );

  useEffect(() => {
    let cancelled = false;

    fetchCities()
      .then((response) => {
        if (!cancelled) {
          const filtered = (response.data ?? []).filter((item) => !country || item.country?.name === country || item.country_id);
          setRemoteCities(
            country
              ? filtered.filter((item) => item.country?.name === country || (country === 'Morocco' && item.country?.code === 'MA'))
              : filtered
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteCities([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [country]);

  const cities = remoteCities.length
    ? remoteCities.map((item, index) => ({
        id: item.id,
        name: item.name,
        country: item.country?.name ?? country,
        image: localImages.get(item.name.toLowerCase()) ?? localCities[index % Math.max(localCities.length, 1)]?.image,
      }))
    : localCities;

  const filteredCities = searchQuery
    ? cities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : cities;

  const handleUseCurrentLocation = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      useCurrentLocation();
      navigate('/explore');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await detectLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }, authMode === 'login' ? authToken : null);

          if (response.data?.country?.name) {
            setCountry(response.data.country.name);
          }
          if (response.data?.city?.name) {
            setCity(response.data.city.name);
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Detection impossible.');
        }

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
      <div className="bg-white border-b">
        <div className="p-5">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {filteredCities.length ? 'Choisissez la ville' : 'Ville non disponible'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCities.length
              ? `Explorez ${country} ville par ville`
              : `Aucun contenu disponible pour ${country}`}
          </p>
          
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl pl-12 bg-gray-50 border-0"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {filteredCities.length ? (
          <div className="space-y-3">
            {filteredCities.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setCity(item.name);
                  navigate('/home');
                }}
                className={`w-full bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md active:scale-[0.99] ${
                  city === item.name ? 'border-[#0D9488] ring-2 ring-[#0D9488]/20' : 'border-gray-100'
                }`}
              >
                <div className="flex">
                  <div className="w-28 h-24 flex-shrink-0">
                    {item.image ? (
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0D9488]/20 to-teal-100 flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-[#0D9488]/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-1 text-[#0D9488] mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs font-medium">{item.country}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      Restaurants, activites et transport
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MapPin className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900">Aucune ville trouvee</p>
            <p className="text-sm text-gray-500 mt-1">Essayez avec la carte actuelle</p>
          </div>
        )}
      </div>

      <div className="bg-white border-t p-5">
        <Button 
          onClick={handleUseCurrentLocation} 
          className="h-12 w-full rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90"
        >
          <Navigation className="mr-2 h-5 w-5" />
          {isLocating ? 'Localisation...' : 'Utiliser la carte actuelle'}
        </Button>
      </div>
    </div>
  );
}

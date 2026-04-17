import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Globe2, MapPinned, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { supportedCountries } from '../data/locationData';
import { useAppContext } from '../context/AppContext';
import { detectLocation, fetchCountries, type ApiCountry } from '../services/api';
import { motion } from 'motion/react';

export default function CountrySelector() {
  const navigate = useNavigate();
  const { authMode, authToken, country, setCountry, setCity, useCurrentLocation } = useAppContext();
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCountries()
      .then((response) => {
        if (!cancelled) {
          setCountries(response.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCountries([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const items = countries.length
    ? countries.map((item) => ({
        code: item.code,
        name: item.name,
        englishName: item.name,
        description: item.code === 'MA' ? 'Contenu complet disponible par ville' : 'Exploration via carte et position actuelle',
      }))
    : supportedCountries;

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    navigate('/city');
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      useCurrentLocation();
      navigate('/explore');
      return;
    }

    setIsLocating(true);

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

          useCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
          navigate('/explore');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Detection impossible.');
          useCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
          navigate('/explore');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error('La geolocalisation a ete refusee.');
        useCurrentLocation();
        navigate('/explore');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#0D9488]/5 via-white to-white">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-5">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-500 hover:text-[#0D9488] transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#0891B2] text-white shadow-lg shadow-[#0D9488]/20">
            <Globe2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choisissez le pays</h1>
            <p className="mt-1 text-sm text-gray-500">
              {authMode === 'login'
                ? 'Session active. Recevez du contenu local cible.'
                : 'Mode invite. Choisissez un pays pour continuer.'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-lg space-y-3">
          {items.map((item, index) => (
            <motion.button
              key={item.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              onClick={() => handleCountrySelect(item.englishName)}
              className={`group w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
                country === item.englishName 
                  ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/10 to-[#0891B2]/5 shadow-md' 
                  : 'border-gray-100 bg-white hover:border-[#0D9488]/50 hover:bg-gradient-to-r hover:from-[#0D9488]/5 hover:to-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900 group-hover:text-[#0D9488] transition-colors">{item.name}</p>
                    {item.code === 'MA' && (
                      <span className="rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                        Populaire
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 group-hover:bg-[#0D9488]/10 transition-colors">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            className="h-14 w-full rounded-2xl border-2 border-[#0D9488]/20 bg-gradient-to-r from-[#0D9488]/5 to-transparent text-[#0D9488] hover:border-[#0D9488] hover:bg-[#0D9488]/10 hover:shadow-lg transition-all duration-200" 
            onClick={handleCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <Navigation className="mr-2 h-5 w-5 animate-pulse" />
                Detection en cours...
              </>
            ) : (
              <>
                <MapPinned className="mr-2 h-5 w-5" />
                Je suis deja sur place, utiliser ma position
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

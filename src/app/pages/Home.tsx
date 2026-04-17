import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, DollarSign, MapPin, Navigation, Search, ShieldAlert, Star, TrendingUp, UserRound, Compass, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { 
  fetchCities, 
  fetchPlaces, 
  fetchActivities, 
  fetchRestaurants, 
  type ApiCity, 
  type ApiPlace, 
  type ApiActivity, 
  type ApiRestaurant 
} from '../services/api';

const tools = [
  { path: '/ocr-translator', icon: Camera, label: 'OCR', gradient: 'from-blue-500 to-blue-600' },
  { path: '/price-estimator', icon: DollarSign, label: 'Prix', gradient: 'from-orange-500 to-orange-600' },
  { path: '/transport', icon: MapPin, label: 'Transport', gradient: 'from-green-500 to-green-600' },
  { path: '/safety', icon: ShieldAlert, label: 'Securite', gradient: 'from-red-500 to-red-600' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon apres-midi';
  return 'Bonsoir';
}

export default function Home() {
  const navigate = useNavigate();
  const { city, setCity, exploreMode } = useAppContext();
  const [timeGreeting] = useState(getGreeting());
  
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [places, setPlaces] = useState<ApiPlace[]>([]);
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [citiesRes, placesRes, activitiesRes, restaurantsRes] = await Promise.all([
          fetchCities(),
          fetchPlaces(),
          fetchActivities(),
          fetchRestaurants(),
        ]);
        
        console.log('API Response - Activities:', activitiesRes);
        setCities(citiesRes.data ?? []);
        setPlaces(placesRes.data ?? []);
        setActivities(activitiesRes.data ?? []);
        setRestaurants(restaurantsRes.data ?? []);
        
        if (!city && citiesRes.data?.length) {
          const defaultCity = citiesRes.data.find((c: ApiCity) => c.is_supported);
          if (defaultCity) {
            setCity(defaultCity.name);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const activeCityData = useMemo(() => {
    return cities.find((c: ApiCity) => c.name === city);
  }, [cities, city]);

  const citySpots = useMemo(() => {
    return cities.filter((c: ApiCity) => c.name !== city).slice(0, 4);
  }, [cities, city]);

  const cityPlaces = useMemo(() => {
    if (!activeCityData) return places.slice(0, 3);
    return places.filter((p: ApiPlace) => p.city_id === activeCityData.id).slice(0, 3);
  }, [activeCityData, places]);

  const cityActivities = useMemo(() => {
    console.log('Computing cityActivities - activeCityData:', activeCityData, 'activeCityData.id:', activeCityData?.id, 'activities:', activities, 'activity city_ids:', activities.map(a => a.city_id));
    if (!activeCityData) return activities.slice(0, 2);
    return activities.filter((a: ApiActivity) => a.city_id === activeCityData.id).slice(0, 2);
  }, [activeCityData, activities]);

  const activeCity = city || 'Selectionnez une ville';

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-20">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] to-teal-600">
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative px-4 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/80 font-medium">
                  {timeGreeting} sur
                </p>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Navito
                </h1>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')} 
              className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <UserRound className="h-4 w-4 text-white" />
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-3"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0D9488]" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="h-10 rounded-xl border-0 bg-transparent pl-9 pr-2 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-0" 
                    onClick={() => navigate('/explore')} 
                    readOnly
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/explore')}
                  className="m-1.5 h-8 px-4 rounded-lg bg-gradient-to-r from-[#0D9488] to-teal-600 text-white text-xs font-semibold"
                >
                  Explorer
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Navigation className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-white/60">Position</p>
                <p className="text-xs text-white font-medium">
                  {exploreMode === 'current-location' ? 'Carte actuelle' : activeCity}
                </p>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/country')}
              className="text-[10px] text-white/80 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg font-medium transition-colors"
            >
              Changer
            </motion.button>
          </motion.div>
        </div>

        <div className="h-4 bg-gray-50 rounded-t-xl mt-1" />
      </div>

      <div className="flex-1 overflow-auto -mt-3">
        <div className="bg-white rounded-t-xl min-h-full p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(tool.path)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-semibold text-gray-700 text-center">{tool.label}</span>
                </motion.button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
            </div>
          ) : (
            <>
              {exploreMode === 'city' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#0D9488]" />
                      Villes
                    </h2>
                    <button onClick={() => navigate('/city')} className="text-xs font-medium text-[#0D9488]">
                      Voir tout
                    </button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                    {citySpots.map((item: ApiCity, index: number) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setCity(item.name);
                          navigate('/explore');
                        }}
                        className="relative h-28 w-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                      >
                        <img 
                          src={`https://picsum.photos/seed/${item.id}/200/200`}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white font-semibold text-xs">{item.name}</p>
                          <p className="text-white/70 text-[10px]">{item.country?.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900">
                    {exploreMode === 'current-location' ? 'Autour de vous' : `Incontournables ${activeCity}`}
                  </h2>
                  <button onClick={() => navigate('/explore')} className="text-xs font-medium text-[#0D9488]">
                    Tout voir
                  </button>
                </div>
                <div className="space-y-2">
                  {cityPlaces.length > 0 ? cityPlaces.map((item: ApiPlace, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/place/${item.id}`)}
                      className="group flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2.5 shadow-sm cursor-pointer hover:border-[#0D9488]/30 transition-all"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/seed/place${item.id}/200/200`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-xs truncate group-hover:text-[#0D9488] transition-colors">{item.name}</h3>
                        <p className="text-[10px] text-gray-500 truncate">{item.city?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.rating && (
                            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
                              <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                              <span className="text-[10px] font-semibold text-amber-700">{Number(item.rating).toFixed(1)}</span>
                            </div>
                          )}
                          {item.entry_price_min != null && (
                            <span className="text-xs font-bold text-[#0D9488]">
                              {item.entry_price_min}-{item.entry_price_max} MAD
                            </span>
                          )}
                          {item.entry_price_min == null && (
                            <span className="text-xs font-bold text-[#0D9488]">Gratuit</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      Aucun lieu disponible
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Experiences
                  </h2>
                </div>
                <div className="space-y-3">
                  {cityActivities.length > 0 ? cityActivities.map((item: ApiActivity, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/activity/${item.id}`)}
                      className="group relative rounded-xl overflow-hidden h-32 cursor-pointer shadow-sm"
                    >
                      <img 
                        src={`https://picsum.photos/seed/activity${item.id}/400/200`}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Populaire
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                            <p className="text-white/70 text-[10px]">{item.city?.name} - {item.duration_label}</p>
                          </div>
                          <div className="text-right bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
                            <p className="text-base font-bold text-white">
                              {item.price_min ?? 0}-{item.price_max ?? 0}
                            </p>
                            <p className="text-[10px] text-white/70">MAD</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {item.rating && (
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-white font-semibold">{Number(item.rating).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      Aucune experience disponible
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, MapPin, Search, SlidersHorizontal, Star, Utensils, Loader2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { fetchRestaurants, type ApiRestaurant } from '../services/api';

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { city, exploreMode } = useAppContext();

  useEffect(() => {
    setLoading(true);
    fetchRestaurants()
      .then((response) => {
        setRestaurants(response.data ?? []);
      })
      .catch(() => {
        setRestaurants([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const visibleRestaurants = useMemo(() => {
    let filtered = restaurants;
    
    if (exploreMode === 'city' && city) {
      filtered = restaurants.filter((item) => item.city?.name === city);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (a.rating && b.rating) return Number(b.rating) - Number(a.rating);
      return 0;
    });
  }, [restaurants, city, exploreMode, searchQuery]);

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#0D9488]/5 via-white to-white pb-16">
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="px-6 py-5">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-2xl font-bold text-gray-900"
          >
            {exploreMode === 'city' && city ? `Restaurants a ${city}` : 'Restaurants'}
          </motion.h1>

          <div className="flex gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative flex-1"
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl pl-12 border-2 border-gray-100 focus:border-[#0D9488] transition-colors"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Button variant="outline" className="h-12 rounded-xl px-4 border-2 border-gray-100 hover:border-[#0D9488] hover:bg-[#0D9488]/5">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shadow-lg shadow-amber-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold">Own a Restaurant?</h3>
              <p className="mb-3 text-sm text-white/90">Boost visibility on Navito with featured placement.</p>
              <Button variant="secondary" className="h-9 rounded-xl bg-white text-orange-600 hover:bg-white/90 shadow-lg">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#0D9488]" />
          </div>
        ) : visibleRestaurants.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucun restaurant trouve
          </div>
        ) : (
          <div className="space-y-4">
            {visibleRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.06 }}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-100 bg-white transition-all duration-300 hover:border-[#0D9488]/50 hover:shadow-lg"
              >
                <div className="flex gap-4 p-4">
                  <motion.div 
                    className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={`https://picsum.photos/seed/restaurant${restaurant.id}/200/200`}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#0D9488] transition-colors">{restaurant.name}</h3>
                        {restaurant.is_halal && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Halal
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-gray-500">{restaurant.cuisine || 'Cuisine locale'}</p>
                      <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {restaurant.city?.name}
                        </span>
                        {restaurant.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {Number(restaurant.rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">Prix moy. </span>
                        <span className="font-bold text-[#0D9488]">{restaurant.average_price ?? 0} MAD</span>
                      </div>
                      {restaurant.opening_hours && (
                        <span className="text-xs text-gray-400">{restaurant.opening_hours}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

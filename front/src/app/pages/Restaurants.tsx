import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, Clock, MapPin, Search, Star, 
  Phone, Shield, Utensils, Filter, ArrowRight,
  Leaf, Flame, Wifi, Car, SlidersHorizontal, X,
  Heart, Share2, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { fetchRealPlacesLocal, PlaceItem } from '../services/placesApi';

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const STAGGER = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
};

const shimmerVariants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: { backgroundPosition: '200% 0' }
};

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] shadow-inner" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 w-3/4 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
        <div className="h-4 w-1/2 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
          <div className="h-6 w-12 rounded-full bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
}

function SkeletonFeatured() {
  return (
    <div className="aspect-[4/3] sm:aspect-[16/9] rounded-[28px] bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] shadow-inner" />
  );
}

export default function Restaurants() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { city, currentPosition, exploreMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [realItems, setRealItems] = useState<PlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCity = useMemo(() => city || 'Marrakech', [city]);
  
  const mapCenter: [number, number] = useMemo(() => {
    const raw: [number, number] = exploreMode === 'current-location' && currentPosition 
      ? [currentPosition.lat, currentPosition.lng] 
      : [31.6295, -7.9811];
    return [Math.round(raw[0] * 1000) / 1000, Math.round(raw[1] * 1000) / 1000];
  }, [exploreMode, currentPosition]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRealPlacesLocal(mapCenter[0], mapCenter[1], 5000);
        if (isMounted) {
          const restaurants = (data || []).filter((item: PlaceItem) => item.type === 'restaurant');
          setRealItems(restaurants);
        }
      } catch (err) {
        console.warn('Restaurants Error:', err);
        if (isMounted) setRealItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [mapCenter]);

  const categories = [
    { id: 'all', label: 'All', icon: Utensils },
    { id: 'traditional', label: 'Traditional', icon: ChefHat },
    { id: 'modern', label: 'Modern', icon: Leaf },
    { id: 'street', label: 'Street Food', icon: Flame },
  ];

  const filteredRestaurants = useMemo(() => {
    let items = realItems.length > 0 ? realItems : [];
    
    if (searchQuery) {
      items = items.filter((item: any) => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items.slice(0, 10);
  }, [realItems, searchQuery]);

  const clearSearch = () => setSearchQuery('');

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FAFAFA] to-[#F5F5F5] flex flex-col pb-20 font-sans antialiased text-[#171717] overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[70%] h-[45%] rounded-full bg-gradient-to-br from-orange-400/[0.06] via-amber-300/[0.04] to-transparent blur-[140px] transform translate-x-1/3" />
        <div className="absolute bottom-[15%] left-0 w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-amber-400/[0.05] via-orange-300/[0.03] to-transparent blur-[140px] transform -translate-x-1/3" />
        <div className="absolute top-[60%] left-[60%] w-[25%] h-[25%] rounded-full bg-orange-300/[0.03] blur-[60px] transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute -top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-amber-200/[0.02] blur-[80px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-black/[0.05]"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/30 flex-shrink-0"
              >
                <Utensils className="h-5 w-5" />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight truncate bg-gradient-to-br from-[#171717] to-[#404040] bg-clip-text text-transparent">
                  {t('restaurants.title', 'Restaurants')}
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600 flex items-center gap-2">
                  <span className="w-4 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                  {activeCity}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-5 rounded-2xl flex items-center gap-2 text-[12px] font-bold transition-all duration-300 ${
                showFilters 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/30' 
                  : 'bg-white/80 text-[#525252] border border-black/[0.08] hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mt-5"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3] group-focus-within:text-orange-500 transition-colors duration-300" />
              <Input 
                placeholder={t('restaurants.search', 'Search restaurants, cuisines...')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-13 rounded-2xl border-0 bg-white/80 backdrop-blur-sm pl-12 pr-12 text-[14px] font-medium transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:shadow-xl focus:shadow-orange-500/10 shadow-lg shadow-black/[0.03]" 
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#E5E5E5] flex items-center justify-center hover:bg-[#D4D4D4] transition-colors"
                >
                  <X className="h-3 w-3 text-[#525252]" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-5 space-y-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-3">Price Range</p>
                    <div className="flex gap-2">
                      {[0, 100, 200, 500].map((price) => (
                        <button
                          key={price}
                          onClick={() => setPriceRange([price, price === 500 ? 1000 : price + 100])}
                          className={`flex-1 py-3 rounded-xl text-[12px] font-bold transition-all duration-300 ${
                            priceRange[0] === price
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                              : 'bg-white/80 text-[#525252] border border-black/[0.06] hover:border-orange-200'
                          }`}
                        >
                          {price === 0 ? 'All' : `${price}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Categories */}
        <motion.div {...reveal} className="mb-8 -mx-4 sm:mx-0">
          <div className="flex gap-2.5 overflow-x-auto px-4 sm:px-0 pb-2 scrollbar-hide">
            {categories.map((category, idx) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[12px] font-bold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#171717] to-[#404040] text-white shadow-xl shadow-black/20'
                    : 'bg-white/80 text-[#525252] border border-black/[0.08] hover:border-orange-300 hover:text-orange-600 hover:shadow-lg hover:shadow-orange-500/10'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Section */}
        {isLoading ? (
          <motion.div {...reveal} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-500" />
                <div className="h-5 w-24 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="h-8 w-16 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
            </div>
            <SkeletonFeatured />
          </motion.div>
        ) : filteredRestaurants.length > 0 ? (
          <motion.section {...reveal} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-bold tracking-tight flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-500" />
                {t('restaurants.featured', 'Featured')}
              </h2>
              <Button variant="ghost" size="sm" className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                See All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              className="relative group cursor-pointer overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/[0.08] border border-black/[0.06]"
            >
              <div className="aspect-[4/3] sm:aspect-[16/9] relative overflow-hidden">
                <ImageWithFallback 
                  src={filteredRestaurants[0].image} 
                  alt={filteredRestaurants[0].name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-xl shadow-orange-500/30">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Top Pick
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <Heart className="h-4 w-4 text-[#525252]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <Share2 className="h-4 w-4 text-[#525252]" />
                  </motion.button>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate drop-shadow-lg">
                        {filteredRestaurants[0].name}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] text-white/80 font-medium truncate mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {filteredRestaurants[0].address || activeCity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Star className="h-5 w-5 fill-white text-white" />
                        <span className="text-[15px] sm:text-[17px] font-bold text-white">{filteredRestaurants[0].rating}</span>
                      </div>
                      <p className="text-[13px] sm:text-[15px] font-bold text-white/80 mt-1">
                        {filteredRestaurants[0].price || filteredRestaurants[0].avgPrice} MAD
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full h-12 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Navigation className="h-4 w-4 text-orange-600" />
                    <span className="text-[13px] font-bold text-[#171717]">Get Directions</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.section>
        ) : null}

        {/* Restaurant List */}
        <motion.section {...reveal} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              {t('restaurants.nearby', 'Nearby')}
              <span className="text-[10px] font-medium text-[#A3A3A3] ml-1">
                ({filteredRestaurants.length})
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <motion.div 
              variants={STAGGER}
              initial="initial"
              animate="animate"
              className="space-y-3"
            >
              {filteredRestaurants.slice(1).map((restaurant: any, idx: number) => (
                <motion.div 
                  key={restaurant.id} 
                  variants={cardVariants}
                  whileHover="hover"
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/90 backdrop-blur-sm shadow-lg shadow-black/[0.04] transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200/50">
                    <div className="flex gap-4">
                      <div className="relative h-24 sm:h-28 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-2xl">
                        <ImageWithFallback 
                          src={restaurant.image} 
                          alt={restaurant.name} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-3.5 w-3.5 text-orange-500" />
                        </motion.button>
                      </div>
                      
                      <CardContent className="flex flex-1 flex-col justify-center p-3 sm:p-4 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[14px] sm:text-[15px] font-bold text-[#171717] truncate group-hover:text-orange-600 transition-colors duration-300">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                            <span className="text-[12px] font-bold">{restaurant.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-[#A3A3A3] truncate mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {restaurant.address || activeCity}
                        </p>
                        
                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                          <Badge variant="secondary" className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 text-[9px] sm:text-[10px] font-bold border-none px-2.5 py-1 rounded-lg">
                            {restaurant.price || restaurant.avgPrice} MAD
                          </Badge>
                          {restaurant.duration && (
                            <div className="flex items-center gap-1 text-[10px] text-[#A3A3A3]">
                              <Clock className="h-3 w-3" />
                              {restaurant.duration}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center mb-4 shadow-inner">
                <Utensils className="h-12 w-12 text-orange-300" />
              </div>
              <h3 className="text-[16px] font-bold text-[#171717] mb-2">No restaurants found</h3>
              <p className="text-[12px] text-[#A3A3A3] max-w-[250px] mb-6">
                Try adjusting your search or explore different areas
              </p>
              <Button 
                onClick={clearSearch}
                variant="outline"
                className="h-11 px-6 rounded-2xl text-[12px] font-bold border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </motion.section>
      </main>

      <BottomNav />

      {/* Add custom CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
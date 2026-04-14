import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, Clock, MapPin, Search, Star, 
  Phone, Shield, Utensils, Filter, ArrowRight,
  Leaf, Flame, Wifi, Car, SlidersHorizontal, X,
  Heart, Share2, Navigation, Sparkles
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

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="h-24 w-24 rounded-2xl bg-muted shadow-inner" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 w-3/4 rounded-lg bg-muted" />
        <div className="h-4 w-1/2 rounded-lg bg-muted" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-12 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

function SkeletonFeatured() {
  return (
    <div className="aspect-[4/3] sm:aspect-[16/9] rounded-[28px] bg-muted shadow-inner" />
  );
}

export default function Restaurants() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { city, currentPosition, exploreMode, theme } = useAppContext();
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
    <div className="min-h-screen w-full bg-background flex flex-col pb-20 font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[70%] h-[45%] rounded-full bg-gradient-to-br from-orange-400/[0.04] via-amber-300/[0.02] to-transparent blur-[140px] transform translate-x-1/3" />
        <div className="absolute bottom-[15%] left-0 w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-amber-400/[0.04] via-orange-300/[0.02] to-transparent blur-[140px] transform -translate-x-1/3" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-3xl border-b border-border"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 font-sans">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-foreground text-background shadow-xl shadow-foreground/10 flex-shrink-0"
              >
                <Utensils className="h-5 w-5" />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-[26px] font-black tracking-tight truncate bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent italic">
                  {t('restaurants.title', 'Restaurants')}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                  <span className="w-4 h-0.5 rounded-full bg-accent" />
                  {activeCity}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-5 rounded-2xl flex items-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all duration-300 border ${
                showFilters 
                  ? 'bg-foreground text-background border-foreground shadow-xl' 
                  : 'bg-secondary text-muted-foreground border-border hover:border-accent/40'
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
            className="relative mt-5 group"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input 
              placeholder={t('restaurants.search', 'Search restaurants, cuisines...')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-13 rounded-2xl border-border bg-secondary pl-12 pr-12 text-[14px] font-bold tracking-tight transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground" 
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3 text-foreground" />
              </motion.button>
            )}
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
                  <div className="font-sans">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 italic">Price Protocol</p>
                    <div className="flex gap-2">
                      {[0, 100, 200, 500].map((price) => (
                        <button
                          key={price}
                          onClick={() => setPriceRange([price, price === 500 ? 1000 : price + 100])}
                          className={`flex-1 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all duration-300 border ${
                            priceRange[0] === price
                              ? 'bg-foreground text-background border-foreground shadow-lg'
                              : 'bg-secondary text-muted-foreground border-border hover:border-accent/40'
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
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 border ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background border-foreground shadow-xl'
                    : 'bg-secondary text-muted-foreground border-border hover:border-accent/40 hover:text-foreground'
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
                <Star className="h-4 w-4 text-accent" />
                <div className="h-5 w-24 rounded-lg bg-muted" />
              </div>
              <div className="h-8 w-16 rounded-lg bg-muted" />
            </div>
            <SkeletonFeatured />
          </motion.div>
        ) : filteredRestaurants.length > 0 ? (
          <motion.section {...reveal} className="mb-10">
            <div className="flex items-center justify-between mb-5 font-sans">
              <h2 className="text-[14px] font-black tracking-widest flex items-center gap-2 uppercase italic text-foreground">
                <Star className="h-4 w-4 text-accent fill-accent" />
                {t('restaurants.featured', 'Featured')}
              </h2>
              <Button variant="ghost" size="sm" className="text-[11px] font-black uppercase tracking-widest text-accent hover:text-accent/80 hover:bg-accent/5">
                See All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              className="relative group cursor-pointer overflow-hidden rounded-[28px] bg-card shadow-2xl border border-border"
            >
              <div className="aspect-[4/3] sm:aspect-[16/9] relative overflow-hidden bg-muted">
                <ImageWithFallback 
                  src={filteredRestaurants[0].image} 
                  alt={filteredRestaurants[0].name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-foreground text-background text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-xl tracking-[0.15em] border-none shadow-foreground/10">
                    <Star className="h-3 w-3 mr-1 fill-background" />
                    Top Pick
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-lg border border-border"
                  >
                    <Heart className="h-4 w-4 text-accent" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-lg border border-border"
                  >
                    <Share2 className="h-4 w-4 text-foreground" />
                  </motion.button>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 font-sans">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate uppercase italic">
                        {filteredRestaurants[0].name}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] text-muted-foreground font-black uppercase tracking-widest truncate mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {filteredRestaurants[0].address || activeCity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="text-[17px] sm:text-[20px] font-black text-foreground">{filteredRestaurants[0].rating}</span>
                      </div>
                      <p className="text-[13px] sm:text-[15px] font-black text-accent mt-1 uppercase tracking-widest">
                        {filteredRestaurants[0].price || filteredRestaurants[0].avgPrice} MAD
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full h-12 rounded-xl bg-foreground text-background flex items-center justify-center gap-2 shadow-xl shadow-foreground/5 transition-all uppercase text-[12px] font-black tracking-widest"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.section>
        ) : null}

        {/* Restaurant List */}
        <motion.section {...reveal} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-5 font-sans">
            <h2 className="text-[14px] font-black tracking-widest flex items-center gap-2 uppercase italic text-foreground">
              <MapPin className="h-4 w-4 text-accent" />
              {t('restaurants.nearby', 'Nearby')}
              <span className="text-[10px] font-black text-muted-foreground ml-1">
                ({filteredRestaurants.length})
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <motion.div 
              variants={STAGGER}
              initial="initial"
              animate="animate"
              className="space-y-4 font-sans"
            >
              {filteredRestaurants.slice(1).map((restaurant: any, idx: number) => (
                <motion.div 
                  key={restaurant.id} 
                  variants={cardVariants}
                  whileHover="hover"
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-xl shadow-foreground/5 transition-all duration-300 hover:bg-card hover:border-accent/10">
                    <div className="flex gap-4">
                      <div className="relative h-24 sm:h-28 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                        <ImageWithFallback 
                          src={restaurant.image} 
                          alt={restaurant.name} 
                          className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                        >
                          <Heart className="h-3.5 w-3.5 text-accent" />
                        </motion.button>
                      </div>
                      
                      <CardContent className="flex flex-1 flex-col justify-center p-3 sm:p-4 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[14px] sm:text-[15px] font-black text-foreground truncate group-hover:text-accent transition-colors duration-300 uppercase italic tracking-tight">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            <span className="text-[12px] font-black text-foreground">{restaurant.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-muted-foreground truncate uppercase font-bold tracking-tight mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {restaurant.address || activeCity}
                        </p>
                        
                        <div className="flex items-center gap-2 sm:gap-3 mt-3">
                          <Badge variant="secondary" className="bg-secondary text-muted-foreground group-hover:bg-foreground group-hover:text-background text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-none px-2.5 py-1 rounded-lg transition-all">
                            {restaurant.price || restaurant.avgPrice} MAD
                          </Badge>
                          {restaurant.duration && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
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
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="h-24 w-24 rounded-3xl bg-secondary border border-border flex items-center justify-center mb-6 shadow-xl">
                <Utensils className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-[17px] font-black text-foreground mb-2 uppercase tracking-widest italic">No venues found</h3>
              <p className="text-[13px] text-muted-foreground max-w-[250px] mb-8 font-medium">
                Adjust your search parameters to find new local flavors.
              </p>
              <Button 
                onClick={clearSearch}
                variant="outline"
                className="h-12 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest border-border text-foreground hover:bg-secondary transition-all"
              >
                Reset Search
              </Button>
            </motion.div>
          )}
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}
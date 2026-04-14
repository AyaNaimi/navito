import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, DollarSign, MapPin, Search, ShieldAlert, Star, UserRound, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { activities, cities, monuments } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { fetchRealPlacesLocal, PlaceItem } from '../services/placesApi';

const reveal = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-4 p-4 rounded-2xl border border-border bg-card/50 animate-pulse ${className}`}>
      <div className="h-20 w-20 rounded-2xl bg-muted" />
      <div className="flex-1 space-y-3 pt-2">
        <div className="h-4 w-3/4 rounded-lg bg-muted" />
        <div className="h-3 w-1/2 rounded-lg bg-muted" />
        <div className="h-3 w-1/4 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function SkeletonCityCard() {
  return (
    <div className="relative h-44 w-36 flex-shrink-0 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-muted animate-pulse" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-muted to-transparent" />
    </div>
  );
}

function QuickActionSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-muted" />
      <div className="h-2 w-12 rounded bg-muted" />
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { city, exploreMode, currentPosition } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const [realItems, setRealItems] = useState<PlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCity = useMemo(() => city || cities[0]?.name || 'Marrakech', [city]);
  const citySpots = useMemo(() => {
    const allCities = cities.filter((item) => item.name !== activeCity);
    return allCities.length > 0 ? allCities.slice(0, 3) : [];
  }, [activeCity]);

  const cityData = useMemo(() => {
    // Try to find city in mockData
    const found = cities.find(c => c.name === activeCity);
    if (found) return found;
    // Fallback to Morocco cities if country is Morocco but city not found
    if (activeCity === 'Fès' || activeCity === 'FÃ¨s') return { lat: 34.0181, lng: -5.0078, name: 'Fès' };
    if (activeCity === 'Casablanca') return { lat: 33.5731, lng: -7.5898, name: 'Casablanca' };
    if (activeCity === 'Rabat') return { lat: 34.0209, lng: -6.8416, name: 'Rabat' };
    if (activeCity === 'Tanger') return { lat: 35.7595, lng: -5.834, name: 'Tanger' };
    if (activeCity === 'Agadir') return { lat: 30.4278, lng: -9.5981, name: 'Agadir' };
    // Default to Marrakech
    return { lat: 31.6295, lng: -7.9811, name: 'Marrakech' };
  }, [activeCity]);
  
  const mapCenter: [number, number] = useMemo(() => {
    console.log('mapCenter calc:', { exploreMode, currentPosition, cityData, activeCity });
    const raw: [number, number] = exploreMode === 'current-location' && currentPosition 
      ? [currentPosition.lat, currentPosition.lng] 
      : [cityData.lat, cityData.lng];
    return [Math.round(raw[0] * 1000) / 1000, Math.round(raw[1] * 1000) / 1000];
  }, [exploreMode, currentPosition, cityData]);

  const { scrollY } = useScroll({ container: containerRef });
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRealPlacesLocal(mapCenter[0], mapCenter[1], 4000);
        if (isMounted) {
          if (data && data.length > 0) {
            setRealItems(data);
          } else {
            // Use fallback mock data if API returns empty
            setRealItems([
              { id: 1, type: 'monument', name: 'Koutoubia Mosque', city: 'Marrakech', lat: 31.6295, lng: -7.9929, rating: 4.8, reviews: 2847, price: 'Free', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', description: 'The largest mosque in Marrakech' },
              { id: 2, type: 'monument', name: 'Jemaa el-Fnaa', city: 'Marrakech', lat: 31.6256, lng: -7.9873, rating: 4.7, reviews: 1523, price: 'Free', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80', description: 'Famous square in Marrakech' },
              { id: 3, type: 'monument', name: 'Bahia Palace', city: 'Marrakech', lat: 31.6207, lng: -7.9817, rating: 4.6, reviews: 986, price: '70 MAD', image: 'https://images.unsplash.com/photo-1548013149-16010375f426?w=800&q=80', description: 'Beautiful palace in Marrakech' },
              { id: 4, type: 'restaurant', name: 'Le Jardin', city: 'Marrakech', lat: 31.6295, lng: -7.9811, rating: 4.5, reviews: 847, price: 150, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', description: 'Beautiful garden restaurant', cuisine: 'Moroccan' },
              { id: 5, type: 'restaurant', name: 'Café Clock', city: 'Marrakech', lat: 31.6321, lng: -7.9832, rating: 4.4, reviews: 523, price: 80, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', description: 'Famous for camel burgers', cuisine: 'Fusion' },
            ]);
          }
        }
      } catch (err) {
        console.warn('Home Error:', err);
        if (isMounted) {
          // Use fallback mock data on error
          setRealItems([
            { id: 1, type: 'monument', name: 'Koutoubia Mosque', city: 'Marrakech', lat: 31.6295, lng: -7.9929, rating: 4.8, reviews: 2847, price: 'Free', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', description: 'The largest mosque in Marrakech' },
            { id: 2, type: 'monument', name: 'Jemaa el-Fnaa', city: 'Marrakech', lat: 31.6256, lng: -7.9873, rating: 4.7, reviews: 1523, price: 'Free', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80', description: 'Famous square in Marrakech' },
            { id: 3, type: 'monument', name: 'Bahia Palace', city: 'Marrakech', lat: 31.6207, lng: -7.9817, rating: 4.6, reviews: 986, price: '70 MAD', image: 'https://images.unsplash.com/photo-1548013149-16010375f426?w=800&q=80', description: 'Beautiful palace in Marrakech' },
            { id: 4, type: 'restaurant', name: 'Le Jardin', city: 'Marrakech', lat: 31.6295, lng: -7.9811, rating: 4.5, reviews: 847, price: 150, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', description: 'Beautiful garden restaurant', cuisine: 'Moroccan' },
            { id: 5, type: 'restaurant', name: 'Café Clock', city: 'Marrakech', lat: 31.6321, lng: -7.9832, rating: 4.4, reviews: 523, price: 80, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', description: 'Famous for camel burgers', cuisine: 'Fusion' },
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [mapCenter]);

  const quickActions = [
    { id: 'ocr', icon: Camera, label: 'OCR', path: '/ocr-translator' },
    { id: 'price', icon: DollarSign, label: 'Price', path: '/price-estimator' },
    { id: 'transport', icon: MapPin, label: 'Trip', path: '/transport' },
    { id: 'safety', icon: ShieldAlert, label: 'Safety', path: '/safety' },
  ];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground pb-24 overflow-x-hidden transition-colors duration-500" ref={containerRef}>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-0 w-[50%] h-[40%] rounded-full bg-accent/[0.05] blur-[120px] transform translate-x-1/2" />
        <div className="absolute bottom-20 left-0 w-[40%] h-[40%] rounded-full bg-primary/[0.05] blur-[100px] transform -translate-x-1/2" />
      </div>

      {/* Sticky Header */}
      <motion.header 
        style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur}px)` }}
        className="sticky top-0 z-50 bg-background/50 backdrop-blur-2xl border-b border-border px-4 sm:px-6 py-5 sm:py-6"
      >
        <div className="max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 min-w-0"
            >
              <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-2xl bg-secondary border border-border">
                <MapPin className="h-6 w-6 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t('home.welcome')}</p>
                <h1 className="text-[20px] sm:text-[24px] font-black tracking-tight truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {exploreMode === 'current-location' ? t('home.currentMap') : activeCity}
                </h1>
              </div>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')} 
              className="h-12 w-12 rounded-2xl border border-border p-0.5 overflow-hidden"
            >
              <Avatar className="h-full w-full rounded-xl">
                <AvatarFallback className="bg-secondary text-foreground">
                  <UserRound className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </motion.button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input 
                placeholder={t('home.searchPlaceholder')} 
                className="h-12 sm:h-14 rounded-2xl border border-border bg-secondary pl-11 text-[14px] font-medium text-foreground placeholder:text-muted-foreground focus:bg-background/80"
                onClick={() => navigate('/explore')} 
                readOnly
              />
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* Quick Actions - improved touch targets (min 48x48px tap area) */}
        <motion.div {...reveal} className="grid grid-cols-4 gap-3">
          {quickActions.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-2 rounded-2xl active:bg-accent/5 transition-colors"
            >
              <div className="h-16 w-16 sm:h-18 sm:w-18 flex items-center justify-center rounded-2xl bg-card border border-border hover:border-accent/30 transition-all shadow-lg shadow-foreground/5 dark:shadow-black/40 active:scale-95 active:shadow-md">
                <item.icon className="h-7 w-7 text-foreground" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Popular Cities */}
        <motion.section {...reveal} transition={{ delay: 0.1 }}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-wide uppercase text-foreground/80 flex items-center gap-3">
              <span className="h-1 w-5 rounded-full bg-accent" />
              {t('home.otherCities')}
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-[12px] h-9 px-3" onClick={() => navigate('/city')}>
              {t('common.change')}
            </Button>
          </div>

          {/* Horizontal scroll with visible fade indicator */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {isLoading ? (
                [1, 2, 3].map((i) => <SkeletonCityCard key={i} />)
              ) : (
                citySpots.map((item) => (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative h-44 w-36 flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-border bg-card shadow-2xl group snap-start"
                    onClick={() => navigate('/city')}
                  >
                    <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[14px] font-black text-white">{item.name}</p>
                      <p className="text-[11px] text-white/60 font-bold uppercase tracking-tight">{item.country}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {/* Fade indicators for scrollable content */}
            <div className="absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </motion.section>

        {/* Landmarks */}
        <motion.section {...reveal} transition={{ delay: 0.2 }} className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-wide uppercase text-foreground/80 flex items-center gap-3">
              <span className="h-1 w-5 rounded-full bg-accent opacity-70" />
              {exploreMode === 'current-location' ? t('home.recommendedAround') : t('home.mustSee', { city: activeCity })}
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-[12px] h-9 px-3" onClick={() => navigate('/explore')}>
              {t('common.seeAll')}
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : (
              realItems.filter(i => i.type === 'monument').slice(0, 5).map((item: any) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98, x: 5 }}
                  onClick={() => navigate(`/activity/${item.id}`, { state: { item } })}
                  className="group flex gap-4 p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-accent/20 active:bg-accent/5 transition-all cursor-pointer shadow-sm"
                >
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border border-border">
                    <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="text-[14px] font-semibold tracking-tight text-foreground mb-1 truncate">{item.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase mb-2">{item.address || item.city}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/10">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-[11px] font-bold text-accent">{item.rating}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground">{item.price || item.avgPrice} MAD</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>

        {/* Experiences */}
        <motion.section {...reveal} transition={{ delay: 0.3 }} className="space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold tracking-wide uppercase text-foreground/80 flex items-center gap-3">
              <span className="h-1 w-5 rounded-full bg-accent opacity-50" />
              {t('home.experiences')}
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1, 2].map((i) => <SkeletonCard key={i} className="h-56 rounded-3xl" />)
            ) : (
              realItems.filter(i => i.type !== 'monument').slice(0, 5).map((item: any) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(item.type === 'restaurant' ? `/restaurant/${item.id}` : `/activity/${item.id}`, { state: { item } })}
                  className="group relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-border bg-card shadow-2xl cursor-pointer"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="flex justify-between items-end gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-accent/20 text-accent border-none text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                            {item.type}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white text-white" />
                            <span className="text-[11px] font-bold text-white">{item.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-1 truncate">{item.name}</h3>
                        <p className="text-[11px] text-white/60 font-medium uppercase tracking-tight">{item.address || item.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{item.price || item.avgPrice} MAD</p>
                        <p className="text-[10px] text-white/40 font-medium uppercase">From</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}
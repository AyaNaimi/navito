import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, DollarSign, MapPin, Search, ShieldAlert, Sparkles, Star, TrendingUp, UserRound, ArrowRight, Loader2 } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
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

const STAGGER = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -6, transition: { duration: 0.2 } }
};

function useParallax(ref: React.RefObject<HTMLDivElement>, offset: number = 0) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  return useTransform(scrollYProgress, [0, 1], [0, offset]);
}

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-4 p-4 animate-pulse ${className}`}>
      <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      <div className="flex-1 space-y-3">
        <div className="h-4 sm:h-5 w-3/4 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="h-3 w-1/2 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="flex gap-2">
          <div className="h-5 w-12 rounded-full bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
          <div className="h-5 w-10 rounded-full bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

function SkeletonFeatured({ className = "" }: { className?: string }) {
  return (
    <div className={`aspect-[4/3] sm:aspect-[16/9] rounded-3xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] ${className}`} />
  );
}

function SkeletonCityCard() {
  return (
    <div className="h-36 sm:h-44 w-32 sm:w-36 flex-shrink-0 rounded-2xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
  );
}

function SkeletonExperience() {
  return (
    <div className="aspect-[16/9] rounded-2xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
  );
}

function QuickActionButton({ icon: Icon, label, onClick, delay }: { icon: any; label: string; onClick: () => void; delay: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <motion.div 
        className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white transition-all shadow-sm"
        whileHover={{ 
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          borderColor: "#E5E5E5"
        }}
      >
        <Icon className="h-5 w-5 text-[#171717] transition-transform group-hover:scale-110" />
      </motion.div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] group-hover:text-[#171717] transition-colors">
        {label}
      </span>
    </motion.button>
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
  const citySpots = useMemo(() => cities.filter((item) => item.name !== activeCity).slice(0, 3), [activeCity]);
  const cityMonuments = useMemo(() => monuments.filter((item) => item.city === activeCity), [activeCity]);
  const cityActivities = useMemo(() => activities.filter((item) => item.city === activeCity), [activeCity]);

  const cityData = useMemo(() => cities.find(c => c.name === activeCity), [activeCity]);
  const mapCenter: [number, number] = useMemo(() => {
    const raw: [number, number] = exploreMode === 'current-location' && currentPosition 
      ? [currentPosition.lat, currentPosition.lng] 
      : cityData ? [cityData.lat, cityData.lng] : [33.5731, -7.5898];
    return [Math.round(raw[0] * 1000) / 1000, Math.round(raw[1] * 1000) / 1000];
  }, [exploreMode, currentPosition?.lat, currentPosition?.lng, cityData]);

  const { scrollY } = useScroll({ container: containerRef });
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRealPlacesLocal(mapCenter[0], mapCenter[1], 4000);
        if (isMounted) {
          setRealItems(data || []);
        }
      } catch (err) {
        console.warn('Home Error:', err);
        if (isMounted) setRealItems([]);
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
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#171717] pb-20 overflow-x-hidden" ref={containerRef}>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-0 w-[50%] h-[40%] rounded-full bg-[#171717]/[0.02] blur-[100px] transform translate-x-1/2" />
        <div className="absolute bottom-20 left-0 w-[40%] h-[40%] rounded-full bg-[#171717]/[0.03] blur-[80px] transform -translate-x-1/2" />
      </div>

      {/* Sticky Header with scroll effects */}
      <motion.header 
        style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur}px)` }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5] px-4 sm:px-6 py-5 sm:py-6"
      >
        <div className="max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 min-w-0"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="h-10 sm:h-11"
              >
                <MapPin className="h-10 sm:h-11 w-10 sm:w-11 text-[#171717]" />
              </motion.div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{t('home.welcome')}</p>
                <h1 className="text-[18px] sm:text-[20px] font-bold tracking-tight truncate">
                  {exploreMode === 'current-location' ? t('home.currentMap') : activeCity}
                </h1>
              </div>
            </motion.div>
            
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')} 
              className="group flex-shrink-0"
            >
              <Avatar className="h-10 w-10 border-2 border-[#E5E5E5] shadow-sm transition-all group-hover:border-[#171717] group-hover:shadow-md">
                <AvatarFallback className="bg-[#F5F5F7] text-[#171717]">
                  <UserRound className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-4 sm:mt-6"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3] group-focus-within:text-[#171717] transition-colors" />
              <Input 
                placeholder={t('home.searchPlaceholder')} 
                className="h-11 sm:h-12 rounded-2xl border-0 bg-[#F5F5F7] pl-11 text-[14px] font-medium transition-all focus:bg-white focus:ring-2 focus:ring-[#171717]/10 focus:shadow-lg cursor-pointer"
                onClick={() => navigate('/explore')} 
                readOnly
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <ArrowRight className="h-4 w-4 text-[#A3A3A3]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Quick Actions with stagger animation */}
        <motion.div {...reveal} className="grid grid-cols-4 gap-2 sm:gap-4">
          {quickActions.map((item, idx) => (
            <QuickActionButton 
              key={item.id} 
              icon={item.icon} 
              label={item.label} 
              onClick={() => navigate(item.path)}
              delay={idx * 0.1}
            />
          ))}
        </motion.div>

        {/* Popular Cities - Horizontal scroll */}
        <motion.section {...reveal} transition={{ delay: 0.1 }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#171717]" />
              {t('home.otherCities', 'Discover Cities')}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/city')} 
              className="text-[12px] font-bold text-[#737373] hover:text-[#171717] transition-colors"
            >
              {t('common.change')}
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              {[1, 2, 3].map((i) => <SkeletonCityCard key={i} />)}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 sm:gap-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
            >
              {citySpots.map((item, idx) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative h-36 sm:h-44 w-32 sm:w-36 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm group" 
                  onClick={() => navigate('/city')}
                >
                  <motion.div
                    className="h-full w-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </motion.div>
                  <motion.div 
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 sm:p-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="text-[13px] font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/70 font-medium">{item.country}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Landmarks */}
        <motion.section {...reveal} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-tight">
              {exploreMode === 'current-location' ? t('home.recommendedAround', 'Recommended Around You') : t('home.mustSee', { city: activeCity })}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')} 
              className="text-[12px] font-bold text-[#737373] hover:text-[#171717] transition-colors"
            >
              {t('common.seeAll')}
            </motion.button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <motion.div variants={STAGGER} initial="initial" animate="animate" className="space-y-3">
              {(() => {
                const displayItems = realItems.filter(i => i.type === 'monument');
                const finalItems = displayItems.length > 0 ? displayItems.slice(0, 5) : (cityMonuments.length > 0 ? cityMonuments : monuments.slice(0, 3));
                
                return finalItems.map((item: any, idx: number) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      onClick={() => navigate(`/activity/${item.id}`, { state: { item } })} 
                      className="flex cursor-pointer overflow-hidden border-[#E5E5E5] bg-white shadow-sm transition-all hover:bg-[#F5F5F7] group"
                    >
                      <div className="relative h-16 sm:h-24 w-16 sm:w-24 flex-shrink-0 overflow-hidden">
                        <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <CardContent className="flex flex-1 flex-col justify-center p-3 sm:p-4 min-w-0">
                        <h3 className="text-[13px] sm:text-[14px] font-bold truncate group-hover:text-[#171717] transition-colors">{item.name}</h3>
                        <p className="text-[10px] text-[#A3A3A3] truncate mt-0.5">{item.address || item.city}</p>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-[#171717] text-[#171717]" />
                            <span className="text-[11px] sm:text-[12px] font-bold">{item.rating}</span>
                          </div>
                          <Badge variant="secondary" className="bg-[#F5F5F7] text-[#737373] text-[9px] font-bold border-none">
                            {item.price || item.avgPrice} MAD
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ));
              })()}
            </motion.div>
          )}
        </motion.section>

        {/* Experiences */}
        <motion.section {...reveal} transition={{ delay: 0.3 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-[#171717]" />
            <h2 className="text-[15px] font-bold tracking-tight text-[#171717]">{t('home.experiences')}</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[1, 2].map((i) => <SkeletonExperience key={i} />)}
            </div>
          ) : (
            <motion.div variants={STAGGER} initial="initial" animate="animate" className="space-y-3 sm:space-y-4">
              {(() => {
                const displayItems = realItems.filter(i => i.type !== 'monument');
                const finalItems = displayItems.length > 0 ? displayItems.slice(0, 5) : (cityActivities.length > 0 ? cityActivities : activities.slice(0, 3));

                return finalItems.map((item: any, idx: number) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.99 }}
                  >
                    <div 
                      onClick={() => 
                        navigate(item.type === 'restaurant' ? `/restaurant/${item.id}` : `/activity/${item.id}`, { 
                          state: { item } 
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm"
                    >
                      <div className="aspect-[4/3] sm:aspect-[16/9] relative overflow-hidden">
                        <ImageWithFallback 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <motion.div 
                          className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 text-white"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] sm:text-[18px] font-bold tracking-tight mb-1 truncate">{item.name}</h3>
                              <p className="text-[11px] sm:text-[12px] opacity-80 font-medium truncate">
                                {item.address || item.city} • {item.duration || 'Open Access'}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[14px] sm:text-[16px] font-bold">{item.price || item.avgPrice} MAD</p>
                              <div className="flex items-center justify-end gap-1.5 mt-1">
                                <Star className="h-3 w-3 fill-white text-white" />
                                <span className="text-[11px] font-bold">{item.rating}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ));
              })()}
            </motion.div>
          )}
        </motion.section>
      </main>

      <BottomNav />

      {/* Custom CSS for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
import { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Bus, Calculator, Car, Clock, Languages, MapPin, 
  MessageCircle, Navigation, Phone, Shield, Star, 
  Train, TramFront, ArrowRight, Zap, Info, X, SlidersHorizontal
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { drivers, transportOptions } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const STAGGER = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -8, transition: { duration: 0.25 } }
};

function SkeletonDriver() {
  return (
    <div className="flex gap-5 p-5 rounded-[28px] bg-white border border-[#E5E5E5] animate-pulse">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-1/2 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
          <div className="h-6 w-12 rounded-full bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
        <div className="h-8 w-full rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

function SkeletonGuide() {
  return (
    <div className="flex gap-5 p-5 rounded-[28px] bg-white border border-[#E5E5E5] animate-pulse">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-2/3 rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="h-4 w-full rounded-lg bg-gradient-to-r from-[#E5E5E5] via-[#F0F0F0] to-[#E5E5E5] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

export default function Transport() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { authMode, city, exploreMode } = useAppContext();
  const [pickup, setPickup] = useState(city || '');
  const [destination, setDestination] = useState('');
  const [activeTab, setActiveTab] = useState('drivers');
  const [isLoading] = useState(false);

  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.available), []);
  const transportIcons = {
    'Petit Taxi': Car,
    'Grand Taxi': TramFront,
    'City Bus': Bus,
    'ONCF Train': Train,
  } as const;

  const { scrollY } = useScroll({ container: containerRef });
  const headerOpacity = useTransform(scrollY, [0, 80], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 80], [0, 8]);

  const handleRequestDriver = () => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/transport');
      return;
    }
    toast.success('Driver request sent successfully');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col pb-20 font-sans antialiased text-[#171717] overflow-x-hidden" ref={containerRef}>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] -left-[5%] w-[45%] h-[45%] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-500/[0.03] blur-[100px]" />
      </div>

      {/* Header with scroll effect */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur}px)` }}
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-[#E5E5E5]/50 px-4 sm:px-6 py-5 sm:py-6"
      >
        <div className="max-w-xl mx-auto w-full flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mobility</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A3A3A3] mt-1 flex items-center gap-2">
              <span className="w-4 h-px bg-emerald-500"></span>
              {exploreMode === 'city' && city ? `Reliable travel in ${city}` : 'Find your way with Navito'}
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="h-11 w-11 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shadow-sm"
          >
             <Navigation className="h-5.5 w-5.5" />
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Tabs with animations */}
        <motion.div {...reveal} className="mb-6 sm:mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-1 pt-4 sm:pt-6">
              <motion.div 
                className="grid w-full grid-cols-3 h-11 sm:h-12 rounded-2xl bg-[#F5F5F7] p-1.5 border border-[#E5E5E5]/40 shadow-sm"
                layoutId="tabs-bg"
              >
                <TabsTrigger 
                  value="drivers" 
                  className="rounded-xl text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
                >
                  Drivers
                </TabsTrigger>
                <TabsTrigger 
                  value="guide" 
                  className="rounded-xl text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                >
                  Handbook
                </TabsTrigger>
                <TabsTrigger 
                  value="simulator" 
                  className="rounded-xl text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm transition-all"
                >
                  Price Sim
                </TabsTrigger>
              </motion.div>
            </div>
          </Tabs>
        </motion.div>

        {activeTab === 'drivers' && (
          <motion.div className="space-y-6 sm:space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Search inputs */}
            <motion.div {...reveal} className="space-y-3 sm:space-y-4 bg-white p-4 sm:p-6 rounded-[28px] border border-[#E5E5E5] shadow-sm">
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#A3A3A3] group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all font-bold" />
                <Input 
                  id="pickup"
                  name="pickup"
                  placeholder="Pickup location" 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)} 
                  className="h-12 sm:h-13 rounded-2xl border-none bg-[#F5F5F7] pl-12 text-[14px] font-medium transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/10" 
                />
              </div>
              <div className="relative group">
                <Navigation className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#A3A3A3] group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all font-bold" />
                <Input 
                  id="destination"
                  name="destination"
                  placeholder="Destination" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  className="h-12 sm:h-13 rounded-2xl border-none bg-[#F5F5F7] pl-12 text-[14px] font-medium transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/10" 
                />
              </div>
            </motion.div>

            {/* Drivers list */}
            <motion.div variants={STAGGER} initial="initial" animate="animate" className="space-y-4 sm:space-y-5">
              <motion.p 
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A3A3A3] ml-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                 <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500 animate-pulse" />
                 Active Operators Nearby
              </motion.p>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <SkeletonDriver key={i} />)}
                </div>
              ) : (
                availableDrivers.map((driver, idx) => (
                  <motion.div 
                    key={driver.id}
                    variants={cardVariants}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover="hover"
                    whileTap={{ scale: 0.99 }}
                    className="relative group"
                  >
                    <Card className="rounded-[28px] border border-[#E5E5E5] bg-white p-4 sm:p-6 shadow-sm group-hover:border-emerald-500/30 group-hover:shadow-xl transition-all">
                      <div className="flex gap-4 sm:gap-6">
                        <div className="relative">
                          <motion.div 
                            className="h-14 sm:h-18 w-14 sm:w-18 rounded-2xl overflow-hidden border border-[#E5E5E5] bg-[#FAFAFA] group-hover:border-emerald-500/40 transition-all shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img src={driver.image} alt={driver.name} className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                          </motion.div>
                          {driver.verified && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ rotate: 12, scale: 1.1 }}
                              className="absolute -bottom-1 -right-1 flex h-6 sm:h-7 w-6 sm:w-7 items-center justify-center rounded-2xl border-2 border-white bg-[#171717] group-hover:bg-emerald-500 shadow-md"
                            >
                              <Shield className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-white" />
                            </motion.div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[14px] sm:text-[16px] font-bold text-[#171717] group-hover:text-emerald-600 transition-colors">
                              {driver.name}
                            </h3>
                            <motion.div 
                              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning-vibrant/10"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Star className="h-3.5 w-3.5 fill-warning-vibrant text-warning-vibrant" />
                              <span className="text-[12px] font-bold text-warning-vibrant">{driver.rating}</span>
                            </motion.div>
                          </div>

                          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-2">
                            <Badge variant="secondary" className="bg-[#F5F5F7] text-[#171717] group-hover:bg-emerald-500 group-hover:text-white text-[10px] items-center gap-1.5 px-3 sm:px-3.5 h-6 sm:h-7 rounded-full transition-all tracking-wide border-none">
                              <Car className="h-3.5 w-3.5" />
                              {driver.vehicleType}
                            </Badge>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#A3A3A3]">
                              <MapPin className="h-3.5 w-3.5 opacity-60" />
                              {driver.distance} KM AWAY
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#737373] opacity-80 pt-1">
                            <Languages className="h-4 w-4" />
                            {driver.languages ? driver.languages.join(' • ') : 'English • French'}
                          </div>

                          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#F5F5F7] group-hover:border-emerald-100 transition-colors">
                            <div className="text-[14px] sm:text-[15px] font-bold text-[#171717]">
                              {driver.pricePerKm} <span className="text-[10px] text-[#A3A3A3] font-bold ml-1 tracking-tighter">MAD/KM</span>
                            </div>

                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center rounded-full border border-[#E5E5E5] hover:bg-emerald-50 hover:border-emerald-200 transition-all text-[#171717]"
                              >
                                <Phone className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRequestDriver} 
                                className="h-9 sm:h-10 px-4 sm:px-6 bg-[#171717] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                              >
                                Request
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'guide' && (
          <motion.div className="space-y-4 sm:space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A3A3A3] ml-2 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
               Regional Logistics Protocols
            </p>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => <SkeletonGuide key={i} />)}
              </div>
            ) : (
              transportOptions.map((transport, idx) => (
                <motion.div 
                  key={transport.id} 
                  {...reveal} 
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card className="rounded-[28px] border border-[#E5E5E5] bg-white p-4 sm:p-6 shadow-sm overflow-hidden flex gap-4 sm:gap-6 group hover:bg-indigo-50/20 hover:border-indigo-500/20 transition-all hover:shadow-md cursor-pointer">
                    <motion.div 
                      className="flex h-14 sm:h-18 w-14 sm:w-18 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7] border border-[#E5E5E5] group-hover:scale-105 duration-500 transition-transform"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ImageWithFallback src={transport.image} alt={transport.title} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    </motion.div>
                    <div className="min-w-0 flex flex-col justify-center space-y-2">
                      <div className="flex items-center gap-2.5">
                        {(() => {
                          const Icon = transportIcons[transport.title as keyof typeof transportIcons] ?? Car;
                          return <Icon className="h-4 w-4 text-indigo-500 group-hover:animate-pulse" />;
                        })()}
                        <h3 className="text-[13px] sm:text-[15px] font-bold text-[#171717] group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                          {transport.title}
                        </h3>
                      </div>
                      <p className="text-[12px] sm:text-[13px] text-[#737373] leading-relaxed font-medium opacity-80 line-clamp-2">
                        {transport.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'simulator' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-8 sm:space-y-10 bg-white p-8 sm:p-10 rounded-[40px] border border-[#E5E5E5] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-28 sm:size-32 bg-rose-500/5 blur-3xl rounded-full" />
            <motion.div 
              whileHover={{ rotate: 6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto flex h-24 sm:h-28 w-24 sm:w-28 items-center justify-center rounded-[32px] bg-rose-50 border border-rose-100 shadow-inner group cursor-pointer"
            >
              <Calculator className="h-10 sm:h-12 w-10 sm:w-12 text-rose-500" />
            </motion.div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#171717] tracking-tight">Fare Estimator Pro</h3>
              <p className="mx-auto max-w-[260px] text-[13px] sm:text-[14px] text-[#737373] leading-relaxed font-medium opacity-80">
                Calculate precise transportation costs based on live local city algorithms.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/taxi-simulator')} 
              className="h-12 sm:h-14 px-8 sm:px-10 bg-[#171717] text-white rounded-[24px] font-bold text-[13px] sm:text-[14px] uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-rose-500 hover:shadow-rose-500/20 active:scale-95 transition-all"
            >
              Launch Simulator
            </motion.button>
            <div className="flex items-center justify-center gap-3 pt-3 sm:pt-4">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-5 sm:h-6 w-5 sm:w-6 rounded-full border-2 border-white bg-[#F5F5F7] flex items-center justify-center text-[10px] font-bold"
                    >
                      <Star className="h-2 sm:h-2.5 w-2 sm:w-2.5 fill-warning-vibrant text-warning-vibrant" />
                    </motion.div>
                 ))}
               </div>
               <span className="text-[10px] sm:text-[11px] font-bold text-[#A3A3A3]">500+ daily requests</span>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
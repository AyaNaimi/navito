import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone, Heart, Share2, DollarSign, Check, Navigation, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { restaurants } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const restaurant = location.state?.item || restaurants.find((r) => r.id === Number(id));

  if (!restaurant) {
    return (
      <div className="size-full flex items-center justify-center bg-[#FAFAFA] font-['Inter',sans-serif]">
        <p className="text-[13px] font-bold text-[#737373] uppercase tracking-wider">Restaurant not found</p>
      </div>
    );
  }

  const handleOpenMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (restaurant.phone) {
      window.open(`tel:${restaurant.phone}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col font-['Inter',sans-serif] antialiased selection:bg-black selection:text-white pb-32">
      {/* Image Header */}
      <div className="relative h-[40vh] w-full overflow-hidden bg-white">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="size-full"
        >
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover grayscale-[10%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-rose-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Hero Bottom Info */}
        <div className="absolute bottom-8 left-6 right-6">
           <motion.div 
            {...reveal}
            className="flex flex-col gap-2"
           >
              <div className="flex gap-2">
                <span className="bg-white/90 backdrop-blur-md text-[#171717] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 shadow-sm">
                  {restaurant.cuisine || 'Local Gastronomy'}
                </span>
                {restaurant.isPromoted && (
                  <span className="bg-[#171717]/80 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                    Premium Spotlight
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-3 text-white">
                 <div className="flex items-center gap-1.5 rounded-full bg-black/20 backdrop-blur-md px-3 py-1.5 border border-white/10">
                   <MapPin className="h-3 w-3" />
                   <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px]">
                     {restaurant.address || restaurant.city}
                   </span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                       <Star className="h-3 w-3 fill-white" />
                       <span className="text-[11px] font-bold">{restaurant.rating}</span>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-10 space-y-10 max-w-2xl mx-auto w-full">
        
        {/* Stats Grid */}
        <motion.section {...reveal} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-sm text-center">
            <DollarSign className="h-4 w-4 text-[#171717] mx-auto mb-2" />
            <p className="text-[9px] font-bold text-[#737373] uppercase tracking-wider mb-1">Price</p>
            <p className="text-[11px] font-bold text-[#171717] uppercase tracking-tight">{restaurant.price || restaurant.avgPrice + ' MAD'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-sm text-center">
            <Clock className="h-4 w-4 text-[#171717] mx-auto mb-2" />
            <p className="text-[9px] font-bold text-[#737373] uppercase tracking-wider mb-1">Hours</p>
            <p className="text-[11px] font-bold text-[#171717] uppercase tracking-tight truncate">{restaurant.hours || 'Open Now'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-sm text-center" onClick={handleOpenMap} style={{ cursor: 'pointer' }}>
            <Navigation className="h-4 w-4 text-[#171717] mx-auto mb-2" />
            <p className="text-[9px] font-bold text-[#737373] uppercase tracking-wider mb-1">Location</p>
            <p className="text-[11px] font-bold text-[#171717] uppercase tracking-tight">Open Map</p>
          </div>
        </motion.section>

        {/* Real Address Section */}
        {restaurant.address && (
          <motion.section {...reveal} transition={{ delay: 0.15 }} className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-sm space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-[#171717]" />
                   </div>
                   <h3 className="text-[12px] font-bold uppercase tracking-wider">Official Address</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleOpenMap} className="text-[10px] uppercase font-bold text-[#737373]">
                   Directions <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
             </div>
             <p className="text-[14px] font-medium text-[#737373] pl-10">
                {restaurant.address}, {restaurant.city}
             </p>
             <p className="text-[12px] font-mono text-[#A3A3A3] pl-10">
                {restaurant.lat.toFixed(6)}, {restaurant.lng.toFixed(6)}
             </p>
          </motion.section>
        )}

        {/* Story Section */}
        <motion.section {...reveal} transition={{ delay: 0.15 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#171717]" />
            <h2 className="text-[13px] font-bold text-[#171717] uppercase tracking-wider">About this place</h2>
          </div>
          <p className="text-[14px] leading-relaxed text-[#737373] font-medium">
            {restaurant.description}
          </p>
        </motion.section>

        {/* Contact Info */}
        {restaurant.phone && (
          <motion.section {...reveal} transition={{ delay: 0.2 }} className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                  <Phone className="h-4 w-4 text-[#171717]" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Phone Number</p>
                  <p className="text-[14px] font-bold text-[#171717] tracking-tight">{restaurant.phone}</p>
               </div>
            </div>
            <Button size="sm" onClick={handleCall} className="h-9 px-4 rounded-full bg-[#171717] text-white font-bold text-[11px] uppercase tracking-wider">
               Call Now
            </Button>
          </motion.section>
        )}
      </main>

      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-6 left-6 right-6 z-[100]"
      >
        <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-xl border border-[#E5E5E5]/50 rounded-full p-2 flex items-center gap-3 shadow-2xl">
          <button 
            onClick={handleCall}
            disabled={!restaurant.phone}
            className={`flex-1 h-12 rounded-full border border-[#E5E5E5] bg-white text-[#171717] text-[12px] font-bold flex items-center justify-center gap-2 transition-all ${!restaurant.phone ? 'opacity-50 grayscale' : 'hover:bg-[#F5F5F7]'}`}
          >
             <Phone className="h-4 w-4" /> Quick Call
          </button>
          <button 
            onClick={handleOpenMap}
            className="flex-1 h-12 rounded-full bg-[#171717] text-white text-[12px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg shadow-black/20"
          >
             <Navigation className="h-4 w-4" /> Get Route
          </button>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

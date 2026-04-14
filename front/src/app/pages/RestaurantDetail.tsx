import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone, Heart, Share2, DollarSign, Check, Navigation, Info, ExternalLink, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans">
        <p className="text-[13px] font-black italic text-muted-foreground uppercase tracking-[0.2em]">Asset not found in sector</p>
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
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500 pb-32">
      {/* Image Header */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-card border-b border-border">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="size-full"
        >
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover grayscale-[0.2]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

        {/* Navigation */}
        <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-xl border border-white/20 text-white hover:text-rose-500 shadow-2xl transition-all"
            >
              <Heart className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Hero Bottom Info */}
        <div className="absolute bottom-10 left-6 right-6 font-sans">
           <motion.div 
            {...reveal}
            className="flex flex-col gap-3"
           >
              <div className="flex gap-2">
                <span className="bg-foreground text-background text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-2xl italic">
                  {restaurant.cuisine || 'Local Gastronomy'}
                </span>
                {restaurant.isPromoted && (
                  <span className="bg-accent text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-2xl flex items-center gap-1.5 border-none">
                    <Sparkles className="h-3 w-3" /> Spotlight
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tighter leading-tight uppercase italic underline decoration-accent decoration-4 underline-offset-4">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                 <div className="flex items-center gap-2 rounded-xl bg-background/60 backdrop-blur-md px-4 py-2 border border-border shadow-xl">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[11px] font-black uppercase tracking-widest truncate max-w-[180px] text-foreground">
                      {restaurant.address || restaurant.city}
                    </span>
                 </div>
                 <div className="flex items-center gap-2 bg-accent/20 px-3 py-2 rounded-xl border border-accent/30 shadow-xl">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-[13px] font-black text-accent">{restaurant.rating}</span>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-12 space-y-12 max-w-2xl mx-auto w-full font-sans">
        
        {/* Stats Grid */}
        <motion.section {...reveal} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-[2rem] border border-border shadow-2xl text-center backdrop-blur-md transition-all hover:border-accent/20">
            <DollarSign className="h-5 w-5 text-accent mx-auto mb-3" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 italic">Protocol Cost</p>
            <p className="text-[13px] font-black text-foreground uppercase tracking-tight tabular-nums">{restaurant.price || (restaurant.avgPrice || 'TBD') + ' MAD'}</p>
          </div>
          <div className="bg-card p-5 rounded-[2rem] border border-border shadow-2xl text-center backdrop-blur-md transition-all hover:border-accent/20">
            <Clock className="h-5 w-5 text-accent mx-auto mb-3" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 italic">Schedule</p>
            <p className="text-[13px] font-black text-foreground uppercase tracking-tight truncate tabular-nums">{restaurant.hours || 'Active Now'}</p>
          </div>
          <div className="bg-card p-5 rounded-[2rem] border border-border shadow-2xl text-center backdrop-blur-md transition-all hover:border-accent/20 cursor-pointer" onClick={handleOpenMap}>
            <Navigation className="h-5 w-5 text-accent mx-auto mb-3" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 italic">Navigation</p>
            <p className="text-[13px] font-black text-foreground uppercase tracking-tight">Open Matrix</p>
          </div>
        </motion.section>

        {/* Real Address Section */}
        {restaurant.address && (
          <motion.section {...reveal} transition={{ delay: 0.15 }} className="bg-card/40 border border-border p-6 rounded-[2.5rem] shadow-2xl space-y-4 backdrop-blur-md transition-all hover:bg-card">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-accent">
                      <MapPin className="h-5 w-5" />
                   </div>
                   <h3 className="text-[13px] font-black uppercase tracking-widest italic text-foreground">Active Sector Detail</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleOpenMap} className="text-[11px] uppercase font-black tracking-widest text-accent hover:bg-accent/5">
                   Link Map <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
             </div>
             <p className="text-[15px] font-bold text-foreground pl-12 leading-relaxed opacity-90">
                {restaurant.address}, {restaurant.city}
             </p>
             <p className="text-[12px] font-mono text-muted-foreground pl-12 tabular-nums">
                COORD: {restaurant.lat.toFixed(6)}, {restaurant.lng.toFixed(6)}
             </p>
          </motion.section>
        )}

        {/* Story Section */}
        <motion.section {...reveal} transition={{ delay: 0.15 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <h2 className="text-[14px] font-black text-foreground uppercase tracking-widest italic">Intelligence Dossier</h2>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 h-full w-1 rounded-full bg-border" />
            <p className="text-[15px] leading-relaxed text-muted-foreground font-medium pl-6">
              {restaurant.description || 'Accessing location biography... Premium curated gastronomic experience with localized coordination and service protocols.'}
            </p>
          </div>
        </motion.section>

        {/* Contact Info */}
        {restaurant.phone && (
          <motion.section {...reveal} transition={{ delay: 0.2 }} className="bg-foreground text-background p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between border-none">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-background/10 flex items-center justify-center text-background">
                  <Phone className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Comms Protocol</p>
                  <p className="text-[16px] font-black tracking-widest tabular-nums">{restaurant.phone}</p>
               </div>
            </div>
            <Button size="sm" onClick={handleCall} className="h-11 px-6 rounded-xl bg-background text-foreground font-black text-[11px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all border-none">
               Initialize Call
            </Button>
          </motion.section>
        )}
      </main>

      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-8 left-6 right-6 z-[100]"
      >
        <div className="max-w-xl mx-auto bg-background/80 backdrop-blur-3xl border border-border/50 rounded-3xl p-3 flex items-center gap-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
          <button 
            onClick={handleCall}
            disabled={!restaurant.phone}
            className={`flex-1 h-14 rounded-2xl border border-border bg-card text-foreground text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${!restaurant.phone ? 'opacity-30 grayscale' : 'hover:bg-muted active:scale-[0.98]'}`}
          >
             <Phone className="h-4 w-4 text-accent" /> Contact Hub
          </button>
          <button 
            onClick={handleOpenMap}
            className="flex-1 h-14 rounded-2xl bg-foreground text-background text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-accent hover:text-white active:scale-[0.98] shadow-2xl shadow-foreground/10"
          >
             <Navigation className="h-4 w-4" /> Initialize Route
          </button>
        </div>
      </motion.div>
    </div>
  );
}

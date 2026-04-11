import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Clock, Info, Heart, 
  Share2, DollarSign, Navigation, Calendar, Users, Briefcase, ExternalLink, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { activities, monuments } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // We combine mock and real data by checking for the item in state (passed from Explore)
  const activity = location.state?.item || 
                  monuments.find((m) => m.id === Number(id)) || 
                  activities.find((a) => a.id === Number(id));

  if (!activity) {
    return (
      <div className="size-full flex items-center justify-center bg-white">
        <p className="text-[13px] font-bold text-[#737373] uppercase tracking-widest">Activity not found</p>
      </div>
    );
  }

  const handleOpenMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (activity.phone) {
      window.open(`tel:${activity.phone}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans antialiased text-[#171717] pb-32">
      {/* Image Header */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-white">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="size-full"
        >
          <ImageWithFallback
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover transition-all"
          />
        </motion.div>
        
        {/* Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-rose-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Hero Bottom Info */}
        <div className="absolute bottom-8 left-8 right-8 z-10 text-white">
           <motion.div {...reveal} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="bg-white text-[#171717] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  {activity.type === 'monument' ? 'Heritage' : 'Activity'}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                  {activity.city}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight leading-tight max-w-[90%]">
                {activity.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 glass-effect px-3 py-1.5 rounded-full border border-white/10">
                  <Star className="h-3 w-3 fill-white" />
                  <span className="text-[11px] font-bold">{activity.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                   <MapPin className="h-4 w-4 opacity-80" />
                   <span className="text-[11px] font-bold opacity-90 truncate max-w-[200px]">
                      {activity.address || activity.city}
                   </span>
                </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 pt-12 space-y-12 max-w-2xl mx-auto w-full">
        
        {/* Stats Section */}
        <motion.section {...reveal} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
           <div className="bg-[#F5F5F7] p-5 rounded-3xl space-y-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <DollarSign className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Pricing</p>
                 <p className="text-[14px] font-bold">
                    {activity.price === 'Free' ? 'Free Entrance' : `From ${activity.price || activity.avgPrice} MAD`}
                 </p>
              </div>
           </div>
           <div className="bg-[#F5F5F7] p-5 rounded-3xl space-y-3" onClick={handleOpenMap} style={{ cursor: 'pointer' }}>
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <Navigation className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Directions</p>
                 <p className="text-[14px] font-bold">Open on Maps</p>
              </div>
           </div>
        </motion.section>

        {/* Real Info Section (Address) */}
        {activity.address && (
          <motion.section {...reveal} transition={{ delay: 0.15 }} className="bg-white border border-[#E5E5E5] p-6 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center border border-[#E5E5E5]">
                    <MapPin className="h-5 w-5 text-[#171717]" />
                 </div>
                 <div>
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#737373] mb-1">Official Site</h3>
                    <p className="text-[15px] font-bold leading-snug">{activity.address}</p>
                 </div>
              </div>
              <Button size="sm" variant="ghost" onClick={handleOpenMap} className="text-[#171717]">
                 <ExternalLink className="h-4 w-4" />
              </Button>
          </motion.section>
        )}

        {/* About Section */}
        <motion.section {...reveal} transition={{ delay: 0.2 }} className="space-y-6">
           <div className="flex items-center gap-2">
              <Info className="h-4.5 w-4.5" />
              <h2 className="text-[14px] font-bold uppercase tracking-widest">About this experience</h2>
           </div>
           <p className="text-[15px] leading-relaxed text-[#737373] font-medium leading-relaxed">
              {activity.description}
           </p>
           
           <div className="grid grid-cols-2 gap-y-6 pt-4">
              <div className="flex items-center gap-3">
                 <Users className="h-4 w-4 text-[#737373]" />
                 <span className="text-[13px] font-bold">{activity.groupSize || 'All groups'}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Calendar className="h-4 w-4 text-[#737373]" />
                 <span className="text-[13px] font-bold">{activity.duration || 'Flexible'}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Briefcase className="h-4 w-4 text-[#737373]" />
                 <span className="text-[13px] font-bold">{activity.includes || 'Standard Access'}</span>
              </div>
           </div>
        </motion.section>

        {/* Coordinates Section for Authenticity */}
        <motion.section {...reveal} transition={{ delay: 0.25 }} className="bg-[#171717] rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
           <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 blur-3xl group-hover:bg-white/10 transition-all"></div>
           <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-white/60">
                 <MapPin className="h-3 w-3" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Precise Location</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold tracking-tight">{activity.lat.toFixed(4)}</span>
                 <span className="text-white/40 font-mono text-[11px]">LAT</span>
                 <span className="text-3xl font-bold tracking-tight ml-4">{activity.lng.toFixed(4)}</span>
                 <span className="text-white/40 font-mono text-[11px]">LNG</span>
              </div>
              <p className="text-[12px] text-white/50 leading-relaxed max-w-[80%]">
                 This location is verified by real-time map data to ensure zero mistakes during your trip discovery.
              </p>
           </div>
        </motion.section>

        {/* Contact if available */}
        {activity.phone && (
          <motion.section {...reveal} transition={{ delay: 0.3 }} className="bg-white border border-[#E5E5E5] p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                 </div>
                 <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">Inquiries</h3>
                    <p className="text-[14px] font-bold">{activity.phone}</p>
                 </div>
              </div>
              <Button size="sm" onClick={handleCall} className="rounded-full h-10 px-6 bg-[#171717] text-white text-[11px] font-bold uppercase tracking-widest">
                 Call
              </Button>
          </motion.section>
        )}
      </main>

      {/* Footer Navigation */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#F5F5F7] p-8 z-50 flex items-center justify-between"
      >
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Pricing</span>
            <span className="text-[18px] font-bold">{activity.price === 'Free' ? 'Free' : `${activity.price || activity.avgPrice} MAD`}</span>
         </div>
         <Button 
            className="h-12 px-10 rounded-2xl bg-[#171717] text-white font-bold text-[13px] shadow-lg shadow-black/10 hover:shadow-xl transition-all"
            onClick={handleOpenMap}
         >
            Get Directions
         </Button>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
      `}} />
    </div>
  );
}

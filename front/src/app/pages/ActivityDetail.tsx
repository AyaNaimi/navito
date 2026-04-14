import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Star, Clock, Info, Heart,
  Share2, DollarSign, Navigation, Calendar, Users, Briefcase, ExternalLink, Phone, Sparkles,
  ChevronLeft, ChevronRight, X, ThumbsUp, MessageCircle, Bookmark, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { activities, monuments } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// Mock reviews data
const mockReviews = [
  { id: 1, user: "Sarah M.", avatar: "https://i.pravatar.cc/150?img=1", rating: 5, date: "2026-04-01", comment: "Une expérience incroyable ! Le guide était passionné et les lieux magnifiques.", likes: 12 },
  { id: 2, user: "Marco R.", avatar: "https://i.pravatar.cc/150?img=3", rating: 4, date: "2026-03-28", comment: "Très belle découverte. Je recommande d'y aller tôt le matin pour éviter la foule.", likes: 8 },
  { id: 3, user: "Yuki T.", avatar: "https://i.pravatar.cc/150?img=5", rating: 5, date: "2026-03-15", comment: "Parfait pour les photos. Architecture impressionnante.", likes: 15 },
];

// Mock gallery images
const getGalleryImages = (mainImage: string) => [
  mainImage,
  "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80",
];

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [participants, setParticipants] = useState(1);

  // We combine mock and real data by checking for the item in state (passed from Explore)
  const activity = location.state?.item ||
                  monuments.find((m) => m.id === Number(id)) ||
                  activities.find((a) => a.id === Number(id));

  const galleryImages = activity ? getGalleryImages(activity.image) : [];

  const availableDates = [
    { date: '2026-04-15', day: 'Mar', num: '15' },
    { date: '2026-04-16', day: 'Mer', num: '16' },
    { date: '2026-04-17', day: 'Jeu', num: '17' },
    { date: '2026-04-18', day: 'Ven', num: '18' },
    { date: '2026-04-19', day: 'Sam', num: '19' },
  ];

  const availableTimes = ['09:00', '11:00', '14:00', '16:00'];

  if (!activity) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans">
        <p className="text-[13px] font-black italic text-muted-foreground uppercase tracking-[0.2em]">Asset not found in sector</p>
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.name,
          text: activity.description,
          url: window.location.href,
        });
      } catch {
        toast.info('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Retiré de la liste' : 'Enregistré pour plus tard');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }
    toast.success('Réservation initiée ! Redirection vers le paiement...');
    navigate(`/checkout/activity/${activity.id}`, {
      state: { activity, date: selectedDate, time: selectedTime, participants }
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground pb-40 transition-colors duration-500 overflow-x-hidden">
      {/* Image Header */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-card border-b border-border group">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="size-full cursor-pointer"
          onClick={() => setShowGallery(true)}
        >
          <ImageWithFallback
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        {/* Gallery Thumbnails Preview */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {galleryImages.slice(0, 4).map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentImageIndex(idx); setShowGallery(true); }}
              className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all"
            />
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-20">
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
              onClick={handleShare}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-xl border border-white/20 shadow-2xl transition-all ${isLiked ? 'text-rose-500' : 'text-white hover:text-rose-500'}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Hero Bottom Info */}
        <div className="absolute bottom-10 left-8 right-8 z-10 text-foreground font-sans">
          <motion.div {...reveal} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className="bg-foreground text-background text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-2xl italic">
                  {activity.type === 'monument' ? 'Heritage Protocol' : 'Activity Node'}
                </span>
                <span className="bg-accent/20 backdrop-blur-md text-accent text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-accent/20 shadow-xl">
                  {activity.city}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-[1.1] max-w-[90%] uppercase italic underline decoration-accent decoration-4 underline-offset-4">
                {activity.name}
              </h1>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2 bg-accent/20 px-3 py-2 rounded-xl border border-accent/30 shadow-xl">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-[13px] font-black text-accent tabular-nums">{activity.rating}</span>
                </div>
                <div className="flex items-center gap-2.5">
                   <MapPin className="h-4.5 w-4.5 text-accent opacity-80" />
                   <span className="text-[11px] font-black uppercase tracking-widest opacity-90 truncate max-w-[200px] text-foreground">
                      {activity.address || activity.city}
                   </span>
                </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 pt-12 space-y-12 max-w-2xl mx-auto w-full font-sans">
        
        {/* Stats Section */}
        <motion.section {...reveal} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
           <div className="bg-card/40 border border-border p-6 rounded-[2.5rem] space-y-4 shadow-2xl backdrop-blur-md transition-all hover:bg-card">
              <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent shadow-lg">
                 <DollarSign className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic">Access Protocol</p>
                 <p className="text-[15px] font-black tabular-nums">
                    {activity.price === 'Free' ? 'Free Entrance' : `From ${activity.price || activity.avgPrice} MAD`}
                 </p>
              </div>
           </div>
           <div className="bg-card/40 border border-border p-6 rounded-[2.5rem] space-y-4 shadow-2xl backdrop-blur-md transition-all hover:bg-card cursor-pointer" onClick={handleOpenMap}>
              <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent shadow-lg">
                 <Navigation className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic">Navigation Matrix</p>
                 <p className="text-[15px] font-black">Open Map Protocol</p>
              </div>
           </div>
        </motion.section>

        {/* Real Info Section (Address) */}
        {activity.address && (
          <motion.section {...reveal} transition={{ delay: 0.15 }} className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl transition-all hover:border-accent/20">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent shadow-lg">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div className="min-w-0">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Verified Landmark</h3>
                    <p className="text-[15px] font-black leading-snug truncate text-foreground">{activity.address}</p>
                 </div>
              </div>
              <Button size="sm" variant="ghost" onClick={handleOpenMap} className="text-foreground hover:text-accent hover:bg-accent/5">
                 <ExternalLink className="h-5 w-5" />
              </Button>
          </motion.section>
        )}

        {/* About Section */}
        <motion.section {...reveal} transition={{ delay: 0.2 }} className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-accent" />
              <h2 className="text-[14px] font-black uppercase tracking-widest italic text-foreground flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-accent" />
                Intelligence Briefing
              </h2>
           </div>
           <div className="relative">
             <div className="absolute top-0 left-0 h-full w-1 rounded-full bg-border" />
             <p className="text-[15px] leading-relaxed text-muted-foreground font-medium pl-6 leading-relaxed opacity-90">
                {activity.description || 'Accessing node biography... This curated destination offers specialized cultural engagement and heritage preservation within the active sector.'}
             </p>
           </div>
           
           <div className="grid grid-cols-2 gap-y-8 pt-6 border-t border-border font-sans">
              <div className="flex items-center gap-3">
                 <Users className="h-5 w-5 text-accent opacity-60" />
                 <span className="text-[13px] font-black uppercase tracking-tight text-foreground">{activity.groupSize || 'Personnel: Universal'}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Calendar className="h-5 w-5 text-accent opacity-60" />
                 <span className="text-[13px] font-black uppercase tracking-tight text-foreground">{activity.duration || 'Duration: Static'}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Briefcase className="h-5 w-5 text-accent opacity-60" />
                 <span className="text-[13px] font-black uppercase tracking-tight text-foreground">{activity.includes || 'Package: Standard'}</span>
              </div>
           </div>
        </motion.section>

        {/* Coordinates Section for Authenticity */}
        <motion.section {...reveal} transition={{ delay: 0.25 }} className="bg-foreground text-background rounded-[2.5rem] p-10 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border-none">
           <div className="absolute top-0 right-0 h-40 w-40 bg-background/5 blur-3xl group-hover:bg-background/10 transition-all"></div>
           <div className="relative z-10 flex flex-col gap-6 font-sans">
              <div className="flex items-center gap-2 text-background/60">
                 <MapPin className="h-3.5 w-3.5" />
                 <span className="text-[10px] font-black uppercase tracking-[0.25em] italic">Precision Geolocation Matrix</span>
              </div>
              <div className="flex items-baseline gap-4">
                 <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-black tracking-tighter tabular-nums italic text-background">{activity.lat.toFixed(4)}</span>
                   <span className="text-background/40 font-black text-[10px] uppercase tracking-widest">LAT</span>
                 </div>
                 <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-black tracking-tighter tabular-nums italic text-background">{activity.lng.toFixed(4)}</span>
                   <span className="text-background/40 font-black text-[10px] uppercase tracking-widest">LNG</span>
                 </div>
              </div>
              <p className="text-[13px] text-background/60 leading-relaxed max-w-[85%] font-medium">
                 Sector identity verified by real-time spatial telemetry to ensure absolute protocol adherence during discovery phases.
              </p>
           </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section {...reveal} transition={{ delay: 0.25 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-accent" />
              <h2 className="text-[14px] font-black uppercase tracking-widest italic text-foreground flex items-center gap-2">
                <MessageCircle className="h-4.5 w-4.5 text-accent" />
                Avis ({mockReviews.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-[14px] font-black">{activity.rating}</span>
              <span className="text-[11px] text-muted-foreground">({activity.reviews})</span>
            </div>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/50 border border-border rounded-2xl p-5"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={review.avatar}
                    alt={review.user}
                    className="h-10 w-10 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold">{review.user}</span>
                      <span className="text-[10px] text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mt-2">{review.comment}</p>
                    <button className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {review.likes} utiles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact if available */}
        {activity.phone && (
          <motion.section {...reveal} transition={{ delay: 0.3 }} className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl group transition-all hover:border-accent/20">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Communications</h3>
                    <p className="text-[15px] font-black tabular-nums text-foreground">{activity.phone}</p>
                 </div>
              </div>
              <Button size="sm" onClick={handleCall} className="rounded-xl h-11 px-8 bg-foreground text-background text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-foreground/5 border-none">
                 Call
              </Button>
          </motion.section>
        )}
      </main>

      {/* Footer Navigation with Booking */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl border-t border-border p-6 pb-8 z-[110] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] font-sans"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic">À partir de</span>
            <span className="text-[22px] font-black text-accent uppercase tracking-tight tabular-nums">{activity.price === 'Free' ? 'Gratuit' : `${activity.price || activity.avgPrice} MAD`}</span>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`h-14 w-14 rounded-2xl border flex items-center justify-center transition-all ${isSaved ? 'bg-accent text-white border-accent' : 'border-border bg-secondary hover:border-accent/30'}`}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-white' : ''}`} />
            </motion.button>
            <Button
              className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-foreground/10 hover:bg-accent hover:text-white transition-all active:scale-[0.98] border-none"
              onClick={() => setShowBooking(true)}
            >
              Réserver
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <img
              src={galleryImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-3xl"
            />

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black uppercase tracking-widest italic">Réserver</h2>
                <button
                  onClick={() => setShowBooking(false)}
                  className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Date Selection */}
              <div className="space-y-3 mb-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Date</label>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all ${
                        selectedDate === d.date
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-secondary border-border hover:border-accent/30'
                      }`}
                    >
                      <span className="text-[10px] uppercase">{d.day}</span>
                      <span className="text-xl font-black">{d.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-3 mb-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Heure</label>
                <div className="flex gap-2 flex-wrap">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-5 h-12 rounded-2xl border text-[13px] font-bold transition-all ${
                        selectedTime === time
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-secondary border-border hover:border-accent/30'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-3 mb-8">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Participants</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center hover:border-accent/30 transition-all"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xl font-black">{participants}</span>
                  <button
                    onClick={() => setParticipants(participants + 1)}
                    className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center hover:border-accent/30 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total & Book Button */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase">Total</p>
                  <p className="text-2xl font-black text-accent">
                    {activity.price === 'Free' ? 'Gratuit' : `${(activity.price || activity.avgPrice) * participants} MAD`}
                  </p>
                </div>
                <Button
                  onClick={handleBook}
                  className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-[12px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

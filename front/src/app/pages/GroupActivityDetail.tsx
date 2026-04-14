import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Star, Clock, Heart, Share2, DollarSign, Calendar,
  Users, MessageCircle, CheckCircle2, X, UserPlus, UserCheck, Send,
  MoreVertical, Flag, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { groupActivities } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// Mock participants
const mockParticipants = [
  { id: 1, name: "Sarah M.", avatar: "https://i.pravatar.cc/150?img=1", status: "confirmed" },
  { id: 2, name: "Marco R.", avatar: "https://i.pravatar.cc/150?img=3", status: "confirmed" },
  { id: 3, name: "Yuki T.", avatar: "https://i.pravatar.cc/150?img=5", status: "pending" },
  { id: 4, name: "Alex B.", avatar: "https://i.pravatar.cc/150?img=8", status: "confirmed" },
];

// Mock chat messages
const mockChat = [
  { id: 1, user: "Sarah M.", avatar: "https://i.pravatar.cc/150?img=1", message: "Hâte de découvrir ce lieu avec vous !", time: "14:30" },
  { id: 2, user: "Marco R.", avatar: "https://i.pravatar.cc/150?img=3", message: "Pensez à prendre des chaussures confortables, c'est une longue marche.", time: "14:45" },
  { id: 3, user: "Organisateur", avatar: "https://i.pravatar.cc/150?img=47", message: "On se retrouve à l'entrée principale à 17h précises !", time: "15:00", isOrganizer: true },
];

export default function GroupActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState(mockChat);
  const [showParticipants, setShowParticipants] = useState(false);

  const activity = location.state?.activity || groupActivities.find((a) => a.id === Number(id));

  if (!activity) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans">
        <p className="text-[13px] font-black italic text-muted-foreground uppercase tracking-[0.2em]">
          Activité non trouvée
        </p>
      </div>
    );
  }

  const handleJoin = () => {
    if (hasJoined) {
      toast.info("Vous avez déjà rejoint cette activité");
      return;
    }
    if (activity.participants >= activity.maxParticipants) {
      toast.error("Cette activité est complète");
      return;
    }
    setHasJoined(true);
    toast.success("Vous avez rejoint l'activité !");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: activity.description,
          url: window.location.href,
        });
      } catch {
        toast.info("Partage annulé");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage = {
      id: Date.now(),
      user: "Vous",
      avatar: "https://i.pravatar.cc/150?img=12",
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setChatMessage("");
  };

  const handleReport = () => {
    toast.success("Signalement envoyé aux modérateurs");
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground pb-32 transition-colors duration-500 overflow-x-hidden">
      {/* Image Header */}
      <div className="relative h-[40vh] w-full overflow-hidden bg-card border-b border-border">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="size-full"
        >
          <ImageWithFallback
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-20">
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
              className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-xl border border-white/20 shadow-2xl transition-all ${isLiked ? 'text-rose-500' : 'text-white'}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-8 left-8 right-8">
          <motion.div {...reveal} className="space-y-3">
            <div className="flex gap-2">
              <span className="bg-accent/20 backdrop-blur-md text-accent text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-accent/20">
                {activity.city}
              </span>
              <span className="bg-foreground/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-white/20">
                {activity.level}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight text-white uppercase italic">
              {activity.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-8 space-y-8 max-w-2xl mx-auto w-full">
        {/* Organizer Card */}
        <motion.section {...reveal} className="bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activity.organizerImage}
                alt={activity.organizer}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-border"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Organisé par</p>
              <p className="text-lg font-black text-foreground">{activity.organizer}</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 text-[11px] font-bold">
              Profil
            </Button>
          </div>
        </motion.section>

        {/* Info Grid */}
        <motion.section {...reveal} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
          <div className="bg-card/50 border border-border p-5 rounded-[2rem] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-accent">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
              <p className="text-[15px] font-black">{activity.date}</p>
            </div>
          </div>
          <div className="bg-card/50 border border-border p-5 rounded-[2rem] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-accent">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Heure</p>
              <p className="text-[15px] font-black">{activity.time}</p>
            </div>
          </div>
          <div className="bg-card/50 border border-border p-5 rounded-[2rem] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-accent">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lieu</p>
              <p className="text-[15px] font-black truncate">{activity.meetingPoint}</p>
            </div>
          </div>
          <div className="bg-card/50 border border-border p-5 rounded-[2rem] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-accent">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Participants</p>
              <p className="text-[15px] font-black">{activity.participants}/{activity.maxParticipants}</p>
            </div>
          </div>
        </motion.section>

        {/* Participants Preview */}
        <motion.section {...reveal} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-black uppercase tracking-widest italic flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              Participants
            </h2>
            <button
              onClick={() => setShowParticipants(true)}
              className="text-[11px] font-bold text-accent hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {mockParticipants.slice(0, 4).map((p, i) => (
                <img
                  key={p.id}
                  src={p.avatar}
                  alt={p.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-background"
                  style={{ zIndex: 4 - i }}
                />
              ))}
            </div>
            <span className="text-[13px] text-muted-foreground font-medium">
              +{activity.participants} inscrits
            </span>
          </div>
        </motion.section>

        {/* Description */}
        <motion.section {...reveal} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <h2 className="text-[14px] font-black uppercase tracking-widest italic text-foreground">
              Description
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-muted-foreground font-medium pl-6 border-l-2 border-border">
            {activity.description}
          </p>
        </motion.section>

        {/* Chat Preview */}
        <motion.section {...reveal} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-black uppercase tracking-widest italic flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent" />
              Discussion
            </h2>
            <span className="text-[11px] text-muted-foreground">{messages.length} messages</span>
          </div>
          <div className="space-y-4 mb-4">
            {messages.slice(-2).map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.user === "Vous" ? "flex-row-reverse" : ""}`}>
                <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-xl object-cover" />
                <div className={`flex-1 ${msg.user === "Vous" ? "text-right" : ""}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl text-[13px] ${
                    msg.isOrganizer
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : msg.user === "Vous"
                        ? "bg-foreground text-background"
                        : "bg-secondary"
                  }`}>
                    {msg.isOrganizer && (
                      <span className="text-[10px] font-black uppercase tracking-wider block mb-1 opacity-70">
                        Organisateur
                      </span>
                    )}
                    {msg.message}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl text-[12px] font-bold uppercase tracking-widest"
            onClick={() => setShowChat(true)}
          >
            Ouvrir la discussion
          </Button>
        </motion.section>

        {/* Report Button */}
        <motion.button
          {...reveal}
          transition={{ delay: 0.3 }}
          onClick={handleReport}
          className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <Flag className="h-4 w-4" />
          Signaler cette activité
        </motion.button>
      </main>

      <BottomNav />

      {/* Footer CTA */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-[80px] left-0 right-0 bg-background/80 backdrop-blur-3xl border-t border-border p-6 z-[100]"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Places disponibles
            </span>
            <span className={`text-2xl font-black ${activity.participants >= activity.maxParticipants ? 'text-red-500' : 'text-accent'}`}>
              {activity.maxParticipants - activity.participants} / {activity.maxParticipants}
            </span>
          </div>
          <Button
            onClick={handleJoin}
            disabled={hasJoined || activity.participants >= activity.maxParticipants}
            className={`h-14 px-8 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl transition-all ${
              hasJoined
                ? "bg-green-500 text-white"
                : activity.participants >= activity.maxParticipants
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-foreground text-background hover:bg-accent hover:text-white"
            }`}
          >
            {hasJoined ? (
              <>
                <UserCheck className="h-5 w-5 mr-2" />
                Inscrit
              </>
            ) : activity.participants >= activity.maxParticipants ? (
              "Complet"
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Rejoindre
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Full Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background"
          >
            {/* Chat Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-2xl border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowChat(false)}
                    className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider italic">Discussion</h2>
                    <p className="text-[11px] text-muted-foreground">{activity.participants} participants</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.user === "Vous" ? "flex-row-reverse" : ""}`}>
                  <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-xl object-cover" />
                  <div className={`max-w-[70%] ${msg.user === "Vous" ? "text-right" : ""}`}>
                    <div className={`inline-block px-5 py-3 rounded-2xl text-[14px] ${
                      msg.isOrganizer
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : msg.user === "Vous"
                          ? "bg-foreground text-background"
                          : "bg-secondary text-foreground"
                    }`}>
                      {msg.isOrganizer && (
                        <span className="text-[10px] font-black uppercase tracking-wider block mb-1 opacity-70">
                          Organisateur
                        </span>
                      )}
                      {msg.message}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">{msg.user} • {msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-2xl border-t border-border p-6">
              <div className="max-w-xl mx-auto flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Votre message..."
                  className="flex-1 h-14 px-6 rounded-2xl bg-secondary border border-border text-[14px] focus:outline-none focus:border-accent/30"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Modal */}
      <AnimatePresence>
        {showParticipants && (
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
              className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black uppercase tracking-widest italic">Participants</h2>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {mockParticipants.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border">
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground uppercase">{p.status}</p>
                    </div>
                    {p.status === "confirmed" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

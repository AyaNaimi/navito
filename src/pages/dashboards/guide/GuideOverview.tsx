import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { 
  Star, 
  Navigation, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Wallet, 
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Switch } from "../../../app/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { toast } from "sonner";
import { useAppContext } from "../../../app/context/AppContext";

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const GUIDE_POSITION: [number, number] = [31.6295, -7.9811]; // Marrakech

const pieData = [
  { name: 'City Tour', value: 60, fill: "#00897B" },
  { name: 'Hiking', value: 30, fill: "#4db6ac" },
  { name: 'Desert', value: 10, fill: "#80cbc4" }
];

export default function GuideOverview({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const { userName } = useAppContext();
  const [isOnline, setIsOnline] = useState(true);
  const [incomingTour, setIncomingTour] = useState<any>(null);
  const [acceptedTour, setAcceptedTour] = useState<any>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOnline && !acceptedTour) {
      timeout = setTimeout(() => {
        setIncomingTour({
          price: "450",
          currency: "MAD",
          timeRemaining: 15,
          duration: "4 heures",
          groupSize: "4 personnes",
          meetup: "Place Jemaa el-Fna",
          destination: "Palais Bahia & Médina",
        });
      }, 5000);
    } else {
      setIncomingTour(null);
    }
    return () => clearTimeout(timeout);
  }, [isOnline, acceptedTour]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (incomingTour && incomingTour.timeRemaining > 0) {
      interval = setInterval(() => {
        setIncomingTour((prev: any) => prev ? { ...prev, timeRemaining: prev.timeRemaining - 1 } : null);
      }, 1000);
    } else if (incomingTour && incomingTour.timeRemaining === 0) {
      setIncomingTour(null);
    }
    return () => clearInterval(interval);
  }, [incomingTour?.timeRemaining]);

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in duration-700">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <motion.h2 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-3xl font-black text-slate-900 tracking-tight"
           >
             Content de vous revoir, <span className="text-[#00897B]">{userName.split(' ')[0]}</span> !
           </motion.h2>
           <p className="text-slate-400 font-bold text-sm mt-1">Voici ce qui se passe aujourd'hui dans votre zone.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col items-end pr-2">
             <span className={cn(
               "text-[10px] font-black uppercase tracking-widest transition-colors",
               isOnline ? "text-[#00897B]" : "text-slate-400"
             )}>
               {isOnline ? "Mode En Ligne" : "Mode Hors Ligne"}
             </span>
             <span className="text-[9px] font-bold text-slate-400">Prêt pour des visites</span>
          </div>
          <Switch 
            checked={isOnline} 
            onCheckedChange={(val) => {
              setIsOnline(val);
              if (!val) { setIncomingTour(null); setAcceptedTour(null); }
            }} 
            className="data-[state=checked]:bg-[#00897B] scale-110" 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!acceptedTour && !incomingTour ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
             <div className="lg:col-span-2 space-y-8">
                {/* Hot Market Card */}
                <div className={cn("relative overflow-hidden rounded-[40px] p-10 transition-all duration-500", 
                  isOnline 
                    ? "bg-slate-900 border-0 shadow-2xl shadow-[#00897B]/10" 
                    : "bg-slate-50 border border-slate-100 grayscale"
                )}>
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-4 max-w-md">
                         <div className="flex items-center gap-2 text-[#00897B] text-[10px] font-black uppercase tracking-[0.2em] bg-[#00897B]/10 w-fit px-3 py-1.5 rounded-full">
                           <Zap className="size-3 fill-[#00897B]" /> Demande en hausse
                         </div>
                         <h3 className="text-3xl font-black text-white leading-tight">Marrakech Médina : Pic de fréquentation attendu</h3>
                         <p className="text-slate-400 text-sm font-medium leading-relaxed">Le Palais Bahia et les Tombeaux Saadiens voient une augmentation de 40% des demandes ce matin.</p>
                         <button onClick={() => onNavigate?.('tours')} className="group flex items-center gap-2 bg-[#00897B] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00796B] transition-all active:scale-95 shadow-xl shadow-[#00897B]/20">
                            Rejoindre la zone <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                      <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-xl">
                         <span className="text-4xl font-black text-[#00897B]">x1.5</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Bonus actif</span>
                      </div>
                   </div>
                   {/* Abstract background elements */}
                   <div className="absolute top-0 right-0 size-80 bg-[#00897B]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                   <div className="absolute bottom-0 left-0 size-60 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Map & Location Tracking */}
                <Card className="rounded-[40px] border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
                   <div className="h-[350px] w-full relative">
                      <MapContainer center={GUIDE_POSITION} zoom={14} className="h-full w-full" zoomControl={false} scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={GUIDE_POSITION} />
                        <MapController center={GUIDE_POSITION} />
                      </MapContainer>
                      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-white/50 shadow-2xl flex items-center gap-4">
                         <div className="size-12 rounded-2xl bg-[#00897B]/10 flex items-center justify-center">
                            <Navigation className={cn("size-6 text-[#00897B]", isOnline && "animate-pulse")} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position Actuelle</p>
                            <p className="text-sm font-black text-slate-900">Médina, Marrakech</p>
                         </div>
                      </div>
                      <div className="absolute bottom-6 right-6 z-10">
                         <button className="bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-2xl transition-all">
                            Voir les zones chaudes
                         </button>
                      </div>
                   </div>
                   <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-50">
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">3.2 km</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aujourd'hui</span>
                         </div>
                         <div className="w-px h-8 bg-slate-100" />
                         <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">12</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Points d'intérêt</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="size-5 text-emerald-500" />
                         <span className="text-xs font-bold text-slate-500">Zone de guidage sécurisée par Navito</span>
                      </div>
                   </CardContent>
                </Card>
             </div>

             <div className="space-y-8">
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 gap-4">
                   {[
                     { label: "Revenus", value: "11,250", sub: "MAD", icon: Wallet, trend: "+12%", color: "#00897B" },
                     { label: "Visites", value: "48", sub: "Groupes", icon: Compass, trend: "+5", color: "#4db6ac" },
                     { label: "Note Guide", value: "4.95", sub: "Global", icon: Star, trend: "Top 3%", color: "#80cbc4" },
                   ].map((stat, i) => (
                     <motion.div
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       key={stat.label}
                     >
                       <Card className="border-0 bg-white rounded-[32px] shadow-sm p-6 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
                         <div className="flex items-center justify-between mb-4">
                            <div className="size-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 shadow-sm">
                               <stat.icon className="size-6" style={{ color: stat.color }} strokeWidth={2.25} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                               <ArrowUpRight className="size-3" /> {stat.trend}
                            </span>
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                               {stat.value} <span className="text-sm font-bold opacity-30">{stat.sub}</span>
                            </h4>
                         </div>
                       </Card>
                     </motion.div>
                   ))}
                </div>

                {/* Pie Chart Widget */}
                <Card className="rounded-[40px] border-0 bg-white shadow-xl shadow-slate-200/50">
                   <CardHeader className="pb-2 pt-8 px-8 flex flex-row items-center justify-between border-b border-slate-50/50 mb-4">
                     <CardTitle className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                        <TrendingUp className="size-4 text-[#00897B]" /> Activité par Type
                     </CardTitle>
                     <button 
                       onClick={() => toast.info("Détails de l'activité", { description: "Analyse détaillée des types de visites." })}
                       className="text-[10px] font-black text-[#00897B] hover:opacity-70"
                     >
                        Détails
                     </button>
                   </CardHeader>
                   <CardContent className="pb-8 pt-4 flex flex-col items-center gap-8 px-8">
                      <div className="h-48 w-48 relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="none" paddingAngle={8} minAngle={15}>
                                {pieData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all hover:scale-105 outline-none" /> ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} 
                                itemStyle={{ color: '#0f172a' }} 
                              />
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-900 leading-none">48</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Total</span>
                         </div>
                      </div>
                      <div className="w-full space-y-4">
                         {pieData.map((item) => (
                           <div key={item.name} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                             <div className="flex items-center gap-3">
                               <div className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                               <span className="text-[11px] font-black text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{item.name}</span>
                             </div>
                             <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-xl">{item.value}%</span>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             </div>
          </motion.div>
        ) : incomingTour ? (
          <motion.div 
            key="incoming"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl"
          >
             <div className="max-w-xl w-full bg-white rounded-[50px] shadow-[0_40px_100px_-20px_rgba(0,137,123,0.4)] overflow-hidden border border-white/20">
                <div className="p-10 pb-0 flex items-center justify-between bg-slate-900 relative">
                   <div className="absolute top-0 right-0 size-48 bg-[#00897B]/20 rounded-full blur-[80px]" />
                   <div className="space-y-2 relative z-10 text-white">
                      <div className="bg-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] w-fit px-3 py-1 rounded-lg">Nouvelle demande</div>
                      <h3 className="text-4xl font-black tracking-tight">Groupe en attente !</h3>
                   </div>
                   <div className="flex items-center justify-center size-20 rounded-full bg-slate-800 border-[4px] border-slate-700 shadow-2xl relative shrink-0 z-10 text-white group">
                      <svg className="absolute inset-0 size-full -rotate-90">
                        <circle cx="40" cy="40" r="36" className="fill-none stroke-slate-700 stroke-[5px]" />
                        <motion.circle 
                          cx="40" cy="40" r="36"  
                          className="fill-none stroke-[#00897B] stroke-[5px]" 
                          strokeDasharray={226}
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: 226 }}
                          transition={{ duration: 15, ease: "linear" }}
                        />
                      </svg>
                      <span className="text-2xl font-black z-10">{incomingTour.timeRemaining}</span>
                   </div>
                </div>

                <div className="p-10 space-y-10">
                   <div className="flex items-center justify-between p-8 bg-slate-50 border border-slate-100 rounded-[32px]">
                      <div className="space-y-1">
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gain estimé</span>
                         <p className="text-4xl font-black text-[#00897B]">{incomingTour.price} <span className="text-sm font-bold opacity-60">{incomingTour.currency}</span></p>
                      </div>
                      <div className="text-right space-y-1">
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type & Taille</span>
                         <p className="text-lg font-black text-slate-900">{incomingTour.groupSize}</p>
                         <p className="text-xs font-bold text-slate-500 uppercase">{incomingTour.duration}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                         <div className="size-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#00897B]">
                            <MapPin className="size-6" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Point de RDV</p>
                            <p className="text-lg font-black text-slate-900">{incomingTour.meetup}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                         <div className="size-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#00897B]">
                            <Compass className="size-6" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                            <p className="text-lg font-black text-slate-900">{incomingTour.destination}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 pt-4">
                      <button onClick={() => setIncomingTour(null)} className="flex-1 py-6 rounded-[24px] bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95">Passer</button>
                      <button onClick={() => { setAcceptedTour(incomingTour); setIncomingTour(null); }} className="flex-[2] py-6 rounded-[24px] bg-[#00897B] text-white font-black text-xs uppercase tracking-widest hover:bg-[#00796B] shadow-2xl shadow-[#00897B]/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                         <Zap className="size-5 fill-white" /> Accepter maintenant
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="accepted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-4xl mx-auto space-y-8"
          >
             <Card className="rounded-[50px] bg-slate-900 text-white border-0 shadow-2xl overflow-hidden relative">
                <div className="p-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
                         <span className="size-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                         <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Visite en direct</span>
                      </div>
                      
                      <div className="space-y-2">
                         <h3 className="text-5xl font-black tracking-tight">{acceptedTour.destination}</h3>
                         <div className="flex items-center gap-3 text-slate-400">
                            <MapPin className="size-5" />
                            <span className="text-lg font-medium">{acceptedTour.meetup}</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-8 pt-4">
                         <div className="flex flex-col">
                            <span className="text-3xl font-black text-[#00897B]">{acceptedTour.price} MAD</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recettes finales</span>
                         </div>
                         <div className="w-px h-10 bg-white/10" />
                         <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                               <Clock className="size-5 text-emerald-500" />
                               <span className="text-3xl font-black">2h 15m</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Temps restant</span>
                         </div>
                      </div>

                      <div className="pt-6 flex gap-4">
                         <button 
                           onClick={() => toast.info("Informations supplémentaires", { description: "Affichage des détails complets de la visite en cours." })}
                           className="flex-1 py-4 px-6 rounded-2xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                         >
                            <Calendar className="size-4" /> Détails complets
                         </button>
                         <button 
                           onClick={() => setAcceptedTour(null)}
                           className="flex-1 py-4 px-6 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                         >
                            Annuler visite
                         </button>
                      </div>
                   </div>

                   <div className="relative group overflow-hidden rounded-[40px] border border-white/10 shadow-2xl h-[400px]">
                      <MapContainer center={GUIDE_POSITION} zoom={15} className="size-full" zoomControl={false} scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapController center={GUIDE_POSITION} />
                      </MapContainer>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none opacity-40" />
                      <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Emma" className="size-14 rounded-2xl bg-white shadow-2xl border border-white/20" alt="Client" />
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organisateur</p>
                               <p className="text-xl font-black">Emma Thompson</p>
                            </div>
                         </div>
                         <button className="size-14 rounded-2xl bg-[#00897B] text-white flex items-center justify-center hover:bg-[#00796B] transition-transform active:scale-95 shadow-xl shadow-[#00897B]/20">
                            <Navigation className="size-6" />
                         </button>
                      </div>
                   </div>
                </div>
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 size-96 bg-[#00897B]/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-0 size-64 bg-emerald-500/5 rounded-full blur-[100px]" />
             </Card>
             
             <button 
               className="w-full py-6 rounded-[32px] bg-white border border-slate-100 text-slate-400 font-black text-xs uppercase tracking-[0.3em] hover:text-[#00897B] hover:border-[#00897B]/30 hover:bg-[#00897B]/5 transition-all"
               onClick={() => setAcceptedTour(null)}
             >
                Finaliser et Clôturer la Visite
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

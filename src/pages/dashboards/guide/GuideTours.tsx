import { useState } from "react";
import { 
  Search, 
  MapPin, 
  MoreHorizontal, 
  ChevronDown, 
  CalendarDays, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Check, 
  X, 
  Navigation, 
  Trash2, 
  Edit,
  Users,
  Eye,
  ArrowRight,
  Info,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../../app/context/AppContext";

const assignedTours = [
  { id: 1, title: "Marrakech City Walk", location: "Marrakech, Maroc", date: "Oct 12, 2024", duration: "4 heures", status: "Upcoming", image: "/tours/marrakech.png", party: 4, client: "Sarah Jenkins" },
  { id: 2, title: "Atlas Mountains Hike", location: "Atlas, Maroc", date: "Oct 15, 2024", duration: "8 heures", status: "Confirmed", image: "/tours/atlas.png", party: 12, client: "Michael Chen" },
  { id: 3, title: "Sahara Desert Tour", location: "Merzouga, Maroc", date: "Oct 20, 2024", duration: "3 jours", status: "Pending", image: "/tours/sahara.png", party: 8, client: "Emma Thompson" },
  { id: 4, title: "Paris Historical Tour", location: "Paris, France", date: "Oct 25, 2024", duration: "5 heures", status: "Upcoming", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600", party: 2, client: "Liam Smith" },
  { id: 5, title: "Rome Colosseum Tour", location: "Rome, Italie", date: "Oct 28, 2024", duration: "3 heures", status: "Confirmed", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600", party: 6, client: "Giulia M." },
  { id: 6, title: "Dubai Desert Safari", location: "Dubai, EAU", date: "Nov 2, 2024", duration: "6 heures", status: "Pending", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&q=80&w=600", party: 10, client: "Ahmed K." },
];

const assignedTravelers = [
  { id: 1, name: "Sarah Jenkins", tour: "Marrakech City Walk", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=e2e8f0" },
  { id: 2, name: "Michael Chen", tour: "Atlas Mountains Hike", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=e2e8f0" },
  { id: 3, name: "Emma Thompson", tour: "Sahara Desert Tour", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emma&backgroundColor=e2e8f0" },
  { id: 4, name: "David L.", tour: "Marrakech City Walk", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=e2e8f0" },
];

type TourStatus = "All" | "Pending" | "Upcoming" | "Confirmed" | "In Progress" | "Canceled";

export default function GuideTours({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<TourStatus>("All");
  const [tours, setTours] = useState(assignedTours);
  
  const filteredTours = tours.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === "All" || t.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTourAction = (id: number, action: "confirm" | "cancel" | "start" | "delete" | "edit-note") => {
    if (action === "delete") {
      setTours(prev => prev.filter(t => t.id !== id));
      toast.success("Visite supprimée avec succès");
      return;
    }

    setTours(prev => prev.map(t => {
      if (t.id === id) {
        if (action === "confirm") {
          toast.success("Visite confirmée !");
          return { ...t, status: "Confirmed" };
        }
        if (action === "cancel") {
          toast.error("Visite annulée");
          return { ...t, status: "Canceled" };
        }
        if (action === "start") {
          toast.success("Visite démarrée !");
          return { ...t, status: "In Progress" };
        }
      }
      return t;
    }));
  };

  const statusOptions: TourStatus[] = ["All", "Pending", "Upcoming", "Confirmed", "Canceled"];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-in fade-in duration-700">
        
       {/* Featured / Next Tour Card */}
       <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00897B] to-[#4db6ac] rounded-[40px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[300px]">
             <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img 
                  src="/tours/marrakech.png" 
                  className="size-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="Marrakech"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                   <span className="bg-[#00897B] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg mb-3 inline-block">Prochaine Étape</span>
                   <h3 className="text-2xl font-black tracking-tight">Médina & Souks Marrakech</h3>
                </div>
             </div>
             <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center gap-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Heure</p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><CalendarDays className="size-4 text-[#00897B]" /> Demain, 09:00</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Groupe</p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users className="size-4 text-[#00897B]" /> 6 Personnes</p>
                   </div>
                   <div className="space-y-1 hidden md:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durée</p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><Clock className="size-4 text-[#00897B]" /> 5 Heures</p>
                   </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Liam" className="size-10 rounded-xl bg-slate-50 border border-slate-100" />
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact Client</p>
                         <p className="text-sm font-black text-slate-900">Liam O'Connor</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => onNavigate?.('messages')}
                     className="bg-[#00897B] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00796B] shadow-xl shadow-[#00897B]/20 transition-all active:scale-95 flex items-center gap-2"
                   >
                      Préparer <ArrowRight className="size-4" />
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Filters Section */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
             {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    "px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                    activeStatus === status 
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 scale-105" 
                      : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900"
                  )}
                >
                  {status === "All" ? "Toutes les visites" : 
                   status === "Pending" ? "En Attente" :
                   status === "Upcoming" ? "À Venir" :
                   status === "Confirmed" ? "Confirmées" : "Annulées"}
                </button>
             ))}
          </div>
          <div className="relative group min-w-[300px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#00897B] transition-colors" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Rechercher par titre ou lieu..."
               className="h-12 w-full rounded-2xl bg-white border border-slate-100 pl-11 pr-4 text-sm font-bold outline-none transition-all shadow-sm focus:ring-4 focus:ring-[#00897B]/5 focus:border-[#00897B]/30"
             />
          </div>
       </div>

       <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Main Tours List */}
          <div className="lg:col-span-2 space-y-6">
             <AnimatePresence mode="popLayout">
                {filteredTours.map((tour) => (
                   <motion.div
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     key={tour.id}
                     className="group bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300"
                   >
                      <div className="flex flex-col sm:flex-row gap-6">
                         <div className="relative w-full sm:w-48 h-40 shrink-0 overflow-hidden rounded-3xl">
                            <img src={tour.image} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" alt={tour.title} />
                            <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg shadow-sm">
                               <span className="text-[10px] font-black text-slate-900 flex items-center gap-1.5"><Users className="size-3 text-[#00897B]" /> {tour.party} p.</span>
                            </div>
                         </div>
                         <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                               <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#00897B] transition-colors">{tour.title}</h3>
                                  <div className="flex items-center gap-2">
                                     <span className={cn(
                                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                       tour.status === 'Upcoming' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                       tour.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                       tour.status === 'Canceled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                       'bg-amber-50 text-amber-600 border-amber-100'
                                     )}>
                                        {tour.status === 'Upcoming' ? 'À Venir' : tour.status === 'Confirmed' ? 'Confirmé' : tour.status === 'Canceled' ? 'Annulé' : 'Attente'}
                                     </span>
                                     <div className="relative group/menu">
                                        <button className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                           <MoreHorizontal className="size-5 text-slate-400" />
                                        </button>
                                        <div className="absolute right-0 top-full w-48 bg-white rounded-2xl shadow-2xl border border-slate-50 py-2 z-[50] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all translate-y-0 group-hover/menu:translate-y-0 before:content-[''] before:absolute before:top-[-10px] before:right-0 before:w-full before:h-[10px]">
                                           <button onClick={() => { handleTourAction(tour.id, 'delete'); }} className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2">
                                              <Trash2 className="size-4" /> Supprimer
                                           </button>
                                           <button onClick={() => toast.info("Modification de note", { description: "L'éditeur de note sera disponible bientôt." })} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                              <Edit className="size-4" /> Modifier note
                                           </button>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex flex-wrap gap-y-2 gap-x-5 mt-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                     <MapPin className="size-3.5 text-slate-300" /> {tour.location}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                     <CalendarDays className="size-3.5 text-slate-300" /> {tour.date}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                     <Clock className="size-3.5 text-slate-300" /> {tour.duration}
                                  </div>
                               </div>
                            </div>
                            
                            <div className="mt-6 flex items-center justify-between">
                               <div className="flex items-center gap-2.5">
                                  <div className="size-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                     <Users className="size-4 text-slate-400" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-600 leading-none">{tour.client}</span>
                               </div>
                               <div className="flex items-center gap-3">
                                  {tour.status === 'Pending' ? (
                                     <>
                                        <button onClick={() => handleTourAction(tour.id, 'cancel')} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95">
                                           <X className="size-5" />
                                        </button>
                                        <button onClick={() => handleTourAction(tour.id, 'confirm')} className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">
                                           Confirmer
                                        </button>
                                     </>
                                  ) : tour.status === 'Confirmed' ? (
                                     <>
                                        <button 
                                          onClick={() => toast.info("Détails", { description: "Affichage des détails..." })}
                                          className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95"
                                        >
                                           <Info className="size-5" />
                                        </button>
                                        <button 
                                          onClick={() => handleTourAction(tour.id, 'start')}
                                          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                           <Zap className="size-4 text-[#00897B]" /> Démarrer
                                        </button>
                                     </>
                                  ) : (
                                  <button 
                                     onClick={() => toast.info("Détails de la visite", { description: `Affichage des informations pour ${tour.title}` })}
                                     className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                  >
                                        <Eye className="size-4" /> Détails
                                     </button>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                ))}
                {filteredTours.length === 0 && (
                   <motion.div 
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                     className="bg-white rounded-[40px] p-20 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4"
                   >
                      <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center">
                         <Search className="size-8 text-slate-200" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-lg font-black text-slate-900">Aucune visite trouvée</p>
                         <p className="text-sm font-bold text-slate-400">Essayez de modifier vos filtres ou votre recherche.</p>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
             <Card className="rounded-[40px] border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="p-8 pb-6 border-b border-slate-50">
                   <CardTitle className="text-lg font-black flex items-center gap-3">
                      <Users className="size-5 text-[#00897B]" /> Clients Récents
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-slate-50">
                      {assignedTravelers.map((traveler) => (
                         <div key={traveler.id} className="p-6 transition-colors hover:bg-slate-50/50 group flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="relative">
                                  <img src={traveler.avatar} className="size-11 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm" alt={traveler.name} />
                                  <div className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 group-hover:text-[#00897B] transition-colors">{traveler.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest truncate max-w-[120px]">{traveler.tour}</p>
                               </div>
                            </div>
                            <button className="p-2 rounded-xl text-slate-300 hover:text-[#00897B] hover:bg-[#00897B]/5 transition-all active:scale-90">
                               <ArrowRight className="size-4" />
                            </button>
                         </div>
                      ))}
                   </div>
                   <div className="p-8 border-t border-slate-50">
                      <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors">Voir l'historique complet</button>
                   </div>
                </CardContent>
             </Card>

             <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-6">
                   <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Compass className="size-6 text-[#4db6ac]" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black tracking-tight leading-tight">Centre de Statistiques Guide</h4>
                      <p className="text-white/60 text-xs font-semibold leading-relaxed">Boostez vos gains en analysant vos zones les plus fréquentées.</p>
                   </div>
                   <button onClick={() => onNavigate?.('dashboard')} className="w-full py-4 rounded-2xl bg-[#00897B] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00796B] transition-all shadow-xl shadow-[#00897B]/20">Accéder au bilan</button>
                </div>
                <div className="absolute -right-10 -bottom-10 size-48 bg-[#00897B]/20 rounded-full blur-3xl opacity-50" />
             </div>
          </div>
       </div>
    </div>
  );
}

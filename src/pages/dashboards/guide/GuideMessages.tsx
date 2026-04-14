import { useState } from "react";
import { 
  Send, 
  MoreVertical, 
  Search, 
  CheckCheck, 
  Trash2, 
  Edit, 
  User, 
  ShieldAlert,
  Info,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Compass,
  Zap
} from "lucide-react";
import { cn } from "../../../app/components/ui/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const mockChats = [
  { 
    id: "1", 
    name: "Emma Thompson", 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emma", 
    route: "Visite: Médina Historique", 
    unread: 0, 
    status: "Online",
    lastMsg: "Oui, nous sommes juste devant !",
    time: "10:18",
    phone: "+44 7700 900077",
    email: "emma.t@gmail.com",
    location: "Londres, UK"
  },
  { 
    id: "2", 
    name: "Lucas Muller", 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Lucas", 
    route: "Visite: Souks & Artisanat", 
    unread: 2, 
    status: "Offline",
    lastMsg: "Merci pour les précisions.",
    time: "Hier",
    phone: "+49 170 1234567",
    email: "l.muller@web.de",
    location: "Berlin, DE"
  },
];

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  type: string;
  details?: {
    points: string[];
    duration: string;
  };
}

export default function GuideMessages({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const [chats, setChats] = useState(mockChats);
  const [activeChatId, setActiveChatId] = useState("1");
  const [chatMessage, setChatMessage] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  
  const [messages, setMessages] = useState<Message[]>([
     { id: "1", senderId: "customer", text: "Bonjour Youssef, où nous retrouvons-nous exactement ?", time: "10:15", type: "text" },
     { id: "2", senderId: "guide", text: "Bonjour Emma ! Avez-vous trouvé le grand café sur la place Jemaa el-Fna ?", time: "10:16", type: "text" },
     { id: "3", senderId: "customer", text: "Oui, nous sommes juste devant !", time: "10:18", type: "text" },
  ]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMsg = { id: Date.now().toString(), senderId: "guide", text: chatMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: "text" };
    setMessages(prev => [...prev, newMsg]);
    setChatMessage("");

    setTimeout(() => {
       setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), senderId: "customer", text: "D'accord, à tout de suite !", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: "text" }]);
    }, 2000);
  };

  const handleSendItinerary = () => {
    const itineraryMsg = { 
      id: Date.now().toString(), 
      senderId: "guide", 
      text: "Voici l'itinéraire optimisé pour notre visite d'aujourd'hui.", 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: "itinerary",
      details: {
        points: ["Place Jemaa el-Fna", "Palais de la Bahia", "Quartier Juif", "Souks Centraux"],
        duration: "4h"
      }
    };
    setMessages(prev => [...prev, itineraryMsg]);
    toast.success("Itinéraire envoyé", { description: "Le client a reçu le plan de route interactif." });
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
       
       {/* Sidebar: Chat List */}
       <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-8 border-b border-slate-100 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
                <div className="size-8 rounded-xl bg-[#00897B]/10 text-[#00897B] flex items-center justify-center font-black text-xs">
                   {chats.reduce((acc, c) => acc + c.unread, 0)}
                </div>
             </div>
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#00897B] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Rechercher un client..." 
                  className="w-full h-12 bg-white rounded-2xl pl-11 pr-4 text-sm font-bold border-none shadow-sm focus:ring-4 ring-[#00897B]/5 outline-none transition-all placeholder:text-slate-400" 
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-4 space-y-1">
             {chats.map(chat => (
                <div 
                   key={chat.id} 
                   onClick={() => handleChatSelect(chat.id)}
                   className={cn(
                     "relative px-4 transition-all duration-300",
                     activeChatId === chat.id ? "py-3" : "py-1"
                   )}
                >
                   <div className={cn(
                      "flex items-center gap-4 p-4 rounded-[24px] cursor-pointer transition-all",
                      activeChatId === chat.id 
                        ? "bg-white shadow-xl shadow-slate-200/50 border border-slate-100 scale-[1.02] z-10" 
                        : "hover:bg-white/60"
                   )}>
                      <div className="relative shrink-0">
                         <img src={chat.avatar} className="size-14 rounded-2xl bg-slate-100 border border-slate-100" alt="Avatar" />
                         <div className={cn(
                            "absolute -bottom-1 -right-1 size-3.5 border-2 border-white rounded-full",
                            chat.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'
                         )} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                         <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-sm font-black text-slate-900 truncate">{chat.name}</h4>
                            <span className="text-[9px] font-black text-slate-400 uppercase">{chat.time}</span>
                         </div>
                         <p className={cn(
                            "text-[11px] font-bold truncate",
                            chat.unread > 0 ? "text-slate-900" : "text-slate-500"
                         )}>{chat.lastMsg}</p>
                         {chat.unread > 0 && (
                            <div className="mt-1.5 h-1 w-8 bg-[#00897B] rounded-full" />
                         )}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Main Chat Window */}
       <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Top Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20">
             <div className="flex items-center gap-5">
                <div className="relative md:hidden">
                   <img src={activeChat.avatar} className="size-12 rounded-2xl" alt="Avatar" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeChat.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                         "size-2 rounded-full",
                         activeChat.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'
                      )} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeChat.status}</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={cn(
                    "size-12 rounded-2xl flex items-center justify-center transition-all border",
                    showDetails ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                  )}
                >
                   <Info className="size-5" />
                </button>
                <div className="relative group/menu">
                   <button className="size-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
                      <MoreVertical className="size-5" />
                   </button>
                   <div className="absolute right-0 top-full mt-2 w-56 rounded-[24px] bg-white border border-slate-50 shadow-2xl py-2 z-30 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all translate-y-2 group-hover/menu:translate-y-0 overflow-hidden">
                      <button onClick={() => toast.info("Profil client", { description: "Ouverture du profil..." })} className="w-full text-left px-5 py-3 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-3 transition-colors">
                         <User className="size-4 text-slate-400" /> Profil du client
                      </button>
                      <button className="w-full text-left px-5 py-3 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-3 transition-colors">
                         <Edit className="size-4 text-slate-400" /> Modifier la note
                      </button>
                      <button className="w-full text-left px-5 py-3 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-3 transition-colors">
                         <ShieldAlert className="size-4 text-slate-400" /> Signaler
                      </button>
                      <div className="h-px bg-slate-50 my-1" />
                      <button className="w-full text-left px-5 py-3 hover:bg-rose-50 text-xs font-bold text-rose-500 flex items-center gap-3 transition-colors">
                         <Trash2 className="size-4" /> Supprimer chat
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
             <AnimatePresence mode="popLayout">
                {messages.map((msg) => {
                  const isMe = msg.senderId === "guide";
                  return (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        key={msg.id} 
                        className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
                     >
                        {msg.type === "itinerary" ? (
                           <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl space-y-4 border border-white/10">
                              <div className="flex items-center gap-3">
                                 <div className="size-10 rounded-xl bg-[#00897B] flex items-center justify-center">
                                    <Compass className="size-5" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00897B]">Itinéraire Proposé</p>
                                    <p className="text-sm font-black italic">"{msg.text}"</p>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 {msg.details?.points.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                       <Zap className="size-3 text-[#00897B]" /> {p}
                                    </div>
                                 ))}
                              </div>
                              <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00897B] hover:text-white transition-all">Consulter la carte live</button>
                           </div>
                        ) : (
                           <div className={cn(
                              "p-5 rounded-[28px] text-sm font-bold shadow-sm leading-relaxed",
                              isMe 
                                ? "bg-gradient-to-br from-[#00897B] to-[#00796B] text-white rounded-br-none shadow-[#00897B]/10" 
                                : "bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow_slate-200/50"
                           )}>
                              {msg.text}
                           </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           {msg.time} {isMe && <CheckCheck className="size-3 text-[#00897B]" />}
                        </div>
                     </motion.div>
                  );
                })}
             </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
             <div className="flex items-center gap-4 bg-slate-50 p-2 pl-6 rounded-[28px] border border-slate-100 border-transparent focus-within:bg-white focus-within:border-[#00897B]/20 focus-within:ring-4 ring-[#00897B]/5 transition-all">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Écrire un message à ${activeChat.name.split(' ')[0]}...`}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSendMessage}
                  className="size-14 rounded-[22px] bg-[#00897B] hover:bg-[#00796B] text-white flex items-center justify-center shadow-xl shadow-[#00897B]/20 transition-all active:scale-90"
                >
                   <Send className="size-6 -mt-0.5 -ml-0.5" />
                </button>
             </div>
          </div>
       </div>

       {/* Right Sidebar: Details */}
       <AnimatePresence>
          {showDetails && (
             <motion.div 
               initial={{ x: 320 }}
               animate={{ x: 0 }}
               exit={{ x: 320 }}
               className="w-80 border-l border-slate-100 flex flex-col bg-slate-50/50 relative z-10"
             >
                <div className="p-8 flex-1 overflow-y-auto space-y-10">
                   {/* Client Short Bio */}
                   <div className="flex flex-col items-center text-center space-y-4">
                      <img src={activeChat.avatar} className="size-24 rounded-[32px] bg-white p-1 border border-slate-100 shadow-xl" alt="Client" />
                      <div>
                         <h4 className="text-xl font-black text-slate-900 tracking-tight">{activeChat.name}</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{activeChat.location}</p>
                      </div>
                   </div>

                   {/* Current Tour Card */}
                   <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-[#00897B]/10 flex items-center justify-center text-[#00897B]">
                            <Calendar className="size-5" />
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visite active</p>
                            <p className="text-xs font-black text-slate-900 truncate">{activeChat.route.split(': ')[1]}</p>
                         </div>
                      </div>
                      <div className="h-px bg-slate-50" />
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Tarif</span>
                            <p className="text-xs font-black text-slate-900">450 MAD</p>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Durée</span>
                            <p className="text-xs font-black text-slate-900">4 Heures</p>
                         </div>
                      </div>
                         <button 
                           onClick={() => toast.info("Détails de la Story", { description: "Ouverture de l'historique complet de cette visite." })}
                           className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                         >
                            Détails de la story
                         </button>
                   </div>

                   {/* Contact Info */}
                   <div className="space-y-6">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Coordonnées</h5>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 group">
                            <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#00897B] transition-colors">
                               <Phone className="size-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">{activeChat.phone}</p>
                         </div>
                         <div className="flex items-center gap-4 group">
                            <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#00897B] transition-colors">
                               <Mail className="size-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-700 truncate">{activeChat.email}</p>
                         </div>
                         <div className="flex items-center gap-4 group">
                            <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#00897B] transition-colors">
                               <MapPin className="size-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">{activeChat.location}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 border-t border-slate-100">
                   <button 
                     onClick={handleSendItinerary}
                     className="w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-900/10"
                   >
                      Envoyer itinéraire <ArrowRight className="size-4" />
                   </button>
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}

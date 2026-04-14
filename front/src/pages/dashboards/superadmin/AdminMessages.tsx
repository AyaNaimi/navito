import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Send, 
  Plus, 
  Image as ImageIcon, 
  Smile, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  Zap, 
  Compass, 
  ArrowLeft 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

const threads = [
  { 
    id: 1, 
    name: "Amina Benkirane", 
    role: "Guide • Fès", 
    text: "Le groupe est ravi de la visite du souk aujourd'hui...", 
    time: "10:30", 
    unread: 2, 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amina",
    history: [
      { sender: 'them', text: "Bonjour ! J'ai une question concernant les réservations en attente pour le trek de Merzouga ce week-end. Est-ce que tout est prêt ?", time: "10:30" },
      { sender: 'me', text: "Oui, Ahmed ! Toutes les confirmations ont été envoyées aux voyageurs. Vous recevrez le planning final d'ici ce soir.", time: "10:45" },
      { sender: 'them', text: "Super, merci de votre réactivité ! Le groupe est ravi de la visite du souk aujourd'hui.", time: "11:00" }
    ]
  },
  { 
    id: 2, 
    name: "Sarah Miller", 
    role: "Voyageuse • USA", 
    text: "Pouvez-vous confirmer mon transfert pour demain ?", 
    time: "Hier", 
    unread: 0, 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
    history: [
      { sender: 'them', text: "Hi! Can you confirm my airport transfer for tomorrow morning?", time: "Hier 14:20" },
      { sender: 'me', text: "Hello Sarah, yes! Your driver Youssef will be waiting at 9:00 AM.", time: "Hier 15:00" }
    ]
  },
  { 
    id: 3, 
    name: "Youssef Alami", 
    role: "Chauffeur • Marrakech", 
    text: "Je suis bien arrivé à l'aéroport avec le groupe.", 
    time: "Hier", 
    unread: 0, 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Youssef",
    history: [
      { sender: 'them', text: "Je suis bien arrivé à l'aéroport avec le groupe.", time: "Hier 09:30" },
      { sender: 'me', text: "Parfait Youssef. Bon retour !", time: "Hier 09:45" }
    ]
  },
  { 
    id: 4, 
    name: "Hôtel Mamounia", 
    role: "Partenaire • Hôtellerie", 
    text: "Réservation #HB-990 confirmée pour M. Smith.", 
    time: "15 Oct", 
    unread: 0, 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mamounia",
    history: [
      { sender: 'them', text: "Réservation #HB-990 confirmée pour M. Smith.", time: "15 Oct" }
    ]
  },
];

export default function AdminMessages({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [message, setMessage] = useState("");
  const [showThreadListMobile, setShowThreadListMobile] = useState(true);
  const [localMessages, setLocalMessages] = useState<Record<number, any[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<"audio"|"video">("audio");

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const currentHistory = [...activeThread.history, ...(localMessages[activeThreadId] || [])];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { sender: 'me', text: message, time: "À l'instant" };
    setLocalMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMessage]
    }));
    setMessage("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newMessage = { sender: 'me', text: "Document envoyé", image: reader.result as string, time: "À l'instant" };
      setLocalMessages(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), newMessage]
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  const startCall = (type: "audio"|"video") => {
    setCallType(type);
    setIsCalling(true);
    setTimeout(() => setIsCalling(false), 3000); // end after 3s mock
  };

  const handleThreadSelect = (id: number) => {
    setActiveThreadId(id);
    setShowThreadListMobile(false);
  };

  return (
    <div className="flex relative bg-white rounded-[3rem] shadow-sm border border-slate-50 overflow-hidden h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Call Overlay Mock */}
      {isCalling && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in zoom-in duration-200">
           <div className="relative mb-8">
              <img src={activeThread.avatar} className="size-32 rounded-full border-4 border-slate-800 shadow-2xl animate-pulse" alt="Avatar" />
              <div className="absolute inset-0 rounded-full bg-[#0da08b]/20 animate-ping" />
           </div>
           <h2 className="text-3xl font-black uppercase tracking-widest">{activeThread.name}</h2>
           <p className="text-slate-400 font-medium tracking-widest uppercase text-xs mt-2">{callType === "video" ? "Appel vidéo en cours..." : "Appel audio en cours..."}</p>
           <button onClick={() => setIsCalling(false)} className="mt-12 flex items-center justify-center size-16 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20">
              <Phone className="size-6 text-white rotate-[135deg]" />
           </button>
        </div>
      )}
      {/* Thread List */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-slate-50 flex flex-col transition-all duration-300",
        !showThreadListMobile && "hidden md:flex"
      )}>
        <div className="p-8 border-b border-slate-50">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Messages</h3>
              <button className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b] text-white shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all">
                <Plus className="size-5" />
              </button>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher une conversation..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-0 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 transition-all uppercase tracking-tight"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 hide-scrollbar">
           {threads.map((t) => (
             <div 
               key={t.id} 
               onClick={() => handleThreadSelect(t.id)}
               className={cn(
                "flex items-start gap-4 p-4 rounded-3xl cursor-pointer transition-all group",
                activeThreadId === t.id ? "bg-teal-50" : "hover:bg-slate-50"
               )}
             >
                <div className="relative flex-shrink-0">
                   <img src={t.avatar} className="size-14 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform group-hover:scale-105" alt="Avatar" />
                   {t.unread > 0 && (
                     <div className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                       {t.unread}
                     </div>
                   )}
                   <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#0da08b] border-2 border-white shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-1">
                      <p className={cn("text-sm font-black tracking-tight", activeThreadId === t.id ? "text-[#0da08b]" : "text-slate-900")}>{t.name}</p>
                      <span className="text-[10px] font-bold text-slate-400">{t.time}</span>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.role}</p>
                   <p className={cn("text-xs leading-relaxed truncate", activeThreadId === t.id ? "text-[#0da08b] font-black" : "text-slate-500 font-medium")}>{t.text}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-slate-50/30 transition-all duration-300",
        showThreadListMobile && "hidden md:flex"
      )}>
        {/* Chat Header */}
        <div className="p-6 md:p-8 bg-white border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowThreadListMobile(true)}
                className="md:hidden flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                 <ArrowLeft className="size-5" />
              </button>
              <div className="relative">
                 <img src={activeThread.avatar} className="size-12 md:size-14 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm" alt="Active Avatar" />
                 <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#0da08b] border-2 border-white shadow-sm" />
              </div>
              <div>
                 <h4 className="text-base md:text-xl font-black text-slate-900 tracking-tighter uppercase">{activeThread.name}</h4>
                 <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-[#0da08b] uppercase tracking-widest">
                       <ShieldCheck className="size-3" /> Officiel MTA
                    </span>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none translate-y-[1px]">{activeThread.role}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button onClick={() => startCall("audio")} className="hidden sm:flex size-11 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-[#0da08b] hover:border-[#0da08b]/30 transition-all transform active:scale-90">
                 <Phone className="size-5" />
              </button>
              <button onClick={() => startCall("video")} className="hidden sm:flex size-11 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-[#0da08b] hover:border-[#0da08b]/30 transition-all transform active:scale-90">
                 <Video className="size-5" />
              </button>
              <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />
              <button className="flex size-11 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-[#0da08b] hover:border-[#0da08b]/30 transition-all transform active:scale-90">
                 <MoreHorizontal className="size-5" />
              </button>
           </div>
        </div>

        {/* Messages Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
           <div className="text-center">
              <span className="px-4 py-1.5 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-sm">Historique</span>
           </div>

           {currentHistory.map((msg, i) => (
             <div 
               key={i} 
               className={cn(
                 "flex items-start gap-4 max-w-2xl animate-in slide-in-from-bottom-2 duration-300",
                 msg.sender === 'me' && "ml-auto justify-end text-right"
               )}
               style={{ animationDelay: `${i * 100}ms` }}
             >
                {msg.sender === 'them' && (
                  <img src={activeThread.avatar} className="size-10 rounded-xl bg-slate-100 flex-shrink-0" alt="Avatar" />
                )}
                <div className={cn(
                  "p-5 rounded-3xl shadow-sm border space-y-2 max-w-[80%]",
                  msg.sender === 'them' 
                    ? "bg-white rounded-tl-none border-slate-50" 
                    : "bg-[#0da08b] rounded-tr-none border-[#0da08b]/10 text-white shadow-[#0da08b]/20 shadow-xl"
                )}>
                   {msg.image ? (
                     <img src={msg.image} alt="Upload" className="w-full max-w-sm rounded-xl object-cover border border-black/10" />
                   ) : (
                     <p className={cn("text-sm leading-relaxed", msg.sender === 'me' ? "font-bold" : "font-medium text-slate-700")}>
                       {msg.text}
                     </p>
                   )}
                   <span className={cn(
                     "text-[10px] uppercase tracking-widest block",
                     msg.sender === 'me' ? "font-black text-white/70" : "font-bold text-slate-400"
                   )}>
                     {msg.time}
                   </span>
                </div>
                {msg.sender === 'me' && (
                  <div className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">AD</div>
                )}
             </div>
           ))}
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-white border-t border-slate-50">
           <div className="relative flex items-center gap-4 max-w-5xl mx-auto">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
              <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                <button onClick={() => fileInputRef.current?.click()} className="flex size-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-[#0da08b] hover:bg-teal-50 transition-all active:scale-90">
                   <Plus className="size-5" />
                </button>
              </div>

              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Rédigez votre message ici..."
                className="flex-1 h-14 bg-transparent text-sm font-bold outline-none text-slate-900 placeholder:text-slate-300 transition-all font-sans"
              />

              <div className="flex items-center gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="hidden sm:flex size-11 items-center justify-center rounded-2xl text-slate-300 hover:text-slate-500 transition-colors">
                   <ImageIcon className="size-5" />
                </button>
                <button className="hidden sm:flex size-11 items-center justify-center rounded-2xl text-slate-300 hover:text-slate-500 transition-colors">
                   <Smile className="size-5" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="flex h-14 items-center gap-3 rounded-2xl bg-[#0da08b] px-8 text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all transform active:scale-95 ml-2"
                >
                   Envoyer <Send className="size-4" />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

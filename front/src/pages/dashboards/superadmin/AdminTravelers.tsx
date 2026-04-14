import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Star, 
  ChevronRight, 
  X,
  CreditCard,
  History,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

const travelers = [
  { id: "T-001", name: "Sarah Miller", email: "sarah.m@example.com", country: "États-Unis", joined: "12 Jan 2024", trips: 4, spent: "12,400 MAD", status: "active", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" },
  { id: "T-002", name: "Marc Rossi", email: "m.rossi@example.com", country: "Italie", joined: "05 Fév 2024", trips: 2, spent: "5,800 MAD", status: "active", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Marc" },
  { id: "T-003", name: "Elena G.", email: "elena.g@example.com", country: "Espagne", joined: "20 Fév 2024", trips: 1, spent: "2,100 MAD", status: "pending", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Elena" },
  { id: "T-004", name: "John Doe", email: "j.doe@example.com", country: "Royaume-Uni", joined: "01 Mar 2024", trips: 7, spent: "28,600 MAD", status: "active", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=John" },
];

export default function AdminTravelers({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const [selectedTraveler, setSelectedTraveler] = useState<typeof travelers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = travelers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Gestion des Visiteurs</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Suivez les activités et l'engagement des voyageurs sur la plateforme.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-6 px-6">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total</p>
                 <p className="text-xl font-black text-[#0da08b]">1,284</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Actifs</p>
                 <p className="text-xl font-black text-[#0da08b]">842</p>
              </div>
           </div>
        </div>
      </section>

      <Card className="rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
           <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par nom, email ou pays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-0 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0da08b]/10 transition-all"
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/30">
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-10">Voyageur</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pays</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscrit le</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trips</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Dépenses</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-10"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filtered.map((t) => (
                      <tr 
                        key={t.id} 
                        onClick={() => setSelectedTraveler(t)}
                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                         <td className="p-6 pl-10">
                            <div className="flex items-center gap-4">
                               <img src={t.avatar} className="size-10 rounded-xl bg-slate-100 border border-slate-200 group-hover:border-[#0da08b]/40 transition-colors" />
                               <div>
                                  <p className="text-sm font-black text-slate-900 group-hover:text-[#0da08b] transition-colors">{t.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400">{t.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="p-6 text-sm font-bold text-slate-600">{t.country}</td>
                         <td className="p-6 text-sm font-bold text-slate-600">{t.joined}</td>
                         <td className="p-6">
                            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-900 text-xs font-black">{t.trips}</span>
                         </td>
                         <td className="p-6 text-sm font-black text-slate-900 text-right">{t.spent}</td>
                         <td className="p-6 pr-10 text-right">
                            <ChevronRight className="size-5 text-slate-200 group-hover:text-[#0da08b] group-hover:translate-x-1 transition-all inline" />
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </CardContent>
      </Card>

      {/* Profile Detail Slide-over / Modal */}
      {selectedTraveler && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedTraveler(null)}
           />
           <div className="relative w-full max-w-2xl rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="h-32 bg-[#0da08b] relative">
                 <button 
                  onClick={() => setSelectedTraveler(null)}
                  className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 active:scale-90 transition-all border border-white/20 backdrop-blur-md"
                 >
                    <X className="size-5" />
                 </button>
              </div>
              <div className="px-10 pb-10">
                 <div className="relative -mt-12 flex items-end gap-6 mb-8 px-2">
                    <img src={selectedTraveler.avatar} className="size-32 rounded-[2.5rem] border-8 border-white bg-white shadow-xl" alt="Avatar" />
                    <div className="pb-4 space-y-1">
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedTraveler.name}</h3>
                       <div className="flex items-center gap-2">
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", 
                            selectedTraveler.status === 'active' ? "bg-teal-50 text-[#0da08b]" : "bg-orange-50 text-orange-500")}>
                            {selectedTraveler.status}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 capitalize">{selectedTraveler.country}</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Informations de Contact</h4>
                          <div className="space-y-3">
                             <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Mail className="size-4 text-[#0da08b]" /> {selectedTraveler.email}
                             </div>
                             <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Phone className="size-4 text-[#0da08b]" /> +1 234 567 890
                             </div>
                             <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Calendar className="size-4 text-[#0da08b]" /> Inscrit le {selectedTraveler.joined}
                             </div>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Statistiques Voyageur</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <CreditCard className="size-5 text-slate-400 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Dépensé</p>
                                <p className="text-sm font-black text-slate-900">{selectedTraveler.spent}</p>
                             </div>
                             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <History className="size-5 text-slate-400 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réservations</p>
                                <p className="text-sm font-black text-slate-900">{selectedTraveler.trips}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Dernières Activités</h4>
                       <div className="space-y-3">
                          {[
                            { title: "Medina tour - Fès", date: "14 Mar 2024", price: "450 MAD" },
                            { title: "Transport Aéroport - Casa", date: "12 Mar 2024", price: "300 MAD" }
                          ].map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 transition-all hover:border-[#0da08b]/30 cursor-pointer">
                               <div>
                                  <p className="text-sm font-black text-slate-900 tracking-tight">{t.title}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{t.date}</p>
                               </div>
                               <span className="text-xs font-black text-[#0da08b]">{t.price}</span>
                            </div>
                          ))}
                       </div>
                       <button 
                        onClick={() => { setSelectedTraveler(null); onNavigate("messages"); }}
                        className="w-full h-12 rounded-2xl bg-[#0da08b] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all mt-4"
                       >
                         Contacter le Visiteur
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

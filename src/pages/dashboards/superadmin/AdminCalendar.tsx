import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  Clock, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { cn } from "../../../app/components/ui/utils";
import { guidesByDate } from "./superAdminData";
import type { GuideDayAssignment } from "./superAdminTypes";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

interface EventDetail {
  id: string;
  title: string;
  guide: string;
  service: string;
  location: string;
  time: string;
  members: string[];
  status: 'confirmed' | 'pending' | 'completed';
}

const mockEventDetails: Record<string, EventDetail> = {
  "GDE-201": {
    id: "BK-9102",
    title: "Medina & Souks Orientation",
    guide: "Amina Benkirane",
    service: "Historic Quarter Walk",
    location: "Fès, Medina",
    time: "09:00 - 14:00",
    members: ["Sarah Miller", "John Doe", "Elena G."],
    status: 'pending'
  },
  "GDE-202": {
    id: "BK-8804",
    title: "Chefchaouen Blue Lanes",
    guide: "Salma Idrissi",
    service: "Photography Tour",
    location: "Chefchaouen",
    time: "10:30 - 15:30",
    members: ["Marc Rossi", "Lisa Wong"],
    status: 'confirmed'
  },
  "GDE-203": {
    id: "BK-7721",
    title: "Desert Camp Handover",
    guide: "Hicham El Mansouri",
    service: "Merzouga Experience",
    location: "Erg Chebbi",
    time: "17:00 - 20:00",
    members: ["The Wilson Family (4)"],
    status: 'confirmed'
  }
};

export default function AdminCalendar({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Avril 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(1);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajuster pour Lun-Dim
  }, [currentDate]);

  const monthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const getEventsForDay = (day: number) => {
    const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
    return guidesByDate[dateStr] || [];
  };

  const selectedEvent = selectedEventId ? mockEventDetails[selectedEventId] : null;

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-auto xl:h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Left: Calendar Grid */}
      <Card className="flex-1 rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="border-b border-slate-50 p-8 flex flex-row items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0da08b]/5 text-[#0da08b]">
                 <CalendarIcon className="size-7" />
              </div>
              <div>
                 <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{monthYear}</CardTitle>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Planning des Activités</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"><ChevronLeft className="size-5" /></button>
              <button className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"><ChevronRight className="size-5" /></button>
           </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
           <div className="grid grid-cols-7 border-b border-slate-50">
              {days.map(d => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
              ))}
           </div>
           <div className="grid grid-cols-7 h-full">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="border-r border-b border-slate-50 bg-slate-50/30" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const events = getEventsForDay(day);
                const isSelected = selectedDay === day;
                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "min-h-[120px] border-r border-b border-slate-50 p-3 transition-all cursor-pointer group hover:bg-slate-50/50",
                      isSelected && "bg-[#0da08b]/5 ring-1 ring-[#0da08b] ring-inset"
                    )}
                  >
                    <div className={cn(
                      "flex size-8 items-center justify-center rounded-xl text-sm font-black transition-all mb-2",
                      isSelected ? "bg-[#0da08b] text-white" : "text-slate-900 group-hover:text-[#0da08b]"
                    )}>
                      {day}
                    </div>
                    <div className="space-y-1.5">
                       {events.map((e: GuideDayAssignment, idx: number) => (
                         <div 
                          key={idx} 
                          onClick={(ev) => { ev.stopPropagation(); setSelectedEventId(e.guideId); }}
                          className="px-2 py-1.5 rounded-lg bg-teal-50 text-[#0da08b] text-[9px] font-black uppercase tracking-tighter truncate border border-teal-100 hover:bg-[#0da08b] hover:text-white transition-all shadow-sm"
                         >
                           {e.guideName.split(' ')[0]} • {e.city}
                         </div>
                       ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </CardContent>
      </Card>

      {/* Right: Day Details */}
      <div className="w-full xl:w-[400px] flex flex-col gap-8">
        <Card className="flex-1 rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden flex flex-col min-h-[400px]">
           <CardHeader className="border-b border-slate-50 p-8 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                Détails du {selectedDay} {months[currentDate.getMonth()]}
              </CardTitle>
              <button className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b] text-white shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all">
                <Plus className="size-5" />
              </button>
           </CardHeader>
           <CardContent className="flex-1 p-8 overflow-y-auto">
              {selectedEvent ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-[#0da08b] text-[10px] font-black uppercase tracking-widest mb-2 border border-teal-100">
                         <MapPin className="size-3" /> {selectedEvent.location}
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{selectedEvent.title}</h4>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                         <span className="flex items-center gap-1.5"><Clock className="size-4 text-[#0da08b]" /> {selectedEvent.time}</span>
                         <span className="flex items-center gap-1.5"><Users className="size-4 text-[#0da08b]" /> {selectedEvent.members.length} voyageurs</span>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guide Assigné</span>
                            <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", 
                              selectedEvent.status === 'confirmed' ? "bg-teal-50 text-[#0da08b] border-teal-100" : "bg-orange-50 text-orange-500 border-orange-100")}>
                               {selectedEvent.status}
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedEvent.guide}`} className="size-14 rounded-2xl bg-white border border-slate-200" alt="Guide" />
                            <div>
                               <p className="text-base font-black text-slate-900">{selectedEvent.guide}</p>
                               <button 
                                onClick={() => onNavigate("guides")}
                                className="text-[10px] font-black text-[#0da08b] hover:underline uppercase tracking-widest"
                               >
                                Voir Profil
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Voyageurs du groupe</h5>
                         <div className="flex flex-col gap-2">
                            {selectedEvent.members.map((m, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-[#0da08b]/30 transition-all cursor-pointer group">
                                 <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-[#0da08b]/5 group-hover:text-[#0da08b]">
                                    {m.charAt(0)}
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">{m}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                   <button className="w-full h-14 rounded-2xl bg-[#0da08b] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all active:scale-95">
                      Gérer l'Activité
                   </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-300 py-20">
                   <CalendarIcon className="size-16 stroke-slate-100" />
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest">Aucune Activité</p>
                      <p className="text-xs font-medium max-w-[200px]">Sélectionnez un événement pour voir les détails ou cliquez sur + pour en créer un.</p>
                   </div>
                </div>
              )}
           </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-0 bg-slate-900 p-8 text-white space-y-4 overflow-hidden relative group">
           <div className="relative z-10">
              <h4 className="text-lg font-black uppercase tracking-tighter">Demandes en attente (4)</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Nécurite votre attention</p>
           </div>
           <button 
            onClick={() => onNavigate("packages")}
            className="relative z-10 w-full h-12 rounded-[1.25rem] bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-[#0da08b] hover:text-white transition-all shadow-lg"
           >
            Ouvrir la liste
           </button>
           <div className="absolute -right-8 -bottom-8 size-48 bg-[#0da08b]/20 rounded-full blur-3xl group-hover:bg-[#0da08b]/40 transition-all" />
        </Card>
      </div>
    </div>
  );
}

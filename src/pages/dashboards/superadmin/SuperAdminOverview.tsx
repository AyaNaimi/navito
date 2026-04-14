import { CalendarDays, LineChart as LineChartIcon, LayoutDashboard, MoreHorizontal, Plane, MessageSquare, Briefcase, Plus, TrendingUp, Users, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";
import { monthlyRevenue } from "../data";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { type SuperAdminNavId } from "./MoroccoSuperAdminShell";

const stats = [
  { label: "Réservations Totales", value: "1,284", icon: CalendarDays, change: "+12.5%", positive: true },
  { label: "Nouveaux Visiteurs", value: "842", icon: Users, change: "+8.2%", positive: true },
  { label: "Revenus (MAD)", value: "124,500", icon: LineChartIcon, change: "+15.3%", positive: true },
];

const packages = [
  { title: "Dunes de Merzouga", location: "Erg Chebbi, Maroc", image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=300" },
  { title: "Médina de Fès", location: "Fès, Maroc", image: "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=300" },
  { title: "Haut Atlas Trek", location: "Imlil, Maroc", image: "https://images.unsplash.com/photo-1580741603417-64906354897f?auto=format&fit=crop&q=80&w=300" },
];

const messages = [
  { name: "Hôtel Mamounia", text: "Confirmation pour la suite VIP de d...", time: "11:03", unread: 1, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mamounia" },
  { name: "Yassine (Guide)", text: "Le groupe est bien arrivé à Imlil.", time: "14:30", unread: 0, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Yassine" },
  { name: "Sarah Miller", text: "Question sur le transfert depuis l'a...", time: "09:45", unread: 3, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" },
];

const trips = [
  { title: "Escapade Romantique", location: "Chefchaouen, Maroc", date: "12 - 15 Mai", users: 2, image: "https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&q=80&w=150" },
  { title: "Circuit des Villes Impériales", location: "Rabat & Meknès", date: "18 - 25 Mai", users: 14, image: "https://images.unsplash.com/photo-1517482813511-df4295982823?auto=format&fit=crop&q=80&w=150" },
];

const destinationData = [
  { name: "Marrakech", value: 45, fill: "#0da08b" },
  { name: "Merzouga", value: 25, fill: "#0d8a78" },
  { name: "Chefchaouen", value: 20, fill: "#0c7a6b" },
  { name: "Fès", value: 10, fill: "#0b6a5a" },
];

export default function SuperAdminOverview({ onNavigate }: { onNavigate: (id: SuperAdminNavId) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, change, positive }) => (
          <Card
            key={label}
            className="group rounded-[2rem] border-0 bg-white p-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-5">
                 <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0da08b]/5 transition-colors group-hover:bg-[#0da08b] group-hover:text-white flex-shrink-0">
                  <Icon className="size-7 text-[#0da08b] group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
                  <p className="text-2xl font-black text-slate-900 group-hover:text-[#0da08b] transition-colors tracking-tight">{value}</p>
                </div>
              </div>
              <div className={`mt-auto flex items-center justify-center rounded-xl px-3 py-1.5 text-[10px] font-black shadow-sm uppercase tracking-widest ${positive ? 'bg-teal-50 text-[#0da08b]' : 'bg-red-50 text-red-600'}`}>
                {change}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-8">
        {/* Main Chart & Activities */}
        <div className="space-y-8 xl:col-span-4">
           <Card className="rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 pt-8 px-10">
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Aperçu des Revenus</CardTitle>
              <button className="flex items-center gap-2 rounded-2xl bg-[#0da08b] px-5 py-2 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all active:scale-95">
                Hebdomadaire
                <ChevronDown className="size-3" />
              </button>
            </CardHeader>
            <CardContent className="h-[350px] pt-8 px-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0da08b" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0da08b" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} dy={15} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `${v}DH`} />
                  <Tooltip
                    cursor={{ stroke: '#0da08b', strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: "1.25rem",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      fontSize: "12px",
                      fontWeight: "900",
                      textTransform: "uppercase"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0da08b"
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 3, fill: '#fff', stroke: '#0da08b' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#0da08b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-0 bg-white shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 pt-8 px-10">
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Activités Locales</CardTitle>
              <button 
                onClick={() => onNavigate("packages")}
                className="text-[10px] font-black text-[#0da08b] uppercase tracking-widest hover:underline"
              >
                Voir Tout les Packs
              </button>
            </CardHeader>
            <CardContent className="pt-8 px-10">
              <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar">
                {packages.map((pkg, i) => (
                  <div key={i} className="group relative h-48 w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                    <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-5 left-5 right-5 space-y-1">
                      <p className="text-[9px] font-black tracking-[0.1em] text-teal-400 uppercase leading-none">{pkg.title}</p>
                      <p className="text-xs font-black text-white leading-tight uppercase truncate">{pkg.location}</p>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => onNavigate("packages")}
                  className="h-48 w-44 flex-shrink-0 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-[#0da08b]/30 hover:text-[#0da08b] transition-all group"
                >
                   <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#0da08b]/5 transition-colors">
                      <Plus className="size-6" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Nouveau Pack</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8 xl:col-span-3">
          <Card className="rounded-[3rem] border-0 bg-white shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-8">
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter">Destinations Top</CardTitle>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-[#0da08b] text-[10px] font-black uppercase">
                 <TrendingUp className="size-3" /> Popularité
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8 px-10">
               <div className="h-48 w-full group-hover:scale-105 transition-transform duration-500">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={destinationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {destinationData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300 hover:opacity-80 cursor-pointer outline-none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: "1.5rem", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex w-full flex-col gap-4 mt-8">
                 {destinationData.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between group/item cursor-pointer">
                     <span className="flex items-center gap-3 font-black text-slate-500 transition-colors group-hover/item:text-[#0da08b] text-[10px] uppercase tracking-widest">
                       <div className="size-3 rounded-md shadow-sm" style={{ backgroundColor: item.fill }} /> {item.name}
                     </span>
                     <span className="text-slate-900 font-black text-xs">{item.value}%</span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-0 bg-white shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 pt-8 px-8 flex-shrink-0">
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter">Messages Urgents</CardTitle>
              <button 
                onClick={() => onNavigate("messages")}
                className="text-slate-300 hover:text-[#0da08b] transition-colors"
              >
                <MessageSquare className="size-5" />
              </button>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[350px] hide-scrollbar">
               <div className="divide-y divide-slate-50">
                 {messages.map((msg, i) => (
                   <div 
                    key={i} 
                    onClick={() => onNavigate("messages")}
                    className="group flex cursor-pointer items-start gap-4 p-6 transition-all hover:bg-slate-50 active:bg-white"
                   >
                     <div className="relative">
                        <img src={msg.avatar} alt="avatar" className="size-12 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-[#0da08b]/30 transition-colors" />
                        {msg.unread > 0 && <div className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 border-2 border-white" />}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <div className="flex justify-between items-center mb-1">
                         <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0da08b] transition-colors leading-none tracking-tight">{msg.name}</h4>
                         <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                       </div>
                       <p className="truncate text-xs font-medium text-slate-500 leading-none">{msg.text}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
               <button 
                onClick={() => onNavigate("messages")}
                className="text-[10px] font-black text-[#0da08b] uppercase tracking-widest hover:underline"
               >
                Accéder au Centre de Messages
               </button>
            </div>
          </Card>

           <Card className="rounded-[3rem] border-0 bg-white shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 pt-8 px-8">
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter">Départs Imminents</CardTitle>
              <button 
                onClick={() => onNavigate("calendar")}
                className="flex size-10 items-center justify-center rounded-2xl bg-[#0da08b] text-white shadow-lg shadow-[#0da08b]/20 hover:bg-[#0d8a78] transition-all active:scale-90"
              >
                <Plane className="size-5" />
              </button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                 {trips.map((trip, i) => (
                   <div 
                    key={i} 
                    onClick={() => onNavigate("calendar")}
                    className="group flex cursor-pointer items-center gap-4 p-6 transition-colors hover:bg-slate-50"
                   >
                     <div className="relative size-14 overflow-hidden rounded-2xl shadow-sm flex-shrink-0">
                        <img src={trip.image} alt={trip.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-[9px] font-black tracking-widest text-[#0da08b] uppercase truncate mb-1">{trip.title}</p>
                       <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-[#0da08b] transition-colors uppercase tracking-tighter">{trip.location}</h4>
                       <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                             <Clock className="size-3" /> {trip.date}
                          </div>
                       </div>
                     </div>
                     <ChevronRight className="size-5 text-slate-200 group-hover:text-[#0da08b] group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

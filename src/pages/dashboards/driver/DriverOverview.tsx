import { motion } from "motion/react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Star, Navigation, MapPin, ChevronRight, TrendingUp, Clock, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Switch } from "../../../app/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../../../app/components/ui/card";

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const DRIVER_POSITION: [number, number] = [34.0209, -6.8416];

const pieData = [
  { name: 'Standard', value: 60, fill: "#00897B" },
  { name: 'Premium', value: 30, fill: "#4db6ac" },
  { name: 'Group', value: 10, fill: "#80cbc4" }
];

export default function DriverOverview() {
  const [isOnline, setIsOnline] = useState(true);
  const [incomingTrip, setIncomingTrip] = useState<any>(null);
  const [acceptedTrip, setAcceptedTrip] = useState<any>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOnline && !acceptedTrip) {
      timeout = setTimeout(() => {
        setIncomingTrip({
          price: "120",
          currency: "MAD",
          timeRemaining: 15,
          distance: "4.2 km",
          timeEstimate: "15 min",
          pickup: "Gare Casa Port",
          dropoff: "Morocco Mall",
        });
      }, 3500);
    } else {
      setIncomingTrip(null);
    }
    return () => clearTimeout(timeout);
  }, [isOnline, acceptedTrip]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (incomingTrip && incomingTrip.timeRemaining > 0) {
      interval = setInterval(() => {
        setIncomingTrip((prev: any) => prev ? { ...prev, timeRemaining: prev.timeRemaining - 1 } : null);
      }, 1000);
    } else if (incomingTrip && incomingTrip.timeRemaining === 0) {
      setIncomingTrip(null);
    }
    return () => clearInterval(interval);
  }, [incomingTrip?.timeRemaining]);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* HEADER BAR AVEC SWITCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-8">
        <div className="space-y-1">
           <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Bonjour, Samrat!</h2>
           <p className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="size-3" /> Vendredi, Oct 9 • 04:30 PM
           </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 pl-5 pr-3 py-2.5 rounded-2xl border border-slate-100/80">
          <span className={isOnline ? "text-[#00897B] font-black text-xs uppercase tracking-[0.1em]" : "text-slate-400 font-bold text-xs uppercase tracking-[0.1em]"}>
            {isOnline ? "En Ligne" : "Hors Ligne"}
          </span>
          <Switch checked={isOnline} onCheckedChange={(val) => {
            setIsOnline(val);
            if (!val) { setIncomingTrip(null); setAcceptedTrip(null); }
          }} className="data-[state=checked]:bg-[#00897B]" />
        </div>
      </div>

      {/* ETAT SANS COURSE (AFFICHAGE DU BEAU DESIGN ORIGINAL) */}
      {!acceptedTrip && !incomingTrip && (
         <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 space-y-6">
                  {/* HOT MARKET ALERT (Restauration exacte) */}
                  <div className={isOnline ? "opacity-100 transition-opacity" : "opacity-60 grayscale transition-opacity"}>
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#00897B] via-[#00796B] to-[#004D40] p-8 shadow-[0_20px_48px_-12px_rgba(0,137,123,0.35)]"
                    >
                        <div className="relative z-10 text-white space-y-4">
                          <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-[0.25em]">
                            <TrendingUp className="size-3" />
                            Hot Market Alert
                          </div>
                          <div className="space-y-1">
                            <h2 className="text-2xl font-bold leading-tight tracking-tight">Zone Médina en forte demande !</h2>
                            <p className="text-white/75 text-sm font-semibold leading-normal max-w-md">Gagnez plus avec un bonus de 1.2x dans le centre de Casablanca. Prêt à y aller ?</p>
                          </div>
                          <button className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 border border-white/10 mt-2">
                            Voir la carte de chaleur <ChevronRight className="size-4" />
                          </button>
                        </div>
                        <div className="absolute -right-8 -bottom-10 size-64 rounded-full bg-[#80cbc4]/15 blur-3xl" />
                        <div className="absolute right-0 top-0 size-32 bg-[#4db6ac]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    </motion.div>
                  </div>

                  {/* CARTE GEOGRAPHIQUE SIMPLE - STATUT ZONE */}
                  <Card className="rounded-[32px] border-0 bg-white shadow-sm overflow-hidden">
                     <div className="h-64 w-full relative group">
                        {isOnline && (
                           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00897B] to-transparent animate-pulse z-50"></div>
                        )}
                        <MapContainer center={DRIVER_POSITION} zoom={13} className="h-full w-full" zoomControl={false} scrollWheelZoom={false}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={DRIVER_POSITION}><Popup>Zone Actuelle</Popup></Marker>
                          <MapController center={DRIVER_POSITION} />
                        </MapContainer>
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/50 shadow-lg flex items-center gap-2">
                          <div className={isOnline ? "size-2 bg-emerald-500 rounded-full animate-pulse shadow-sm" : "size-2 bg-slate-300 rounded-full shadow-sm"} />
                          <span className="text-[10px] font-bold text-slate-900 tracking-tight">Main Street, Casablanca</span>
                        </div>
                     </div>
                     <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-50 gap-4">
                        <div className="space-y-0.5">
                           <h3 className="text-sm font-bold text-slate-900 leading-tight">Performance de Zone : Élevée</h3>
                           <p className="text-xs font-semibold text-slate-400">Prochaine course : ~2 min d'attente</p>
                        </div>
                        <button className="text-[11px] font-bold text-[#00897B] bg-[#00897B]/5 px-4 py-2.5 rounded-xl transition-all hover:bg-[#00897B]/10 border border-[#00897B]/10 w-full sm:w-auto text-center">
                           Voir l'analyse
                        </button>
                     </CardContent>
                  </Card>
               </div>

               <div className="space-y-6">
                  {/* KPI DASHBOARD GRID */}
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: "Revenue", value: "47k", sub: "MAD", icon: Wallet, color: "#00897B" },
                       { label: "Trips", value: "379", sub: "Courses", icon: Navigation, color: "#4db6ac" },
                       { label: "Rating", value: "4.92", sub: "Score", icon: Star, color: "#80cbc4" },
                     ].map((stat) => (
                       <Card key={stat.label} className="border-0 bg-white rounded-[28px] shadow-sm flex flex-col items-center py-6 px-2 hover:shadow-md transition-shadow">
                          <div className="size-12 rounded-2xl flex items-center justify-center bg-slate-50 mb-3 border border-slate-100">
                             <stat.icon className="size-5" style={{ color: stat.color }} strokeWidth={2.25} />
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="text-xl font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          </div>
                       </Card>
                     ))}
                  </div>

                  {/* PIE CHART DISTRIBUTION */}
                  <Card className="rounded-[32px] border-0 bg-white shadow-sm">
                     <CardHeader className="pb-2 pt-6 px-7 border-b border-slate-50/80">
                       <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2.5 uppercase tracking-wider opacity-60">
                          <TrendingUp className="size-3.5 text-[#00897B]" /> Trip Distribution
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="pb-6 pt-6 flex flex-col items-center gap-6 px-7">
                       <div className="h-40 w-40 relative bg-slate-50/50 rounded-full flex items-center justify-center p-2 border border-slate-100">
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={65} stroke="none" paddingAngle={6}>
                               {pieData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all hover:opacity-80 outline-none" /> ))}
                             </Pie>
                             <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)', fontSize: '11px', fontWeight: 'bold' }} itemStyle={{ color: '#0f172a' }} />
                           </PieChart>
                         </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                             <span className="text-[14px] font-black text-slate-800 leading-none">100%</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Trips</span>
                          </div>
                       </div>
                       <div className="w-full space-y-3.5 px-2">
                         {pieData.map((item) => (
                           <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                             <div className="flex items-center gap-2.5">
                               <div className="size-2 rounded-full shadow-sm" style={{ backgroundColor: item.fill }} />
                               <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{item.name}</span>
                             </div>
                             <span className="text-[11px] font-black text-slate-900/80 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100/50">{item.value}%</span>
                           </div>
                         ))}
                       </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      )}

      {/* DEMANDE DE COURSE (SUPERPOSITION DIRECTE) */}
      {incomingTrip && (
         <div className="max-w-2xl mx-auto">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
               className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,137,123,0.3)] overflow-hidden border border-slate-100"
            >
              <div className="p-8 pb-0 flex items-center justify-between bg-slate-900 relative">
                 <div className="absolute top-0 right-0 size-32 bg-[#00897B]/30 rounded-full blur-2xl mix-blend-screen" />
                 <div className="space-y-1 relative z-10 text-white">
                    <h3 className="text-2xl font-black">Nouvelle Course !</h3>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Clock className="size-4" /> expire dans {incomingTrip.timeRemaining}s
                    </p>
                 </div>
                 <div className="flex items-center justify-center size-16 rounded-full bg-slate-800 border-[3px] border-slate-700 shadow-sm relative shrink-0 z-10 text-white">
                    <svg className="absolute inset-0 size-full -rotate-90">
                      <circle cx="30" cy="30" r="28" className="fill-none stroke-slate-700 stroke-[4px]" />
                      <circle cx="30" cy="30" r="28"  className="fill-none stroke-emerald-400 stroke-[4px] transition-all duration-1000 linear" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${(15 - incomingTrip.timeRemaining) / 15 * (2 * Math.PI * 28)}`}  />
                    </svg>
                    <span className="text-xl font-black z-10">{incomingTrip.timeRemaining}</span>
                 </div>
              </div>

              <div className="p-8">
                 <div className="flex items-center justify-between mb-8 bg-slate-50 border border-slate-100 rounded-3xl p-6">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gain Estimé</span>
                       <p className="text-3xl font-black text-[#00897B] leading-none">{incomingTrip.price} <span className="text-sm text-[#00897B]/70">{incomingTrip.currency}</span></p>
                    </div>
                    <div className="text-right space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance & Temps</span>
                       <p className="text-sm font-black text-slate-900">{incomingTrip.distance} • {incomingTrip.timeEstimate}</p>
                    </div>
                 </div>

                 <div className="h-48 rounded-[2rem] overflow-hidden mb-8 relative group border border-slate-100 shadow-inner">
                    <MapContainer center={DRIVER_POSITION} zoom={13} className="h-full w-full" zoomControl={false} scrollWheelZoom={false}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <MapController center={DRIVER_POSITION} />
                    </MapContainer>
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-900/80 to-transparent z-[400] flex items-end p-5 pointer-events-none">
                       <div className="flex flex-col gap-3 relative w-full">
                          <div className="flex items-center gap-3">
                             <div className="size-3 rounded-full bg-emerald-400 ring-4 ring-white/20 shadow-sm shrink-0" />
                             <p className="text-xs font-black tracking-wide text-white line-clamp-1">{incomingTrip.pickup}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="size-3 rounded-full bg-rose-500 ring-4 ring-white/20 shadow-sm shrink-0" />
                             <p className="text-xs font-black tracking-wide text-white line-clamp-1">{incomingTrip.dropoff}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <button onClick={() => setIncomingTrip(null)} className="w-1/3 py-5 rounded-2xl bg-white text-slate-500 border border-slate-200 font-bold text-sm uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-colors">Refuser</button>
                    <button onClick={() => { setAcceptedTrip(incomingTrip); setIncomingTrip(null); }} className="w-2/3 py-5 rounded-2xl bg-[#00897B] text-white flex justify-center items-center gap-2 font-bold text-sm uppercase tracking-widest hover:bg-[#00796b] shadow-xl shadow-[#00897B]/30 transition-all active:scale-[0.98]">
                       <Navigation className="size-5" /> Accepter la course
                    </button>
                 </div>
              </div>
            </motion.div>
         </div>
      )}

      {/* COURSE EN COURS (LE NOUVEAU BEAU DESIGN INTÉGRÉ) */}
      {acceptedTrip && (
         <div className="max-w-2xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
             className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,137,123,0.3)] border border-slate-100 relative overflow-hidden"
           >
              {/* En-tête de la course */}
              <div className="p-8 border-b border-slate-50 relative overflow-hidden bg-slate-900">
                 <div className="absolute top-0 right-0 size-48 bg-[#00897B]/30 rounded-full blur-3xl mix-blend-screen" />
                 <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="size-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <Navigation className="size-6 text-emerald-400" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-white text-xl font-black tracking-tight">Course en cours</h4>
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">En route vers la destination</p>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-white text-3xl font-black">{acceptedTrip.price} <span className="text-sm text-slate-400">{acceptedTrip.currency}</span></p>
                    </div>
                 </div>
              </div>

              {/* Carte Live */}
              <div className="h-64 w-full relative">
                 <MapContainer center={DRIVER_POSITION} zoom={14} className="h-full w-full" zoomControl={false} scrollWheelZoom={false}>
                   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                   <MapController center={DRIVER_POSITION} />
                 </MapContainer>
                 {/* Trajet Overlay (Simulation) */}
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-[400] flex items-end p-8 pb-4 pointer-events-none">
                 </div>
                 {/* Badge d'estimation */}
                 <div className="absolute top-4 right-4 z-[400] bg-white rounded-2xl shadow-lg border border-slate-100 p-3 px-4 flex items-center gap-3">
                    <Clock className="size-5 text-[#00897B]" />
                    <div>
                       <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 leading-none mb-1">Arrivée estimée</p>
                       <p className="text-lg font-black text-slate-900 leading-none">16:42 <span className="text-xs text-slate-500 font-bold">(8 min)</span></p>
                    </div>
                 </div>
              </div>

              {/* Détails et Actions */}
              <div className="p-8 space-y-6 bg-white z-10 relative">
                 
                 {/* ProgressBar Course */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-[#00897B]">{acceptedTrip.pickup}</span>
                       <span className="text-slate-400">{acceptedTrip.dropoff}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                       <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00897B] to-emerald-400 rounded-full w-[45%] transition-all duration-1000">
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 blur-[2px] animate-pulse" />
                       </div>
                    </div>
                 </div>

                 {/* Passager Info et Boutons */}
                 <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative">
                         <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Jack" className="size-16 rounded-2xl bg-white shadow-sm border border-slate-200" alt="Client" />
                         <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-[#00897B] text-white border-2 border-white px-2 py-0.5 rounded-lg">
                            <Star className="size-2.5 fill-white" />
                            <span className="text-[9px] font-black">5.0</span>
                         </div>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-0.5">Passager</p>
                         <p className="text-xl font-black text-slate-900">Jack R.</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none size-14 rounded-2xl bg-white border border-slate-200 text-slate-600 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-95 text-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </button>
                      <button className="flex-1 md:flex-none size-14 rounded-2xl bg-white border border-slate-200 text-slate-600 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-95 text-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                      </button>
                   </div>
                 </div>

                 {/* Action finale */}
                 <div className="pt-2">
                    <button 
                       className="w-full py-5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]" 
                       onClick={() => setAcceptedTrip(null)}
                    >
                       Terminer la course
                    </button>
                 </div>
              </div>
           </motion.div>
         </div>
      )}

    </div>
  );
}

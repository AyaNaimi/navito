import { AnimatePresence, motion } from "motion/react";
import { Star, BellRing, Phone, Search, MoreVertical, Navigation, CreditCard, ShieldCheck, ListTodo } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { latLngBounds, type LatLngTuple } from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { Trip } from "./types";
import DriverShell from "./components/DriverShell";

function MapController({ center, bounds }: { center?: [number, number]; bounds?: any }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, bounds, map]);
  return null;
}

type LiveTripRequest = Trip & {
  remainingSeconds: number;
  driverOffer: number;
};
type TouristProfile = {
  name: string;
  rating: number;
  phone: string;
  avatar: string;
};

const MAX_REQUEST_SECONDS = 60;
const DRIVER_POSITION: LatLngTuple = [34.0209, -6.8416];

const driverRequests: Trip[] = [
  {
    id: "AD345Jk758",
    origin: "266 Volkman Pass",
    destination: "054 Flo Glens",
    fare: 120,
    travelTimeMin: 18,
    distanceKm: 8.5,
    pickupCoords: [34.03, -6.85],
    destinationCoords: [34.01, -6.83],
    status: "pending",
    requestedAt: "2 min ago"
  },
  {
    id: "RE921Lm410",
    origin: "Medina Souk",
    destination: "Train Station",
    fare: 45,
    travelTimeMin: 10,
    distanceKm: 4.2,
    pickupCoords: [34.025, -6.835],
    destinationCoords: [34.010, -6.810],
    status: "pending",
    requestedAt: "4 min ago"
  }
];

function toLiveRequest(trip: Trip): LiveTripRequest {
  return {
    ...trip,
    remainingSeconds: MAX_REQUEST_SECONDS - Math.floor(Math.random() * 22),
    driverOffer: trip.fare,
  };
}

function getTouristProfile(trip: LiveTripRequest): TouristProfile {
  const profiles: TouristProfile[] = [
    { name: "Omar Vetrovs", rating: 4.8, phone: "+212600111222", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Omar" },
    { name: "Ruben Lubin", rating: 4.7, phone: "+212600333444", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ruben" },
    { name: "Amina Saeed", rating: 4.9, phone: "+212600555666", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amina" },
  ];
  const charCode = trip.id.charCodeAt(trip.id.length - 1) || 0;
  return profiles[charCode % profiles.length];
}

export default function DriverOrders() {
  const [activeTrip, setActiveTrip] = useState<LiveTripRequest | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requests, setRequests] = useState<LiveTripRequest[]>(() => driverRequests.map(toLiveRequest));

  // Simulated request logic
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRequests((current) =>
        current
          .map((r) => ({ ...r, remainingSeconds: Math.max(0, r.remainingSeconds - 1) }))
          .filter((r) => r.remainingSeconds > 0)
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedRequest = useMemo(() => requests.find(r => r.id === selectedRequestId), [requests, selectedRequestId]);
  
  const handleAccept = (req: LiveTripRequest) => {
    setActiveTrip(req);
    setRequests(current => current.filter(r => r.id !== req.id));
    setSelectedRequestId(null);
    toast.success("Order Accepted", { description: "Navigation started." });
  };

  if (activeTrip) {
    return (
      <DriverShell>
        <div className="h-full w-full relative flex flex-col font-sans text-slate-900 border-none scale-[1.02]">
          <MapContainer center={activeTrip.pickupCoords} zoom={13} zoomControl={false} className="absolute inset-0 z-0">
             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
             <Marker position={activeTrip.pickupCoords}><Popup>Pickup</Popup></Marker>
             <Marker position={activeTrip.destinationCoords}><Popup>Dropoff</Popup></Marker>
             <Polyline positions={[activeTrip.pickupCoords, activeTrip.destinationCoords]} pathOptions={{color: '#2563EB', weight: 6, opacity: 1}} />
             <MapController bounds={latLngBounds([activeTrip.pickupCoords, activeTrip.destinationCoords])} />
          </MapContainer>
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-6">
             <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 p-5 px-8 flex items-center justify-between">
                <div className="flex-1 pr-8">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ride in Progress</p>
                   <div className="h-3 w-full bg-slate-100/50 rounded-full overflow-hidden relative border border-slate-100">
                      <motion.div initial={{ width: "0%"}} animate={{ width: "45%"}} transition={{duration: 2}} className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                   </div>
                </div>
                <div className="flex-1 border-l border-slate-100 pl-8">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                   <div className="flex items-center gap-2">
                      <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-sm font-bold text-emerald-600">On Track</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-5xl px-6">
             <div className="bg-white/95 backdrop-blur-2xl rounded-[48px] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-white/80 grid md:grid-cols-3 gap-10 items-center">
                <div className="md:col-span-2 space-y-8">
                   <div className="flex justify-between items-end border-b border-slate-50 pb-8">
                      <div className="flex items-center gap-5">
                         <img src={getTouristProfile(activeTrip).avatar} className="size-16 rounded-[24px] border-4 border-white shadow-xl bg-slate-100" alt="Avatar"/>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                            <p className="font-black text-2xl text-slate-900 tracking-tight">{getTouristProfile(activeTrip).name}</p>
                         </div>
                      </div>
                      <button className="flex items-center gap-3 bg-blue-600 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
                        <Phone className="size-4" /> Call Client
                      </button>
                   </div>
                   
                   <div className="flex bg-slate-50/70 border border-slate-100 rounded-[32px] p-6 items-center">
                      <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 text-sm font-black text-slate-800">{activeTrip.origin.split(' ')[0]}</div>
                      <div className="flex-1 px-6 relative">
                         <div className="h-1 bg-slate-200 rounded-full">
                            <motion.div animate={{ left: ["0%", "100%"] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-1.5 size-4 border-4 border-white bg-blue-600 rounded-full shadow-lg" />
                         </div>
                      </div>
                      <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 text-sm font-black text-slate-400">{activeTrip.destination.split(' ')[0]}</div>
                   </div>
                   
                   <button onClick={() => setActiveTrip(null)} className="font-black text-xs px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                      Finish Trip
                   </button>
                </div>

                <div className="md:col-span-1 h-full rounded-[40px] overflow-hidden relative shadow-2xl grow min-h-[220px] bg-slate-950 border-4 border-white">
                   <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 scale-110 hover:scale-125 transition-all duration-1000" alt="Road view"/>
                   <div className="absolute top-5 left-5 flex items-center gap-2 bg-rose-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-white tracking-widest animate-pulse border border-rose-500/50">
                      LIVE FEED
                   </div>
                </div>
             </div>
          </div>
        </div>
      </DriverShell>
    );
  }

  return (
    <DriverShell>
      <div className="h-full w-full flex bg-transparent font-sans text-slate-900 overflow-hidden">
        
        <aside className="w-full md:w-[420px] shrink-0 bg-white border-r border-slate-100 flex flex-col z-20 shadow-[10px_0_40px_rgba(0,0,0,0.015)]">
           <div className="p-10 pb-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order List</h2>
              <div className="mt-8 relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                 <input placeholder="Find a request..." className="w-full h-14 pl-14 pr-6 rounded-[20px] border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-semibold"/>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-5">
              <AnimatePresence>
                {requests.map(req => {
                  const isSelected = selectedRequestId === req.id;
                  return (
                    <motion.div 
                      layout
                      initial={{opacity: 0, scale: 0.9}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.8}}
                      key={req.id} 
                      onClick={() => setSelectedRequestId(req.id)} 
                      className={`p-7 rounded-[32px] cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                        isSelected 
                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 -translate-y-1' 
                        : 'bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                       <div className="flex justify-between items-center mb-6">
                          <p className={`font-black text-xs uppercase tracking-widest ${isSelected ? 'text-blue-100 opacity-80' : 'text-slate-400'}`}>ID: #{req.id}</p>
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'}`}>
                             <Phone className={`size-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                          </div>
                       </div>
                       
                       <div className="relative pl-8 space-y-7">
                          <div className={`absolute left-0 top-2 bottom-2 w-0.5 border-l-2 border-dashed ${isSelected ? 'border-blue-200/40' : 'border-slate-200'}`} />
                          
                          <div className="relative">
                            <div className={`absolute -left-[35px] top-[4px] size-3.5 rounded-full border-4 ${isSelected ? 'bg-white border-blue-400' : 'bg-white border-slate-300'}`} />
                            <p className={`text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{req.origin}</p>
                            <p className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-blue-100 opacity-70' : 'text-slate-400'}`}>{req.requestedAt}</p>
                          </div>
                          
                          <div className="relative">
                            <div className={`absolute -left-[35px] top-[4px] size-3.5 rounded-full border-4 bg-white ${isSelected ? 'border-blue-200' : 'border-emerald-400'}`} />
                            <p className={`text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{req.destination}</p>
                            <p className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-blue-100 opacity-70' : 'text-slate-400'}`}>Arrival in --</p>
                          </div>
                       </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
           </div>
        </aside>

        <main className="flex-1 h-full bg-slate-50 relative overflow-hidden flex flex-col pt-4">
          {!selectedRequest ? (
             <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                <div className="size-24 bg-slate-200 rounded-[40px] flex items-center justify-center text-slate-400">
                   <ListTodo className="size-10" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900">Select an order</h3>
                   <p className="text-sm font-semibold text-slate-500">Pick a request from the sidebar to see details.</p>
                </div>
             </div>
          ) : (
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key={selectedRequest.id} className="h-full flex flex-col">
                <div className="p-10 pb-0">
                  <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-8">
                     <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Main Info</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Request Details #{selectedRequest.id}</p>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setSelectedRequestId(null)} className="px-8 h-12 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Close</button>
                        <button onClick={() => handleAccept(selectedRequest)} className="px-10 h-12 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">Accept Order</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative group overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                           <div className="flex items-center gap-5">
                              <img src={getTouristProfile(selectedRequest).avatar} className="size-16 rounded-[24px] bg-slate-50 border border-slate-100 shadow-lg" alt="Avatar" />
                              <div>
                                 <p className="font-black text-lg text-slate-800">{getTouristProfile(selectedRequest).name}</p>
                                 <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black bg-amber-50 px-2 py-0.5 rounded-lg w-fit mt-1">
                                    <Star className="size-3 fill-amber-500" /> {getTouristProfile(selectedRequest).rating}
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-4xl font-black text-slate-900 tracking-tight">{selectedRequest.fare}<span className="text-sm text-slate-400 ml-1.5 uppercase tracking-widest font-bold">MAD</span></p>
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Best Offer</p>
                           </div>
                        </div>

                        <div className="space-y-8 pl-10 relative">
                           <div className="absolute left-[13px] top-6 bottom-10 w-0 border-l-2 border-dashed border-slate-200" />
                           <div className="relative">
                              <div className="absolute -left-[35px] top-[4px] size-4 rounded-full border-4 border-slate-900 bg-white" />
                              <p className="font-black text-slate-900 text-lg mb-1">{selectedRequest.origin}</p>
                              <p className="text-xs font-bold text-slate-400">Pickup address</p>
                           </div>
                           <div className="relative">
                              <div className="absolute -left-[35px] top-[4px] size-4 rounded-full border-4 border-emerald-400 bg-white" />
                              <p className="font-black text-slate-900 text-lg mb-1">{selectedRequest.destination}</p>
                              <p className="text-xs font-bold text-slate-400">Destination drop off</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm p-4 h-full min-h-[300px]">
                        <MapContainer center={selectedRequest.pickupCoords} zoom={13} className="h-full w-full rounded-[32px]" zoomControl={false} scrollWheelZoom={false}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={selectedRequest.pickupCoords} />
                          <Marker position={selectedRequest.destinationCoords} />
                          <Polyline positions={[selectedRequest.pickupCoords, selectedRequest.destinationCoords]} pathOptions={{color: '#94A3B8', weight: 4, dashArray: '8, 12'}} />
                          <MapController bounds={latLngBounds([DRIVER_POSITION, selectedRequest.pickupCoords, selectedRequest.destinationCoords])} />
                        </MapContainer>
                     </div>
                  </div>
                </div>
             </motion.div>
          )}
        </main>
      </div>
    </DriverShell>
  );
}

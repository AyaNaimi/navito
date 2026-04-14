import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bus, Calculator, Car, Clock, Languages, MapPin,
  Navigation, Phone, Shield, Star,
  Train, TramFront, ArrowRight, Zap, ChevronRight, Calculator as CalcIcon,
  Sparkles, Route, Info, ArrowUpDown, Wallet, UserCheck, Timer,
  MapPinIcon, CalendarDays, Ticket, CreditCard
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Tabs, TabsTrigger } from '../components/ui/tabs';
import { drivers, transportOptions } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function Transport() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { authMode, city, exploreMode } = useAppContext();
  const [pickup, setPickup] = useState(city || '');
  const [destination, setDestination] = useState('');
  const [activeTab, setActiveTab] = useState('drivers');
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);

  // Mock public transport data
  const publicTransportLines = [
    {
      id: 'l1',
      type: 'tram',
      number: 'T1',
      name: 'Ligne 1 - Sidi Moussa \u2194 Hay Hassani',
      stops: ['Sidi Moussa', 'Casa Voyageurs', 'Maarif', 'Hay Hassani'],
      frequency: '5-8 min',
      price: 6,
      hours: '5h00 - 23h00',
      color: '#E30613',
    },
    {
      id: 'l2',
      type: 'tram',
      number: 'T2',
      name: 'Ligne 2 - Ain Diab \u2194 Sidi Bernoussi',
      stops: ['Ain Diab', 'Gare Casa Port', 'Boulevard', 'Sidi Bernoussi'],
      frequency: '6-10 min',
      price: 6,
      hours: '5h00 - 22h30',
      color: '#F39200',
    },
    {
      id: 'train1',
      type: 'train',
      number: 'ONCF',
      name: 'TNR - Rabat \u2194 Casa',
      stops: ['Rabat Ville', 'Salé', 'Mohammedia', 'Casa Voyageurs'],
      frequency: '30 min',
      price: 35,
      hours: '4h30 - 23h30',
      color: '#0066A1',
    },
    {
      id: 'bus1',
      type: 'bus',
      number: 'B15',
      name: 'Bus 15 - Centre Ville',
      stops: ['Médina', 'Jemaa el-Fna', 'Gueliz', 'Hivernage'],
      frequency: '15-20 min',
      price: 4,
      hours: '6h00 - 21h30',
      color: '#009639',
    },
  ];

  const taxiStations = [
    { id: 1, name: 'Station Jemaa el-Fna', distance: '0.5 km', available: 8 },
    { id: 2, name: 'Station Gueliz', distance: '1.2 km', available: 12 },
    { id: 3, name: 'Station Gare ONCF', distance: '2.0 km', available: 5 },
  ];

  const calculateRoute = (from: string, to: string) => {
    // Mock route calculation
    const basePrice = Math.floor(Math.random() * 50) + 20;
    const duration = Math.floor(Math.random() * 30) + 10;
    const distance = (Math.random() * 10 + 2).toFixed(1);

    return {
      from,
      to,
      distance,
      duration,
      price: basePrice,
      options: [
        { type: 'petit-taxi', label: 'Petit Taxi', price: basePrice, time: duration },
        { type: 'grand-taxi', label: 'Grand Taxi', price: Math.floor(basePrice * 1.5), time: duration - 5 },
        { type: 'bus', label: 'Bus', price: 4, time: duration + 15 },
      ],
    };
  };

  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.available), []);
  
  const { scrollY } = useScroll({ container: containerRef });
  const headerOpacity = useTransform(scrollY, [0, 80], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 80], [0, 20]);

  const handleRequestDriver = () => {
    if (authMode !== 'login') {
      navigate('/login?redirectTo=/transport');
      return;
    }
    toast.success('Driver request sent successfully');
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col pb-32 font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500" ref={containerRef}>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] -left-[5%] w-[45%] h-[45%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.header
        style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur}px)` }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border px-6 py-8"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent italic">Mobility</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="h-1 w-4 bg-accent rounded-full" />
              {exploreMode === 'city' && city ? `Reliable travel in ${city}` : 'Find your way with Navito'}
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary border border-border text-accent shadow-xl shadow-accent/5 transition-all"
          >
             <Navigation className="h-6 w-6" />
          </motion.div>
        </div>

        <div className="max-w-xl mx-auto mt-8">
          <div className="flex p-1.5 rounded-2xl bg-secondary border border-border w-full sm:w-fit backdrop-blur-xl">
            {['drivers', 'guide', 'simulator'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-foreground text-background shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'guide' ? 'Handbook' : tab}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'drivers' && (
            <motion.div key="drivers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <motion.div {...reveal} className="space-y-4 bg-card border border-border p-6 rounded-[2.5rem] shadow-2xl transition-all">
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <Input 
                    placeholder="Pickup location" 
                    value={pickup} 
                    onChange={(e) => setPickup(e.target.value)} 
                    className="h-14 rounded-2xl border border-border bg-secondary pl-12 text-[14px] font-medium text-foreground placeholder:text-muted-foreground focus:bg-background transition-all" 
                  />
                </div>
                <div className="relative group">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <Input 
                    placeholder="Destination" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)} 
                    className="h-14 rounded-2xl border border-border bg-secondary pl-12 text-[14px] font-medium text-foreground placeholder:text-muted-foreground focus:bg-background transition-all" 
                  />
                </div>
              </motion.div>

              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2 px-1">
                   <Zap className="h-3 w-3 text-accent fill-accent animate-pulse" />
                   Active Operators Nearby
                </p>
                
                {availableDrivers.map((driver, idx) => (
                  <motion.div 
                    key={driver.id}
                    {...reveal}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="group"
                  >
                    <Card className="rounded-[2.5rem] border border-border bg-card/50 p-6 shadow-2xl hover:bg-card hover:border-accent/10 transition-all cursor-pointer">
                      <div className="flex gap-6">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <img src={driver.image} alt={driver.name} className="h-full w-full rounded-2xl object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all border border-border" />
                          {driver.verified && (
                            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-foreground text-background shadow-xl border border-border">
                              <Shield className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[16px] font-black text-foreground group-hover:text-accent transition-colors uppercase tracking-tight truncate">
                              {driver.name}
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/10 border border-accent/10">
                              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                              <span className="text-[12px] font-black text-accent">{driver.rating}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Badge className="bg-secondary text-muted-foreground group-hover:bg-foreground group-hover:text-background h-7 rounded-xl transition-all border-none font-black text-[9px] uppercase tracking-widest px-3">
                              {driver.vehicleType}
                            </Badge>
                            <span className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {driver.distance} KM
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                            <div className="text-[16px] font-black text-foreground uppercase tracking-tight">
                              {driver.pricePerKm} <span className="text-[10px] text-muted-foreground font-bold ml-1">MAD/KM</span>
                            </div>
                            <div className="flex gap-2">
                              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-foreground border border-border hover:bg-muted transition-all">
                                <Phone className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={handleRequestDriver} 
                                className="h-10 px-6 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-foreground/5"
                              >
                                Request
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {/* Route Calculator */}
              <motion.div {...reveal} className="bg-card border border-border rounded-[2rem] p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Route className="h-5 w-5 text-accent" />
                  <h3 className="text-[15px] font-black uppercase tracking-widest italic">Planifier un trajet</h3>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500" />
                    <Input
                      placeholder="Point de départ"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-secondary border-border"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => { const t = pickup; setPickup(destination); setDestination(t); }}
                      className="p-2 rounded-xl bg-secondary hover:bg-muted transition-all"
                    >
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
                    <Input
                      placeholder="Destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (!pickup || !destination) {
                      toast.error('Veuillez entrer les deux adresses');
                      return;
                    }
                    const route = calculateRoute(pickup, destination);
                    setSelectedRoute(route);
                    setShowRoutePlanner(true);
                  }}
                  className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[12px]"
                >
                  Calculer l'itinéraire
                </Button>
              </motion.div>

              {/* Transport Lines */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground px-1 flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Lignes de Transport
                </p>

                {publicTransportLines.map((line, idx) => (
                  <motion.div
                    key={line.id}
                    {...reveal}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedTransport(selectedTransport === line.id ? null : line.id)}
                    className="cursor-pointer"
                  >
                    <Card className={`rounded-[2rem] border p-5 transition-all ${selectedTransport === line.id ? 'bg-accent/5 border-accent/30' : 'border-border bg-card'}`}>
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg"
                          style={{ backgroundColor: line.color }}
                        >
                          {line.number}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[14px]">{line.name}</h4>
                          <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              {line.frequency}
                            </span>
                            <span className="flex items-center gap-1">
                              <Wallet className="h-3 w-3" />
                              {line.price} MAD
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedTransport === line.id ? 'rotate-90' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {selectedTransport === line.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-border">
                              <div className="flex items-center gap-2 mb-3 text-[11px]">
                                <Clock className="h-4 w-4 text-accent" />
                                <span>Horaires: {line.hours}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {line.stops.map((stop) => (
                                  <span
                                    key={stop}
                                    className="px-3 py-1.5 rounded-full bg-secondary text-[11px] font-medium"
                                  >
                                    {stop}
                                  </span>
                                ))}
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Horaires de la ${line.name} consultés`);
                                }}
                                variant="outline"
                                className="w-full mt-4 h-11 rounded-xl text-[11px] font-bold uppercase"
                              >
                                Voir les prochains passages
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Taxi Stations */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground px-1 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Stations de Taxi à proximité
                </p>

                {taxiStations.map((station, idx) => (
                  <motion.div
                    key={station.id}
                    {...reveal}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <Card className="rounded-[2rem] border border-border bg-card p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Car className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px]">{station.name}</h4>
                          <p className="text-[11px] text-muted-foreground">{station.distance} • {station.available} taxis disponibles</p>
                        </div>
                      </div>
                      <Button size="sm" className="rounded-xl h-10 px-4 text-[11px] font-bold">
                        Y aller
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Price Reference */}
              <motion.div {...reveal} className="bg-card border border-border rounded-[2rem] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-accent" />
                  <h3 className="text-[14px] font-black uppercase tracking-widest italic">Tarifs de référence</h3>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Petit Taxi (jour)</span>
                    <span className="font-bold">1.40 MAD/km</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Petit Taxi (nuit)</span>
                    <span className="font-bold">2.10 MAD/km (+50%)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Grand Taxi (inter-ville)</span>
                    <span className="font-bold">Fixé par trajet</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Bus / Tramway</span>
                    <span className="font-bold">4-6 MAD</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div 
              key="simulator"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-10 bg-card p-10 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden transition-all"
            >
              <div className="absolute top-0 right-0 size-32 bg-accent/5 blur-3xl rounded-full" />
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-foreground border border-foreground shadow-2xl"
              >
                <Calculator className="h-12 w-12 text-background" />
              </motion.div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Fare Estimator Pro</h3>
                <p className="mx-auto max-w-[280px] text-[13px] text-muted-foreground leading-relaxed font-medium">
                  Calculate precise transportation costs based on live local city algorithms.
                </p>
              </div>
              <button 
                onClick={() => navigate('/taxi-simulator')} 
                className="h-14 px-10 bg-foreground text-background rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-foreground/5 hover:bg-accent hover:text-white transition-all transition-colors duration-500"
              >
                Launch Simulator
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />

      {/* Route Planner Modal */}
      <AnimatePresence>
        {showRoutePlanner && selectedRoute && (
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
              className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest italic">Itinéraire</h2>
                  <p className="text-[13px] text-muted-foreground">{selectedRoute.distance} km • {selectedRoute.duration} min</p>
                </div>
                <button
                  onClick={() => setShowRoutePlanner(false)}
                  className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center"
                >
                  <Zap className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-[14px] font-medium truncate">{selectedRoute.from}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-[14px] font-medium truncate">{selectedRoute.to}</p>
                </div>
              </div>

              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4">Options de transport</p>

              <div className="space-y-3">
                {selectedRoute.options.map((option: any, idx: number) => (
                  <motion.div
                    key={option.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-secondary/30 transition-all cursor-pointer"
                    onClick={() => {
                      toast.success(`${option.label} sélectionné`);
                      setShowRoutePlanner(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        option.type === 'petit-taxi' ? 'bg-accent/10 text-accent' :
                        option.type === 'grand-taxi' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {option.type === 'bus' ? <Bus className="h-5 w-5" /> : <Car className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{option.label}</p>
                        <p className="text-[12px] text-muted-foreground">{option.time} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-accent">{option.price} MAD</p>
                      <p className="text-[10px] text-muted-foreground">Estimé</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowRoutePlanner(false)}
                  className="flex-1 h-12 rounded-2xl text-[12px] font-bold uppercase"
                >
                  Modifier
                </Button>
                <Button
                  onClick={() => {
                    toast.success('Itinéraire sauvegardé !');
                    setShowRoutePlanner(false);
                  }}
                  className="flex-1 h-12 rounded-2xl bg-foreground text-background text-[12px] font-bold uppercase hover:bg-accent hover:text-white transition-all"
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
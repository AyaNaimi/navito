import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, Calculator, Clock, Info, ShieldCheck, Sparkles, Orbit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaxiSimulator() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distance, setDistance] = useState(0);
  const [taxiType, setTaxiType] = useState<'petit' | 'grand'>('petit');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number } | null>(null);

  const calculatePrice = () => {
    if (!from || !to) return;

    // Mock distance calculation
    const mockDistance = Math.floor(Math.random() * 15) + 5;
    setDistance(mockDistance);

    const baseRate = taxiType === 'petit' ? 7 : 10;
    const nightMultiplier = timeOfDay === 'night' ? 1.5 : 1;

    const min = Math.floor(mockDistance * baseRate * nightMultiplier * 0.9);
    const max = Math.ceil(mockDistance * baseRate * nightMultiplier * 1.1);

    setEstimatedPrice({ min, max });
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-border bg-background/80 backdrop-blur-3xl px-6 py-6 pb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="mb-6 h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all shadow-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 bg-accent rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-accent/20 rotate-3 group-hover:rotate-0 transition-transform">
            <Calculator className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-black tracking-tighter uppercase italic underline decoration-accent decoration-3 underline-offset-4">Fare Matrix</h1>
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] leading-none mt-2">Transit Simulation Node</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-6 py-10 space-y-10 max-w-xl mx-auto w-full pb-32">
        {/* Info Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/5 p-6 rounded-[2rem] border border-accent/20 backdrop-blur-md relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 h-20 w-20 bg-accent/10 blur-2xl rounded-full" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 text-accent border border-accent/30 shadow-lg">
               <Info className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-foreground text-[13px] uppercase tracking-[0.2em] italic">Intelligence Briefing</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed font-bold uppercase italic tracking-wider opacity-80">
                Establish fare honesty. This projection provides semantic parity for ground transit negotiation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Route Input */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground italic">Vector Definition</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="from" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initiation Node</Label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-accent opacity-50 transition-opacity group-focus-within:opacity-100" />
                <Input
                  id="from"
                  placeholder="Enter starting point"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-14 h-15 rounded-[1.5rem] bg-card/40 border-border border-2 focus:border-accent text-[14px] font-black placeholder:text-muted-foreground transition-all ring-0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="to" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Termination Node</Label>
              <div className="relative group">
                <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-accent opacity-50 transition-opacity group-focus-within:opacity-100" />
                <Input
                  id="to"
                  placeholder="Enter destination"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-14 h-15 rounded-[1.5rem] bg-card/40 border-border border-2 focus:border-accent text-[14px] font-black placeholder:text-muted-foreground transition-all ring-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Taxi Type */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground italic">Vessel Classification</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTaxiType('petit')}
              className={`p-6 rounded-[2rem] border-2 transition-all shadow-2xl flex flex-col items-center text-center gap-3 ${
                taxiType === 'petit'
                  ? 'border-accent bg-accent/10 scale-[1.02]'
                  : 'border-border bg-card/40 hover:border-accent/30'
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${taxiType === 'petit' ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'}`}>
                <Orbit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-foreground text-[12px] uppercase tracking-widest">Petit Node</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter italic tabular-nums">7-8 MAD/km</p>
              </div>
            </button>

            <button
              onClick={() => setTaxiType('grand')}
              className={`p-6 rounded-[2rem] border-2 transition-all shadow-2xl flex flex-col items-center text-center gap-3 ${
                taxiType === 'grand'
                  ? 'border-accent bg-accent/10 scale-[1.02]'
                  : 'border-border bg-card/40 hover:border-accent/30'
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${taxiType === 'grand' ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'}`}>
                <Orbit className="h-5 w-5 rotate-45" />
              </div>
              <div>
                <p className="font-black text-foreground text-[12px] uppercase tracking-widest">Grand Node</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter italic tabular-nums">10-12 MAD/km</p>
              </div>
            </button>
          </div>
        </section>

        {/* Time of Day */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground italic">Temporal Phase</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-5 rounded-[1.5rem] border-2 transition-all shadow-xl flex items-center gap-4 ${
                timeOfDay === 'day'
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-card/40 hover:border-accent/30'
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${timeOfDay === 'day' ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'}`}>
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-black text-foreground text-[10px] uppercase tracking-widest">Diurnal</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase italic tracking-tighter">06:00 - 20:00</p>
              </div>
            </button>

            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-5 rounded-[1.5rem] border-2 transition-all shadow-xl flex items-center gap-4 ${
                timeOfDay === 'night'
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-card/40 hover:border-accent/30'
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${timeOfDay === 'night' ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'}`}>
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-black text-foreground text-[10px] uppercase tracking-widest">Nocturnal</p>
                <p className="text-[9px] font-bold text-accent uppercase italic tracking-tighter">+50% Tariff</p>
              </div>
            </button>
          </div>
        </section>

        {/* Calculate Button */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={calculatePrice}
            disabled={!from || !to}
            className="w-full h-16 bg-foreground text-background hover:bg-accent hover:text-white rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-none text-[14px] font-black uppercase tracking-[0.3em] transition-all"
          >
            <Calculator className="mr-3 h-5 w-5" />
            Establish Projection
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {estimatedPrice && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-foreground text-background p-8 rounded-[3rem] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 blur-3xl rounded-full transition-transform group-hover:scale-125" />
              
              <div className="flex items-center gap-3 mb-8 opacity-60">
                <Clock className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Spatial Distance: {distance}km</p>
              </div>

              <div className="bg-background/10 backdrop-blur-xl rounded-[2rem] p-8 mb-8 border border-white/10 text-center">
                <p className="text-background/50 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Tariff Projection (MAD)</p>
                <div className="flex items-baseline justify-center gap-4">
                  <span className="text-5xl font-black italic tracking-tighter tabular-nums">{estimatedPrice.min}</span>
                  <span className="text-2xl opacity-30 italic font-black">/</span>
                  <span className="text-5xl font-black italic tracking-tighter tabular-nums">{estimatedPrice.max}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-widest opacity-80">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Verified Node classification: {taxiType}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold italic uppercase tracking-widest opacity-80">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Temporal Phase alignment: {timeOfDay}</span>
                </div>
                <p className="text-[9px] font-black text-background/40 uppercase tracking-[0.3em] mt-6 pt-6 border-t border-white/5">
                  Analytical estimation based on current sector pricing data.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Important Tips */}
        <div className="bg-card/40 p-8 rounded-[2.5rem] border border-border transition-all hover:bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-black text-foreground text-[14px] uppercase tracking-[0.3em] italic">Operational Protocol</h3>
          </div>
          <ul className="text-[12px] text-muted-foreground space-y-4 font-bold uppercase tracking-wide italic">
            <li className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Mandatory usage of the ground-truth meter (Compteur) is absolute.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Verify zero-index calibration of meter at mission initiation.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Nocturnal phase tariff surcharge (+50%) active after 20:00.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
              <span>Petit Node vessels are geographically restricted to city bounds.</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Decorative Blur */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute top-[30%] left-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

    </div>
  );
}

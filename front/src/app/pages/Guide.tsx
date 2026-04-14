import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { guides } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BadgeCheck, Languages, MapPin, MessageCircle, Phone, Star, UserRound, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Guide() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authMode, city, exploreMode, userRole } = useAppContext();

  const activeCity = city || 'Marrakech';
  const availableGuides = useMemo(() => {
    const sameCityGuides = guides.filter((guide) => guide.available && guide.city === activeCity);
    return sameCityGuides.length > 0 ? sameCityGuides : guides.filter((guide) => guide.available);
  }, [activeCity]);

  const handleRequestGuide = (guideId: number) => {
    if (authMode !== 'login') {
      navigate(`/login?redirectTo=${encodeURIComponent(`/guide/request/${guideId}`)}`);
      return;
    }
    if (userRole !== 'tourist') {
      toast.error('This request flow is reserved for tourists');
      return;
    }
    navigate(`/guide/request/${guideId}`);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col pb-24 font-sans antialiased text-foreground overflow-x-hidden transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-6 transition-all">
        <div className="max-w-xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-sans">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2 flex items-center gap-2 italic">
               <Sparkles className="h-3 w-3" />
               Expert Network
            </p>
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent italic">Verified Hosts</h1>
            <p className="text-[12px] font-medium text-muted-foreground mt-2 leading-relaxed opacity-80">
              {exploreMode === 'city' && city
                ? `Coordinating localized expertise in ${city}`
                : 'Connect with specialized hosts in your current sector'}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-8">
        {/* Verification Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 rounded-2xl border border-border bg-card/50 p-6 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary border border-border text-accent shrink-0 shadow-lg">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <div className="font-sans">
              <h2 className="text-[14px] font-black text-foreground uppercase tracking-tight italic">Protocol Integrity Network</h2>
              <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed font-medium">
                Every guide in the Navito sector undergoes rigorous identity verification and domain expertise validation to ensure your security parameters.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Available Personnel</p>
          {availableGuides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] as any }}
            >
              <Card className="rounded-[2.5rem] border border-border bg-card/40 p-6 shadow-xl transition-all hover:bg-card hover:border-accent/10 group cursor-pointer relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 blur-3xl rounded-full" />
                <div className="flex gap-6 relative z-10">
                  <div className="relative shrink-0">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden border border-border bg-muted">
                      <img src={guide.image} alt={guide.name} className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    {guide.verified && (
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-card bg-foreground text-background shadow-xl">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-4 font-sans">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[17px] font-black text-foreground uppercase tracking-tight italic truncate group-hover:text-accent transition-colors">
                          {guide.name}
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-1">{guide.city}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="text-[13px] font-black text-accent">{guide.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-black uppercase tracking-tight text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="truncate">{guide.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-accent" />
                        <span>{guide.experience} Exp.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <Languages className="h-4 w-4 text-muted-foreground/40" />
                      {guide.languages.join(' · ')}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-border mt-2">
                      <div className="text-[16px] font-black text-foreground uppercase tracking-tight tabular-nums">
                        {guide.pricePerHalfDay} <span className="text-[10px] text-muted-foreground block font-bold mt-0.5 tracking-normal normal-case opacity-60">MAD / Half Day Protocol</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-secondary text-foreground hover:bg-muted transition-all">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-secondary text-foreground hover:bg-muted transition-all">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleRequestGuide(guide.id)} 
                          className="h-10 px-6 bg-foreground text-background rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-foreground/5 outline-none font-sans"
                        >
                          Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

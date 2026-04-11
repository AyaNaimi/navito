import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { guides } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BadgeCheck, Languages, MapPin, MessageCircle, Phone, Star, UserRound } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col pb-24 font-sans antialiased text-[#171717]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5] px-6 py-6 transition-all">
        <div className="max-w-xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#737373] mb-1">Local Network</p>
            <h1 className="text-[20px] font-bold tracking-tight">Expert Guides</h1>
            <p className="text-[12px] font-medium text-[#737373] mt-1">
              {exploreMode === 'city' && city
                ? `Find verified local experts in ${city}`
                : 'Connect with hosts in your current area'}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-8">
        {/* Verification Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F5F7] border border-[#E5E5E5] text-[#171717] shrink-0">
              <BadgeCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[#171717]">Vetted Identity Network</h2>
              <p className="mt-1 text-[12px] text-[#737373] leading-relaxed font-medium">
                Every guide in the Navito network undergoes identity verification and expertise validation to ensure your security.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373] ml-1">Available Hosts</p>
          {availableGuides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] as any }}
            >
              <Card className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition-all hover:bg-[#F5F5F7] group">
                <div className="flex gap-5">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-[#E5E5E5]">
                      <img src={guide.image} alt={guide.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    {guide.verified && (
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#171717] shadow-sm">
                        <BadgeCheck className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#171717]">{guide.name}</h3>
                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">{guide.city}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F5F5F7] px-2 py-0.5 rounded-lg border border-[#E5E5E5]/50">
                        <Star className="h-3 w-3 fill-[#171717] text-[#171717]" />
                        <span className="text-[12px] font-bold">{guide.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-[#737373]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#171717]" />
                        <span>{guide.specialty}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="h-3.5 w-3.5 text-[#171717]" />
                        <span>{guide.experience} Exp.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#A3A3A3]">
                      <Languages className="h-3.5 w-3.5" />
                      {guide.languages.join(' · ')}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F7]">
                      <div className="text-[13px] font-bold">
                        {guide.pricePerHalfDay} <span className="text-[10px] text-[#737373]">MAD / Half Day</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[#E5E5E5] hover:bg-white group-hover:bg-white">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[#E5E5E5] hover:bg-white group-hover:bg-white">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          onClick={() => handleRequestGuide(guide.id)} 
                          className="h-9 px-5 bg-[#171717] text-white rounded-full text-[11px] font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all"
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

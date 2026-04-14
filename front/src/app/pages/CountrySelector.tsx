import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Globe2, MapPinned, Sparkles, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import { supportedCountries } from '../data/locationData';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const reveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
};

export default function CountrySelector() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { country, setCountry, useCurrentLocation } = useAppContext();

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    navigate('/city');
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground overflow-hidden relative transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-500/10 blur-[130px] rounded-full" />
      </div>

      <header className="px-6 pt-16 pb-12 max-w-xl mx-auto w-full relative z-10">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)} 
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary border border-border text-foreground mb-8 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-foreground border border-foreground shadow-2xl"
          >
            <Globe2 className="h-8 w-8 text-background" />
          </motion.div>
          <motion.div {...reveal}>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic">{t('country.title')}</h1>
            <p className="mt-4 text-[13px] font-medium text-muted-foreground max-w-[280px] leading-relaxed">
              {t('country.subtitle')}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 px-6 max-w-xl mx-auto w-full pb-32 relative z-10 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {supportedCountries.map((item, index) => (
            <motion.button
              key={item.code}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.05 }}
              onClick={() => handleCountrySelect(item.englishName)}
              className={`group flex w-full items-center justify-between rounded-[2rem] border px-6 py-6 transition-all outline-none ${
                country === item.englishName 
                  ? 'border-foreground bg-foreground text-background scale-[1.02] shadow-[0_20px_40px_rgba(0,0,0,0.1)]' 
                  : 'border-border bg-card/50 text-foreground hover:border-accent/20 hover:bg-card shadow-sm'
              }`}
            >
              <div className="flex items-center gap-6">
                 <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[11px] font-black tracking-widest transition-all ${
                   country === item.englishName 
                    ? 'bg-background text-foreground' 
                    : 'bg-secondary text-muted-foreground group-hover:bg-muted'
                 }`}>
                  {item.code}
                </div>
                <div className="text-left font-sans">
                  <p className="text-[16px] font-black uppercase tracking-tight">{item.name}</p>
                  <p className={`mt-1 text-[12px] font-medium ${country === item.englishName ? 'text-background/60' : 'text-muted-foreground'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 transition-all ${country === item.englishName ? 'text-background/40' : 'text-muted-foreground/40'} group-hover:translate-x-1`} />
            </motion.button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 z-40">
        <div className="max-w-xl mx-auto">
          <div className="p-2 rounded-[2.5rem] bg-background/40 backdrop-blur-3xl border border-border shadow-2xl">
            <Button
              className="h-16 w-full rounded-[2rem] bg-foreground text-background hover:bg-accent hover:text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all group shadow-2xl border-none"
              onClick={() => {
                useCurrentLocation();
                navigate('/explore');
              }}
            >
              <Navigation className="mr-3 h-4 w-4 text-accent" />
              {t('country.continueMap')}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

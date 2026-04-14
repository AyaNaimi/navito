import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MapPinned, Navigation, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { supportedCitiesByCountry } from '../data/locationData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const reveal = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
};

export default function CitySelector() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { country, city, setCity, useCurrentLocation } = useAppContext();
  const [isLocating, setIsLocating] = useState(false);

  console.log('CitySelector render:', { country, city, cities });

  const cities = supportedCitiesByCountry[country] ?? [];

  const handleCitySelect = (cityName: string) => {
    console.log('Selecting city:', cityName);
    setCity(cityName);
    navigate('/home');
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      useCurrentLocation();
      navigate('/explore');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        useCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
        navigate('/explore');
      },
      () => {
        useCurrentLocation();
        navigate('/explore');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans antialiased text-foreground overflow-hidden relative transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-500/10 blur-[130px] rounded-full" />
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

        <div className="space-y-6 font-sans">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-foreground border border-foreground shadow-2xl"
          >
            <MapPin className="h-8 w-8 text-background" />
          </motion.div>
          <motion.div {...reveal}>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic underline decoration-accent decoration-4">
              {cities.length ? t('city.title', 'Choose Hub') : t('city.noCityAvailable', 'Expansion Ongoing')}
            </h1>
            <p className="mt-4 text-[13px] font-medium text-muted-foreground max-w-[280px] leading-relaxed">
              {cities.length
                ? t('city.availableForCountry', `Active sectors in ${country}`)
                : t('city.unavailableForCountry', `Scanning for infrastructure in ${country}`)}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 px-6 max-w-xl mx-auto w-full pb-32 relative z-10 overflow-y-auto">
        <div className="grid grid-cols-1 gap-6">
          {cities.length > 0 ? (
            cities.map((item, index) => (
              <motion.button
                key={item.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.05 }}
                onClick={() => handleCitySelect(item.name)}
                className={`group flex w-full items-center gap-6 rounded-[2.5rem] border p-5 transition-all outline-none ${
                    city === item.name 
                    ? 'border-foreground bg-foreground text-background scale-[1.02] shadow-[0_20px_40px_rgba(0,0,0,0.15)]' 
                    : 'border-border bg-card/50 text-foreground hover:border-accent/20 hover:bg-card shadow-sm'
                }`}
              >
                <div className="h-28 w-28 overflow-hidden rounded-[1.5rem] flex-shrink-0 border border-border bg-muted">
                  <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex-1 text-left min-w-0 font-sans">
                  <div className="flex items-center gap-2 text-accent mb-1 underline decoration-accent/30">
                    <Sparkles className="h-3 w-3 fill-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Hub</span>
                  </div>
                  <h3 className="text-[18px] font-black uppercase tracking-tight truncate">{item.name}</h3>
                  <p className={`mt-2 text-[12px] font-medium leading-relaxed line-clamp-2 ${city === item.name ? 'text-background/70' : 'text-muted-foreground'}`}>
                    {t('city.cityDescription', 'Premium curated experiences and local coordination.')}
                  </p>
                </div>
              </motion.button>
            ))
          ) : (
            <motion.div {...reveal} className="rounded-[2.5rem] border border-dashed border-border bg-card/30 p-12 text-center shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border text-muted-foreground transition-all">
                <MapPinned className="h-8 w-8" />
              </div>
              <p className="text-lg font-black text-foreground uppercase tracking-tight italic">{t('city.useMapTitle', 'Global Discovery')}</p>
              <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed font-medium">
                {t('city.useMapDesc', 'Current Hub is not yet active. Switch to Global Map Protocol to proceed.')}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 z-40">
        <div className="max-w-xl mx-auto">
          <div className="p-2 rounded-[2.5rem] bg-background/40 backdrop-blur-3xl border border-border shadow-2xl">
            <Button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="h-16 w-full rounded-[2rem] bg-foreground text-background hover:bg-accent hover:text-white font-black text-[11px] uppercase tracking-[0.25em] transition-all group shadow-2xl disabled:opacity-50 border-none"
            >
              <Navigation className={`mr-3 h-4 w-4 ${isLocating ? 'animate-spin' : 'text-background'}`} />
              {isLocating ? t('city.locating', 'Locating Hub...') : t('city.chooseMapBtn', 'Global Protocol')}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="tourism-splash size-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="tourism-orb tourism-orb-a" />
        <div className="tourism-orb tourism-orb-b" />
        <div className="tourism-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
            className="tourism-glass-panel w-full max-w-sm rounded-[34px] px-6 py-10"
        >
          <motion.div
            animate={{ rotate: [0, 6, -6, 0], y: [0, -4, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[24px] bg-white/14 shadow-[0_18px_50px_-20px_rgba(255,255,255,0.4)] backdrop-blur-xl"
          >
            <Compass className="h-8 w-8" />
          </motion.div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/65">Premium Travel Companion</p>
          <h1 className="font-heading text-6xl font-semibold tracking-[-0.04em]">Navito</h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-white/78">
            Experiences raffinees, itineraire intelligent et ambiance luxe pour explorer chaque destination.
          </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
            <Sparkles className="h-3.5 w-3.5" />
            Curated journeys
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingSteps = [
  { text: 'Initializing', progress: 25 },
  { text: 'Loading experiences', progress: 50 },
  { text: 'Preparing your journey', progress: 75 },
  { text: 'Almost ready', progress: 100 },
];

export default function SplashScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Progress through loading steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 600);

    // Navigate after animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => navigate('/onboarding'), 400);
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, [navigate]);

  const currentLoading = loadingSteps[currentStep];

  return (
    <div className="tourism-splash size-full overflow-hidden relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] bg-gradient-to-br from-orange-500/20 to-amber-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-1/4 -left-1/4 w-[70%] h-[70%] bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-[120px] rounded-full"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Glass panel */}
          <div className="relative rounded-[34px] bg-white/10 backdrop-blur-2xl border border-white/15 px-8 py-12 shadow-2xl">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-[34px] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Logo animation */}
            <motion.div
              animate={{
                rotate: [0, 3, -3, 0],
                y: [0, -6, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.5)]"
            >
              <Compass className="h-10 w-10 text-white" strokeWidth={1.5} />
            </motion.div>

            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-white/50">Premium Travel Companion</p>
              <h1 className="text-6xl font-black tracking-tight text-white">Navito</h1>
              <p className="mx-auto mt-5 max-w-xs text-[13px] leading-relaxed text-white/60 font-medium">
                Your intelligent guide to curated experiences and seamless journeys
              </p>
            </motion.div>

            {/* Loading progress */}
            <div className="mt-10">
              <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentLoading.progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                />
              </div>
              <motion.p
                key={currentLoading.text}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40"
              >
                {currentLoading.text}
              </motion.p>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-200/80"
            >
              <Globe className="h-3.5 w-3.5" />
              Worldwide experiences
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

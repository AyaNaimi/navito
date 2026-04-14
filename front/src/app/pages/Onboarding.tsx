import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';
import { hapticFeedback } from '../components/ui/utils';
import img1 from '../../assets/b936e34de051bc299deaad6dc888364043138630.png';

const slideMeta = [
  { icon: Sparkles, eyebrow: 'Luxury Curation', accent: 'from-orange-500/20 via-orange-500/10 to-transparent', glow: 'shadow-orange-500/20' },
  { icon: Compass, eyebrow: 'Smart Navigation', accent: 'from-blue-500/20 via-blue-500/10 to-transparent', glow: 'shadow-blue-500/20' },
  { icon: ShieldCheck, eyebrow: 'Trust & Comfort', accent: 'from-emerald-500/20 via-emerald-500/10 to-transparent', glow: 'shadow-emerald-500/20' },
];

const getSlides = (t: any) => [
  {
    title: t('onboarding.slide1Title', 'Signature Voyages'),
    description: t('onboarding.slide1Desc', 'Discover curated journeys tailored to your style.'),
    image: img1,
    kicker: 'Voyages signatures',
  },
  {
    title: t('onboarding.slide2Title', 'Fluid Movements'),
    description: t('onboarding.slide2Desc', 'Seamless navigation through every destination.'),
    image: img1,
    kicker: 'Mouvements fluides',
  },
  {
    title: t('onboarding.slide3Title', 'Local Serenity'),
    description: t('onboarding.slide3Desc', 'Safety and comfort at every experience.'),
    image: img1,
    kicker: 'Serenite sur place',
  },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const slides = getSlides(t);
  const meta = slideMeta[currentSlide];
  const Icon = meta.icon;

  const handleNext = () => {
    hapticFeedback('light');
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((value) => value + 1);
      return;
    }
    navigate('/language');
  };

  const handleSkip = () => {
    hapticFeedback('light');
    navigate('/language');
  };

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 0.92,
      y: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 1.08,
      y: dir > 0 ? -40 : 40,
    }),
  };

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden relative transition-colors duration-500">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative flex h-full flex-col px-5 pb-10 pt-12 max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-xl border border-border/50 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground shadow-lg"
          >
            Navito
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleSkip}
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground active:scale-95 px-4 py-2 rounded-full hover:bg-secondary/50"
          >
            {t('common.skip', 'Skip')}
          </motion.button>
        </div>

        {/* Main Slide Content */}
        <div className="flex flex-1 flex-col justify-center py-4">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl p-2">
                <div className={`relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br ${meta.accent} p-1 shadow-xl ${meta.glow}`}>
                  <div className="relative overflow-hidden rounded-[2rem] bg-muted aspect-[3/4] sm:aspect-[4/5]">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="h-full w-full object-cover grayscale-[0.2] contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                    {/* Floating kicker badge */}
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/30 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-lg"
                    >
                      {slides[currentSlide].kicker}
                    </motion.div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-foreground font-sans">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-5 flex items-center gap-3"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-foreground to-foreground/80 text-background shadow-xl">
                          <Icon className="h-5 w-5" strokeWidth={2.5} />
                        </span>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-accent italic">{meta.eyebrow}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Premium Experience</p>
                        </div>
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[1.9rem] sm:text-[2.2rem] font-black leading-[1.15] tracking-tighter uppercase text-foreground drop-shadow-lg"
                      >
                        {slides[currentSlide].title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted-foreground font-medium"
                      >
                        {slides[currentSlide].description}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 space-y-6">
          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  hapticFeedback('light');
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                }}
                className="relative h-2 rounded-full overflow-hidden"
                initial={false}
                animate={{
                  width: index === currentSlide ? 36 : 10,
                  backgroundColor: index === currentSlide ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  opacity: index === currentSlide ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleNext}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-foreground to-foreground/90 text-background text-[12px] font-black uppercase tracking-[0.2em] transition-all hover:to-accent hover:shadow-xl hover:shadow-foreground/20 active:scale-[0.98] border-none shadow-lg"
          >
            {currentSlide === slides.length - 1 ? t('onboarding.start', 'Get Started') : t('common.continue', 'Continue')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

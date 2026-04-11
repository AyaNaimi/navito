import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';
import img1 from '../../assets/b936e34de051bc299deaad6dc888364043138630.png';

const slideMeta = [
  { icon: Sparkles, eyebrow: 'Luxury Curation', accent: 'from-cyan-500 via-sky-500 to-blue-100' },
  { icon: Compass, eyebrow: 'Smart Navigation', accent: 'from-teal-500 via-cyan-500 to-cyan-200' },
  { icon: ShieldCheck, eyebrow: 'Trust & Comfort', accent: 'from-sky-700 via-cyan-600 to-blue-200' },
];

const getSlides = (t: any) => [
  {
    title: t('onboarding.slide1Title'),
    description: t('onboarding.slide1Desc'),
    image: img1,
    kicker: 'Voyages signatures',
  },
  {
    title: t('onboarding.slide2Title'),
    description: t('onboarding.slide2Desc'),
    image: img1,
    kicker: 'Mouvements fluides',
  },
  {
    title: t('onboarding.slide3Title'),
    description: t('onboarding.slide3Desc'),
    image: img1,
    kicker: 'Serenite sur place',
  },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = getSlides(t);
  const meta = slideMeta[currentSlide];
  const Icon = meta.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((value) => value + 1);
      return;
    }

    navigate('/language');
  };

  return (
    <div className="tourism-bg size-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="tourism-blob tourism-blob-1" />
        <div className="tourism-blob tourism-blob-2" />
        <div className="tourism-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative flex h-full flex-col px-5 pb-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="tourism-pill text-[11px] uppercase tracking-[0.25em] text-slate-700">Navito Journey</div>
          <button onClick={() => navigate('/language')} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            {t('common.skip')}
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.2, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-md"
            >
              <div className="tourism-editorial-card overflow-hidden rounded-[36px] p-4">
                <div className={`relative overflow-hidden rounded-[30px] bg-gradient-to-br ${meta.accent} p-[1px]`}>
                  <div className="relative overflow-hidden rounded-[29px] bg-[#f0f9ff]">
                    <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="h-[350px] w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08131fcc] via-[#08131f3d] to-transparent" />
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/16 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md"
                    >
                      {slides[currentSlide].kicker}
                    </motion.div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 backdrop-blur-md">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">{meta.eyebrow}</p>
                          <p className="text-sm font-medium text-white/88">Tourisme premium et local</p>
                        </div>
                      </div>

                      <h2 className="font-heading text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em]">
                        {slides[currentSlide].title}
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-white/78">{slides[currentSlide].description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-5 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  width: index === currentSlide ? 38 : 10,
                  opacity: index === currentSlide ? 1 : 0.45,
                }}
                transition={{ duration: 0.3 }}
                className={`h-2 rounded-full ${index === currentSlide ? 'bg-slate-900' : 'bg-slate-400'}`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="h-14 w-full rounded-[22px] bg-slate-950 text-sm font-semibold text-white shadow-[0_24px_50px_-24px_rgba(15,23,42,0.8)] transition hover:bg-slate-900"
          >
            {currentSlide === slides.length - 1 ? t('onboarding.start') : t('common.continue')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

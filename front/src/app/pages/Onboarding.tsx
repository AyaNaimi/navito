import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';
import img1 from '../../assets/b936e34de051bc299deaad6dc888364043138630.png';

const getSlides = (t: any) => [
  {
    title: t('onboarding.slide1Title'),
    description: t('onboarding.slide1Desc'),
    image: img1,
  },
  {
    title: t('onboarding.slide2Title'),
    description: t('onboarding.slide2Desc'),
    image: img1,
  },
  {
    title: t('onboarding.slide3Title'),
    description: t('onboarding.slide3Desc'),
    image: img1,
  },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = getSlides(t);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      return;
    }

    navigate('/language');
  };

  return (
    <div className="size-full bg-white flex flex-col">
      <div className="p-6 flex justify-end">
        <button
          onClick={() => navigate('/language')}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {t('common.skip')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-3xl bg-gray-100 animate-enter-card">
            <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-4 text-center animate-enter-hero">
            <h2 className="text-2xl font-bold text-gray-900">{slides[currentSlide].title}</h2>
            <p className="text-base leading-relaxed text-gray-600">{slides[currentSlide].description}</p>
          </div>

          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-[#0D9488]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <Button onClick={handleNext} className="h-12 w-full rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90">
          {currentSlide === slides.length - 1 ? t('onboarding.start') : t('common.continue')}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

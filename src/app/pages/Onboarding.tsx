import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import img1 from '../../assets/b936e34de051bc299deaad6dc888364043138630.png';

const slides = [
  {
    title: 'Un seul app, une arrivée plus fluide.',
    description: 'Navito prépare votre voyage dès le départ avec langue, accès invité et contenu local.',
    image: img1,
  },
  {
    title: 'Choisissez le pays puis la ville.',
    description: 'Vous accédez directement aux activités, restaurants et transports pertinents pour votre destination.',
    image: img1,
  },
  {
    title: 'Sinon, explorez avec la carte actuelle.',
    description: 'Si la ville n’est pas encore couverte, Navito bascule vers l’exploration par localisation actuelle.',
    image: img1,
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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
          Passer
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
          {currentSlide === slides.length - 1 ? 'Commencer' : 'Continuer'}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

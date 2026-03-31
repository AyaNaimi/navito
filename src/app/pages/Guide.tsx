import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { guides } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { BadgeCheck, Languages, MapPin, MessageCircle, Phone, Star, UserRound } from 'lucide-react';

export default function Guide() {
  const navigate = useNavigate();
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
    <div className="size-full bg-white flex flex-col pb-16">
      <div className="bg-[#0D9488] px-6 py-6 text-white">
        <h1 className="mb-2 text-2xl font-bold">Guide</h1>
        <p className="text-sm text-white/80">
          {exploreMode === 'city' && city
            ? `Demandez un guide local disponible a ${city}`
            : 'Trouvez un guide local disponible autour de votre position actuelle'}
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="mb-5 rounded-2xl bg-[#0D9488]/8 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#0D9488] text-white">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Guides locaux verifies</h2>
              <p className="mt-1 text-sm text-gray-600">
                {exploreMode === 'city' && city
                  ? `Voici les guides proposes dans la ville de ${city}.`
                  : 'Voici une selection de guides disponibles pour vous accompagner.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {availableGuides.map((guide) => (
            <div key={guide.id} className="rounded-2xl border-2 border-gray-200 p-4 transition-colors hover:border-[#0D9488]">
              <div className="flex gap-4">
                <div className="relative">
                  <img src={guide.image} alt={guide.name} className="h-16 w-16 rounded-full object-cover" />
                  {guide.verified && (
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500">
                      <BadgeCheck className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{guide.name}</h3>
                      <p className="text-sm text-gray-500">{guide.city}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{guide.rating}</span>
                    </div>
                  </div>

                  <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{guide.specialty}</span>
                    </div>
                    <span>{guide.experience} experience</span>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">{guide.languages.join(', ')}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="text-gray-600">A partir de </span>
                      <span className="font-bold text-[#0D9488]">{guide.pricePerHalfDay} MAD / demi-journee</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleRequestGuide(guide.id)} size="sm" className="bg-[#0D9488] hover:bg-[#0D9488]/90">
                        Demander
                      </Button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">{guide.reviews} avis • reponse en {guide.responseTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

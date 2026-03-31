import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, DollarSign, MapPin, Search, ShieldAlert, Sparkles, Star, TrendingUp, UserRound } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { activities, cities, monuments } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { city, exploreMode } = useAppContext();

  const activeCity = city || cities[0]?.name || 'Marrakech';
  const citySpots = useMemo(() => cities.filter((item) => item.name !== activeCity).slice(0, 3), [activeCity]);
  const cityMonuments = useMemo(() => monuments.filter((item) => item.city === activeCity), [activeCity]);
  const cityActivities = useMemo(() => activities.filter((item) => item.city === activeCity), [activeCity]);

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="bg-[#0D9488] pt-safe-top">
        <div className="px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="animate-enter-hero">
              <p className="text-sm text-white/80">Bienvenue sur Navito</p>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
                <MapPin className="h-5 w-5" />
                {exploreMode === 'current-location' ? 'Carte actuelle' : activeCity}
              </h1>
            </div>
            <button onClick={() => navigate('/profile')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40">
                <UserRound className="h-5 w-5 text-white" />
              </div>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Explorer la destination..." className="h-12 rounded-xl border-0 bg-white pl-12" onClick={() => navigate('/explore')} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mb-2 bg-white px-6 py-4">
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => navigate('/ocr-translator')} className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-center text-xs text-gray-700">OCR Translate</span>
            </button>
            <button onClick={() => navigate('/price-estimator')} className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-center text-xs text-gray-700">Price Check</span>
            </button>
            <button onClick={() => navigate('/transport')} className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-center text-xs text-gray-700">Transport</span>
            </button>
            <button onClick={() => navigate('/safety')} className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="text-center text-xs text-gray-700">Safety</span>
            </button>
          </div>
        </div>

        {exploreMode === 'city' && (
          <div className="mb-2 bg-white px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <TrendingUp className="h-5 w-5 text-[#0D9488]" />
                Autres villes à découvrir
              </h2>
              <button onClick={() => navigate('/city')} className="text-sm font-medium text-[#0D9488] hover:underline">
                Changer
              </button>
            </div>

            <div className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
              {citySpots.map((item) => (
                <div key={item.id} className="group relative h-40 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl" onClick={() => navigate('/city')}>
                  <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs opacity-90">{item.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2 bg-white px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {exploreMode === 'current-location' ? 'Recommandé autour de vous' : `Incontournables à ${activeCity}`}
            </h2>
            <button onClick={() => navigate('/explore')} className="text-sm font-medium text-[#0D9488] hover:underline">
              Tout voir
            </button>
          </div>

          <div className="space-y-3">
            {(cityMonuments.length ? cityMonuments : monuments.slice(0, 3)).map((item) => (
              <div key={item.id} onClick={() => navigate(`/activity/${item.id}`)} className="flex cursor-pointer gap-3 rounded-xl border border-gray-200 p-3 transition-colors hover:border-[#0D9488]">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
                  <p className="truncate text-sm text-gray-600">{item.city}</p>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Expériences
            </h2>
          </div>

          <div className="space-y-3">
            {(cityActivities.length ? cityActivities : activities).map((item) => (
              <div key={item.id} onClick={() => navigate(`/activity/${item.id}`)} className="group relative cursor-pointer overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/9]">
                  <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 font-bold">{item.name}</h3>
                        <p className="text-sm opacity-90">{item.city} • {item.duration}</p>
                      </div>
                      <p className="text-lg font-bold">{item.price} MAD</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
                        <span className="text-xs font-medium">{item.rating}</span>
                      </div>
                      <span className="text-xs opacity-80">({item.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

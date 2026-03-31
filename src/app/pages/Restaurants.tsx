import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { restaurants } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { city, exploreMode } = useAppContext();

  const visibleRestaurants = useMemo(() => {
    const scoped = exploreMode === 'city' && city ? restaurants.filter((item) => item.city === city) : restaurants;
    const filtered = scoped.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      return b.rating - a.rating;
    });
  }, [city, exploreMode, searchQuery]);

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="px-6 py-4">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {exploreMode === 'city' && city ? `Restaurants à ${city}` : 'Restaurants'}
          </h1>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl pl-12"
              />
            </div>
            <Button variant="outline" className="h-12 rounded-xl px-4">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold">Own a Restaurant?</h3>
              <p className="mb-3 text-sm text-white/90">Boost visibility on Navito with featured placement.</p>
              <Button variant="secondary" className="h-9 bg-white text-orange-600 hover:bg-white/90">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {visibleRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className={`cursor-pointer overflow-hidden rounded-2xl transition-all ${
                restaurant.isPromoted ? 'border-2 border-yellow-400 bg-white shadow-lg' : 'border border-gray-200 bg-white hover:border-[#0D9488]'
              }`}
            >
              {restaurant.isPromoted && (
                <div className={`${restaurant.promotionLevel === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-[#0D9488]'} flex items-center gap-2 px-4 py-2`}>
                  <Crown className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold uppercase text-white">
                    {restaurant.promotionLevel === 'premium' ? 'Premium Partner' : 'Featured Restaurant'}
                  </span>
                </div>
              )}

              <div className="flex gap-4 p-4">
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                  <ImageWithFallback src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900">{restaurant.name}</h3>
                    <p className="mb-2 text-sm text-gray-600">{restaurant.cuisine}</p>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{restaurant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">({restaurant.reviews})</span>
                      <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{restaurant.city}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="text-xs text-gray-600">Avg. </span>
                    <span className="font-bold text-[#0D9488]">{restaurant.avgPrice} MAD</span>
                    <span className="text-xs text-gray-600">/person</span>
                  </div>
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

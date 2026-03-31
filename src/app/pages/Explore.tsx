import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import CurrentLocationMap from '../components/CurrentLocationMap';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Slider } from '../components/ui/slider';
import { activities, monuments, restaurants } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppContext } from '../context/AppContext';

type FilterState = {
  priceRange: [number, number];
  rating: number;
};

export default function Explore() {
  const navigate = useNavigate();
  const { city, exploreMode, currentPosition } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'monuments' | 'restaurants' | 'activities'>('all');
  const [filters, setFilters] = useState<FilterState>({ priceRange: [0, 2000], rating: 0 });

  const allItems = useMemo(
    () => [
      ...monuments.map((item) => ({ ...item, type: 'monument' as const })),
      ...restaurants.map((item) => ({ ...item, type: 'restaurant' as const })),
      ...activities.map((item) => ({ ...item, type: 'activity' as const })),
    ],
    []
  );

  const scopedItems = useMemo(() => {
    if (exploreMode === 'current-location' || !city) {
      return allItems;
    }

    return allItems.filter((item) => item.city === city);
  }, [allItems, city, exploreMode]);

  const filteredItems = scopedItems.filter((item) => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeTab !== 'all' && item.type !== activeTab.slice(0, -1)) {
      return false;
    }

    if (filters.rating && item.rating < filters.rating) {
      return false;
    }

    const price = 'price' in item ? (typeof item.price === 'number' ? item.price : 0) : 'avgPrice' in item ? item.avgPrice : 0;
    return price >= filters.priceRange[0] && price <= filters.priceRange[1];
  });

  const mapCenter: [number, number] = currentPosition ? [currentPosition.lat, currentPosition.lng] : [33.5731, -7.5898];

  return (
    <div className="size-full bg-gray-50 flex flex-col pb-16">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="px-6 py-4">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {exploreMode === 'current-location' ? 'Explore with current map' : `Explore ${city || 'Morocco'}`}
          </h1>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search attractions, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl pl-12"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 rounded-xl px-4">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-6">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-900">
                      Price Range: {filters.priceRange[0]} - {filters.priceRange[1]} MAD
                    </label>
                    <Slider
                      min={0}
                      max={2000}
                      step={50}
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters((current) => ({ ...current, priceRange: value as [number, number] }))}
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-900">Minimum Rating</label>
                    <div className="flex gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFilters((current) => ({ ...current, rating }))}
                          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            filters.rating === rating ? 'bg-[#0D9488] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {rating > 0 ? `${rating}+` : 'Any'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'monuments', label: 'Monuments' },
              { id: 'restaurants', label: 'Restaurants' },
              { id: 'activities', label: 'Activities' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-[#0D9488] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {exploreMode === 'current-location' && (
          <div className="mb-6 space-y-3">
            <CurrentLocationMap center={mapCenter} label="Your current area" />
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-900">Carte actuelle active</p>
              <p className="mt-1 text-sm text-gray-600">
                Navito affiche le contenu global tant qu’aucune ville locale n’est encore choisie.
              </p>
              <button onClick={() => navigate('/country')} className="mt-3 text-sm font-medium text-[#0D9488] hover:underline">
                Choisir un pays et une ville
              </button>
            </div>
          </div>
        )}

        <p className="mb-4 text-sm text-gray-600">{filteredItems.length} résultats trouvés</p>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => navigate(item.type === 'restaurant' ? `/restaurant/${item.id}` : `/activity/${item.id}`)}
              className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-[#0D9488]"
            >
              <div className="flex gap-3 p-3">
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                  <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900">{item.name}</h3>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{item.city}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">({item.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="font-bold text-[#0D9488]">
                      {'price' in item ? (typeof item.price === 'number' ? `${item.price} MAD` : item.price) : `${item.avgPrice} MAD avg`}
                    </div>
                    {'duration' in item && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{item.duration}</span>
                      </div>
                    )}
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

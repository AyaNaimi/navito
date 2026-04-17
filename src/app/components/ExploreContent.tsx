import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ChevronRight, 
  Clock, 
  Loader2, 
  MapPin, 
  Navigation, 
  Phone, 
  Star, 
  UtensilsCrossed, 
  Zap,
  Filter,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { fetchPlaces, fetchActivities, fetchRestaurants, type ApiPlace, type ApiActivity, type ApiRestaurant } from '../services/api';

type ExploreCategory = 'places' | 'activities' | 'restaurants';

interface ExploreContentProps {
  cityId: number;
  cityName: string;
  center: { lat: number; lng: number };
}

const CATEGORY_CONFIG: Record<ExploreCategory, {
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  gradient: string;
}> = {
  places: {
    label: 'Monuments',
    icon: Building2,
    color: '#6366f1',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  activities: {
    label: 'Activités',
    icon: Zap,
    color: '#10b981',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  restaurants: {
    label: 'Restaurants',
    icon: UtensilsCrossed,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-600',
  },
};

function PlaceCard({ 
  place, 
  isSelected, 
  onSelect 
}: { 
  place: ApiPlace; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border-2 bg-white overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'border-[#0D9488] shadow-lg shadow-[#0D9488]/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
          {place.latitude && place.longitude ? (
            <img 
              src={`https://picsum.photos/seed/${place.id}/200/200`}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-50">
              <Building2 className="h-10 w-10 text-indigo-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate">{place.name}</h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">{place.category}</p>
          <div className="flex items-center gap-3 mt-2">
            {place.rating && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700">{Number(place.rating).toFixed(1)}</span>
              </div>
            )}
            {place.entry_price_min != null && (
              <span className="text-sm font-bold text-[#0D9488]">
                {place.entry_price_min}-{place.entry_price_max} MAD
              </span>
            )}
          </div>
          {place.address && (
            <p className="text-xs text-gray-400 mt-2 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {place.address}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </div>
      </div>
    </motion.div>
  );
}

function ActivityCard({ 
  activity, 
  isSelected, 
  onSelect 
}: { 
  activity: ApiActivity; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border-2 bg-white overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'border-[#0D9488] shadow-lg shadow-[#0D9488]/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
          {activity.city_id ? (
            <img 
              src={`https://picsum.photos/seed/${activity.id + 1000}/200/200`}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50">
              <Zap className="h-10 w-10 text-emerald-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate">{activity.name}</h3>
          {activity.duration_label && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Clock className="h-3.5 w-3.5" />
              {activity.duration_label}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {activity.rating && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700">{Number(activity.rating).toFixed(1)}</span>
              </div>
            )}
            {activity.price_min != null && (
              <span className="text-sm font-bold text-[#0D9488]">
                {activity.price_min}-{activity.price_max} MAD
              </span>
            )}
          </div>
          {activity.description && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{activity.description}</p>
          )}
        </div>
        <div className="flex items-center">
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </div>
      </div>
    </motion.div>
  );
}

function RestaurantCard({ 
  restaurant, 
  isSelected, 
  onSelect 
}: { 
  restaurant: ApiRestaurant; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border-2 bg-white overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'border-[#0D9488] shadow-lg shadow-[#0D9488]/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
          {restaurant.latitude && restaurant.longitude ? (
            <img 
              src={`https://picsum.photos/seed/${restaurant.id + 2000}/200/200`}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50">
              <UtensilsCrossed className="h-10 w-10 text-amber-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-base truncate">{restaurant.name}</h3>
            {restaurant.is_halal && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
                Halal
              </span>
            )}
          </div>
          {restaurant.cuisine && (
            <p className="text-sm text-gray-500 mt-0.5">{restaurant.cuisine}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {restaurant.rating && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700">{Number(restaurant.rating).toFixed(1)}</span>
              </div>
            )}
            {restaurant.average_price != null && (
              <span className="text-sm font-bold text-[#0D9488]">
                ~{restaurant.average_price} MAD
              </span>
            )}
          </div>
          {restaurant.opening_hours && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {restaurant.opening_hours}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ExploreContent({ cityId, cityName }: ExploreContentProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ExploreCategory>('places');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const [places, setPlaces] = useState<ApiPlace[]>([]);
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState<ApiPlace | ApiActivity | ApiRestaurant | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchData = useCallback(async () => {
    if (activeCategory === 'places') {
      setLoadingPlaces(true);
      try {
        const response = await fetchPlaces(cityId, searchQuery || undefined);
        setPlaces(response.data ?? []);
      } catch {
        setPlaces([]);
      } finally {
        setLoadingPlaces(false);
      }
    } else if (activeCategory === 'activities') {
      setLoadingActivities(true);
      try {
        const response = await fetchActivities(cityId, searchQuery || undefined);
        setActivities(response.data ?? []);
      } catch {
        setActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    } else {
      setLoadingRestaurants(true);
      try {
        const response = await fetchRestaurants(cityId, searchQuery || undefined);
        setRestaurants(response.data ?? []);
      } catch {
        setRestaurants([]);
      } finally {
        setLoadingRestaurants(false);
      }
    }
  }, [cityId, activeCategory, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectItem = (item: ApiPlace | ApiActivity | ApiRestaurant) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const getDetailPath = () => {
    if (!selectedItem) return '/explore';
    if ('category' in selectedItem) return `/activity/${selectedItem.id}`;
    if ('cuisine' in selectedItem) return `/restaurant/${selectedItem.id}`;
    return `/activity/${selectedItem.id}`;
  };

  const loading = 
    (activeCategory === 'places' && loadingPlaces) ||
    (activeCategory === 'activities' && loadingActivities) ||
    (activeCategory === 'restaurants' && loadingRestaurants);

  const currentItems = 
    activeCategory === 'places' ? places :
    activeCategory === 'activities' ? activities :
    restaurants;

  const currentConfig = CATEGORY_CONFIG[activeCategory];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentConfig.gradient} flex items-center justify-center`}>
              {(() => {
                const Icon = currentConfig.icon;
                return <Icon className="h-5 w-5 text-white" />;
              })()}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{currentConfig.label}</h2>
              <p className="text-xs text-gray-500">{cityName}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
            className="rounded-xl"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Rechercher ${currentConfig.label.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl pl-12 pr-12"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {(Object.keys(CATEGORY_CONFIG) as ExploreCategory[]).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const Icon = cfg.icon;
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#0D9488] mx-auto mb-4" />
              <p className="text-sm text-gray-500">Chargement des {currentConfig.label.toLowerCase()}...</p>
            </div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const Icon = currentConfig.icon;
                  return <Icon className="h-10 w-10 text-gray-300" />;
                })()}
              </div>
              <p className="text-gray-500 mb-2">Aucun {currentConfig.label.toLowerCase()} trouvé</p>
              <p className="text-sm text-gray-400">Essayez de modifier votre recherche</p>
            </div>
          </div>
        ) : (
          <motion.div 
            layout
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {activeCategory === 'places' && (places as (ApiPlace | ApiActivity | ApiRestaurant)[]).map((item) => (
                <PlaceCard
                  key={item.id}
                  place={item as ApiPlace}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={() => handleSelectItem(item)}
                />
              ))}
              {activeCategory === 'activities' && (activities as (ApiPlace | ApiActivity | ApiRestaurant)[]).map((item) => (
                <ActivityCard
                  key={item.id}
                  activity={item as ApiActivity}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={() => handleSelectItem(item)}
                />
              ))}
              {activeCategory === 'restaurants' && (restaurants as (ApiPlace | ApiActivity | ApiRestaurant)[]).map((item) => (
                <RestaurantCard
                  key={item.id}
                  restaurant={item as ApiRestaurant}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={() => handleSelectItem(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showDetail && selectedItem && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 max-h-[70vh] overflow-auto z-50"
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">
                {'cuisine' in selectedItem ? selectedItem.name : 'name' in selectedItem ? selectedItem.name : ''}
              </h3>
              <button 
                onClick={handleCloseDetail}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {'description' in selectedItem && selectedItem.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                {'rating' in selectedItem && selectedItem.rating && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-amber-600 font-medium">Note</p>
                    <p className="text-lg font-bold text-amber-700 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      {Number(selectedItem.rating).toFixed(1)}
                    </p>
                  </div>
                )}
                
                {'average_price' in selectedItem && selectedItem.average_price && (
                  <div className="bg-[#0D9488]/10 rounded-xl p-3">
                    <p className="text-xs text-[#0D9488] font-medium">Prix moyen</p>
                    <p className="text-lg font-bold text-[#0D9488]">{selectedItem.average_price} MAD</p>
                  </div>
                )}
                
                {'entry_price_min' in selectedItem && selectedItem.entry_price_min && (
                  <div className="bg-[#0D9488]/10 rounded-xl p-3">
                    <p className="text-xs text-[#0D9488] font-medium">Prix entree</p>
                    <p className="text-lg font-bold text-[#0D9488]">{selectedItem.entry_price_min}-{selectedItem.entry_price_max} MAD</p>
                  </div>
                )}
                
                {'price_min' in selectedItem && selectedItem.price_min && (
                  <div className="bg-[#0D9488]/10 rounded-xl p-3">
                    <p className="text-xs text-[#0D9488] font-medium">Prix</p>
                    <p className="text-lg font-bold text-[#0D9488]">{selectedItem.price_min}-{selectedItem.price_max} MAD</p>
                  </div>
                )}
              </div>

              {'opening_hours' in selectedItem && selectedItem.opening_hours && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{selectedItem.opening_hours}</span>
                </div>
              )}
              
              {'address' in selectedItem && selectedItem.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{selectedItem.address}</span>
                </div>
              )}
              
              {'phone' in selectedItem && selectedItem.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{selectedItem.phone}</span>
                </div>
              )}

              <Button 
                onClick={() => navigate(getDetailPath())}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#0891B2] font-semibold"
              >
                Voir les details
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showDetail && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseDetail}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </div>
  );
}

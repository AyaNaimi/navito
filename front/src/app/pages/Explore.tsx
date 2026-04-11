import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Search, 
  Settings2, 
  Heart, 
  Share2, 
  Star, 
  Navigation, 
  ArrowRight,
  Loader2,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRealPlacesLocal, PlaceItem } from '../services/placesApi';
import { useAppContext } from '../context/AppContext';
import CurrentLocationMap, { MapMarkerData } from '../components/CurrentLocationMap';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export default function Explore() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { city, exploreMode, currentPosition } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'monuments' | 'restaurants' | 'activities'>('all');
  const [realItems, setRealItems] = useState<PlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  // Map center logic
  const mapCenter: [number, number] = useMemo(() => {
    if (exploreMode === 'current-location' && currentPosition) {
      return [currentPosition.lat, currentPosition.lng];
    }
    // Default to Casablanca or mock
    return [33.5731, -7.5898];
  }, [exploreMode, currentPosition]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRealPlacesLocal(mapCenter[0], mapCenter[1], 2000);
        if (isMounted) {
          setRealItems(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch error:", err);
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [mapCenter]);

  const filteredItems = useMemo(() => {
    return realItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'monuments' && item.type === 'monument') ||
                        (activeTab === 'restaurants' && item.type === 'restaurant') ||
                        (activeTab === 'activities' && item.type === 'activity');
      const matchesRating = item.rating >= ratingFilter;
      return matchesSearch && matchesTab && matchesRating;
    });
  }, [realItems, searchQuery, activeTab, ratingFilter]);

  const mapMarkers: MapMarkerData[] = useMemo(() => {
    const list = filteredItems.map(item => ({
      id: `${item.type}-${item.id}`,
      lat: item.lat,
      lng: item.lng,
      label: item.name,
      type: 'place' as const
    }));
    
    // Add player position if in current location mode
    if (exploreMode === 'current-location' && currentPosition) {
      list.unshift({
        id: 'player',
        lat: currentPosition.lat,
        lng: currentPosition.lng,
        label: t('explore.currentArea'),
        type: 'current' as const
      });
    }
    
    return list;
  }, [filteredItems, exploreMode, currentPosition, t]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header section */}
      <header className="px-6 pt-14 pb-6 border-b border-[#F5F5F7]">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
              {exploreMode === 'current-location' 
                ? t('explore.titleCurrentMap') 
                : t('explore.titleWithCity', { city: city || 'Destination' })}
            </h1>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737373]" />
              <Input 
                placeholder={t('explore.searchPlaceholder')}
                className="pl-10 h-11 bg-[#F5F5F7] border-none rounded-2xl text-[13px] font-medium placeholder:text-[#737373] focus-visible:ring-1 focus-visible:ring-[#171717]/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 w-11 rounded-2xl border-[#E5E5E5] p-0 bg-white hover:bg-[#F5F5F7] transition-all">
                  <Settings2 className="h-4 w-4 text-[#171717]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[32px] px-8 pb-10 border-none outline-none">
                <SheetHeader className="pb-6">
                  <SheetTitle className="text-xl font-bold">{t('explore.filters')}</SheetTitle>
                  <SheetDescription className="text-[13px] font-medium text-[#737373]">
                    Refine your search for the perfect spot
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-8 py-2">
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">
                      {t('explore.minRating')}
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {[0, 3, 4, 4.5].map((rating) => (
                        <Button 
                          key={rating}
                          variant={ratingFilter === rating ? 'default' : 'outline'}
                          onClick={() => setRatingFilter(rating)}
                          className={`h-9 px-6 rounded-full text-[11px] font-bold transition-all ${
                            ratingFilter === rating 
                              ? 'bg-[#171717] text-white border-[#171717]' 
                              : 'bg-white border-[#E5E5E5] text-[#737373]'
                          }`}
                        >
                          {rating === 0 ? t('explore.anyRating') : `${rating}+ ★`}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: t('explore.tabs.all') },
              { id: 'monuments', label: t('explore.tabs.monuments') },
              { id: 'restaurants', label: t('explore.tabs.restaurants') },
              { id: 'activities', label: t('explore.tabs.activities') }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-shrink-0 h-9 rounded-full px-5 text-[11px] font-bold transition-all border-[#E5E5E5] ${
                  activeTab === tab.id 
                    ? 'bg-[#171717] text-white border-[#171717]' 
                    : 'bg-white text-[#737373] hover:border-[#171717]/30'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto max-w-xl mx-auto w-full px-6 pt-8 pb-32">
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="rounded-[32px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm aspect-[4/3] relative">
            <CurrentLocationMap 
              center={mapCenter} 
              markers={mapMarkers} 
              label={exploreMode === 'current-location' ? t('explore.currentArea') : city || 'Map'} 
            />
          </div>
          
          {exploreMode === 'current-location' && (
            <Card className="mt-4 border-[#E5E5E5] bg-[#F5F5F7]/30 p-5 shadow-none rounded-[24px] border-dashed">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-bold">{t('explore.activeMapTitle')}</p>
                  <p className="mt-1 text-[11px] text-[#737373] leading-relaxed font-medium">
                    {t('explore.activeMapDesc')}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-[#171717]" />
                </div>
              </div>
              <Button 
                variant="link"
                onClick={() => navigate('/country')} 
                className="mt-4 p-0 h-auto text-[11px] font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2 hover:no-underline"
              >
                {t('explore.chooseCountryCity')}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Card>
          )}
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
            {isLoading ? t('explore.loading') : t('explore.resultsFound', { count: filteredItems.length })}
          </p>
        </div>

        {/* Results List */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredItems.map((item: any) => (
            <motion.div key={`${item.type}-${item.id}`} variants={item}>
              <Card 
                className="group relative overflow-hidden border-[#E5E5E5] bg-white hover:border-[#171717]/10 hover:shadow-md transition-all duration-300 rounded-[24px] cursor-pointer"
                onClick={() => navigate(item.type === 'restaurant' ? `/restaurant/${item.id}` : `/activity/${item.id}`, { state: { item } })}
              >
                <div className="flex h-[110px]">
                  <div className="w-[110px] h-full overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="bg-[#F5F5F7] text-[#737373] border-none text-[9px] font-bold uppercase tracking-widest px-2 group-hover:bg-[#171717] group-hover:text-white transition-colors">
                          {t(`explore.tabs.${item.type}`)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#171717] text-[#171717]" />
                          <span className="text-[11px] font-bold text-[#171717]">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-[14px] font-bold text-[#171717] line-clamp-1">{item.name}</h3>
                      <p className="text-[11px] text-[#737373] font-medium line-clamp-1 mt-0.5">
                        {item.address || item.city || item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-[#171717]">{item.price === 'Free' ? t('common.free', 'Free') : `MAD ${item.price}`}</p>
                      <button className="h-6 w-6 rounded-full flex items-center justify-center text-[#737373] hover:bg-[#F5F5F7] transition-all">
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {filteredItems.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-[#737373]" />
              </div>
              <p className="text-[13px] font-bold text-[#171717]">No results found</p>
              <p className="text-[11px] text-[#737373] font-medium mt-1">Try adjusting your filters or search query</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

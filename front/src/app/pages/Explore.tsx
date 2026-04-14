import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  MapPin,
  Search,
  Settings2,
  Heart,
  Star,
  Navigation,
  ArrowRight,
  Loader2,
  Filter,
  Check,
  Camera,
  Utensils,
  Ticket,
  ChevronRight,
  X,
  Map as MapIcon,
  List,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Compass,
  Bookmark
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
  const { city, exploreMode, currentPosition, theme } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'monument' | 'restaurant' | 'activity'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [realItems, setRealItems] = useState<PlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number>(5); // km
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price' | 'distance'>('relevance');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const mapCenter: [number, number] = useMemo(() => {
    if (exploreMode === 'current-location' && currentPosition) {
      return [currentPosition.lat, currentPosition.lng];
    }
    return [33.5731, -7.5898];
  }, [exploreMode, currentPosition]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRealPlacesLocal(mapCenter[0], mapCenter[1], 2000);
        if (isMounted) {
          setRealItems(data || []);
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

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('navito-favorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('navito-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
      toast.info('Retiré des favoris');
    } else {
      newFavorites.add(itemId);
      toast.success('Ajouté aux favoris');
    }
    setFavorites(newFavorites);
  };

  const filteredItems = useMemo(() => {
    let items = realItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesRating = item.rating >= ratingFilter;
      const matchesPrice = !priceFilter || (
        (item.price || 0) >= priceFilter.min && (item.price || 9999) <= priceFilter.max
      );
      const matchesFavorites = !showOnlyFavorites || favorites.has(`${item.type}-${item.id}`);
      return matchesSearch && matchesTab && matchesRating && matchesPrice && matchesFavorites;
    });

    // Sort items
    switch (sortBy) {
      case 'rating':
        items = items.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        items = items.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'distance':
        items = items.sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.lat - mapCenter[0], 2) + Math.pow(a.lng - mapCenter[1], 2));
          const distB = Math.sqrt(Math.pow(b.lat - mapCenter[0], 2) + Math.pow(b.lng - mapCenter[1], 2));
          return distA - distB;
        });
        break;
      default:
        break;
    }
    return items;
  }, [realItems, searchQuery, activeTab, ratingFilter, priceFilter, sortBy, favorites, showOnlyFavorites, mapCenter]);

  const mapMarkers: MapMarkerData[] = useMemo(() => {
    const list = filteredItems.map(item => ({
      id: `${item.type}-${item.id}`,
      lat: item.lat,
      lng: item.lng,
      label: item.name,
      type: 'place' as const
    }));
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-500 selection:bg-accent/30 pb-24 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-0 w-[50%] h-[40%] rounded-full bg-accent/[0.05] blur-[120px]" />
        <div className="absolute bottom-20 left-0 w-[40%] h-[40%] rounded-full bg-primary/[0.05] blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 px-4 pt-8 pb-6 bg-background/80 backdrop-blur-2xl border-b border-border">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent italic">
              {exploreMode === 'current-location' ? t('explore.titleCurrentMap') : t('explore.titleWithCity', { city: city || 'Destination' })}
            </h1>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition-all ${
                  showOnlyFavorites
                    ? 'bg-accent text-white border-accent'
                    : 'bg-secondary border-border hover:bg-muted'
                }`}
              >
                <Heart className={`h-5 w-5 ${showOnlyFavorites ? 'fill-white' : ''}`} />
              </motion.button>
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary border border-border hover:bg-muted active:scale-95 transition-all text-foreground"
              >
                {viewMode === 'list' ? <MapIcon size={20} /> : <List size={20} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                placeholder={t('explore.searchPlaceholder')}
                className="h-12 bg-secondary border-border rounded-2xl pl-11 text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:bg-background/80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className={`h-12 w-12 rounded-2xl border p-0 transition-all flex items-center justify-center relative ${
                ratingFilter > 0 || priceFilter || sortBy !== 'relevance'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-secondary border-border hover:bg-muted'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {(ratingFilter > 0 || priceFilter || sortBy !== 'relevance') && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-background" />
              )}
            </motion.button>
          </div>

          {/* Sort & Favorites bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSortBy('relevance')}
              className={`flex-shrink-0 h-9 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all border ${
                sortBy === 'relevance'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              Pertinence
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`flex-shrink-0 h-9 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all border ${
                sortBy === 'rating'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              <Star className="h-3.5 w-3.5" />
              Note
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`flex-shrink-0 h-9 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all border ${
                sortBy === 'price'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Prix
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`flex-shrink-0 h-9 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all border ${
                sortBy === 'distance'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              <Navigation className="h-3.5 w-3.5" />
              Distance
            </button>
          </div>

          {/* Category tabs - better touch targets with snap scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {[
              { id: 'all', icon: Sparkles, label: t('explore.tabs.all') },
              { id: 'monument', icon: Camera, label: t('explore.tabs.monuments') },
              { id: 'restaurant', icon: Utensils, label: t('explore.tabs.restaurants') },
              { id: 'activity', icon: Ticket, label: t('explore.tabs.activities') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 h-11 min-w-[100px] rounded-2xl px-4 text-[11px] font-semibold uppercase tracking-wide flex items-center justify-center gap-2 transition-all border snap-start ${
                  activeTab === tab.id
                    ? 'bg-foreground text-background border-foreground shadow-lg'
                    : 'bg-secondary text-muted-foreground border-border hover:border-accent/40 hover:text-foreground active:bg-accent/5'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-8 pb-32">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-[40px] border border-border bg-card overflow-hidden shadow-2xl aspect-[4/5] relative"
            >
              <CurrentLocationMap center={mapCenter} markers={mapMarkers} label={activeTab} />
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="px-1 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  {isLoading ? t('explore.loading') : t('explore.resultsFound', { count: filteredItems.length })}
                </p>
              </div>

              <div className="space-y-3">
                {filteredItems.map((item: any) => {
                  const itemId = `${item.type}-${item.id}`;
                  const isFavorite = favorites.has(itemId);
                  return (
                    <motion.div
                      key={itemId}
                      whileTap={{ scale: 0.98, x: 4 }}
                      onClick={() => navigate(item.type === 'restaurant' ? `/restaurant/${item.id}` : `/activity/${item.id}`, { state: { item } })}
                      className="group flex gap-4 p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-accent/10 active:bg-accent/5 transition-all cursor-pointer shadow-sm relative"
                    >
                      <div className="h-24 w-24 rounded-2xl overflow-hidden border border-border bg-muted flex-shrink-0 relative">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <button
                          onClick={(e) => toggleFavorite(e, itemId)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isFavorite
                              ? 'bg-rose-500 text-white'
                              : 'bg-background/80 text-muted-foreground hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                          <Badge className="bg-secondary text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors border-none text-[9px] font-semibold uppercase px-2 py-0.5">
                            {item.type}
                          </Badge>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            <span className="text-[12px] font-bold text-foreground">{item.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-[14px] font-semibold tracking-tight text-foreground truncate uppercase">{item.name}</h3>
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight truncate mt-1">
                          {item.address || item.city}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[12px] font-bold text-accent tabular-nums uppercase">MAD {item.price}</p>
                          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredItems.length === 0 && !isLoading && (
                <div className="py-20 text-center">
                  <div className="h-24 w-24 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-[18px] font-bold text-foreground uppercase tracking-wider">No Discoveries</h3>
                  <p className="text-muted-foreground font-medium text-[14px] mt-3 max-w-[240px] mx-auto leading-relaxed">Adjust your filters or explore a different area</p>
                  <Button variant="outline" className="mt-6 h-12 px-6 text-[13px] font-semibold" onClick={() => { setSearchQuery(''); setRatingFilter(0); setActiveTab('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Advanced Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-x-0 bottom-0 bg-background border-t border-border rounded-t-[40px] px-8 pt-8 pb-12 max-h-[90vh] overflow-y-auto"
            >
              <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-widest italic">Filtres</h2>
                    <p className="text-muted-foreground text-[13px] mt-1">Affinez votre recherche</p>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center hover:bg-muted transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Rating Filter */}
                <div className="space-y-4 mb-8">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    Note minimum
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(rating === 0 ? 0 : rating)}
                        className={`h-12 px-6 rounded-2xl text-[13px] font-bold uppercase tracking-wider transition-all border ${
                          ratingFilter === rating
                            ? 'bg-foreground text-background border-foreground shadow-lg'
                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-accent/30'
                        }`}
                      >
                        {rating === 0 ? 'Tout' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-4 mb-8">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-accent" />
                    Fourchette de prix (MAD)
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: 'Tout', value: null },
                      { label: '0-100', value: { min: 0, max: 100 } },
                      { label: '100-300', value: { min: 100, max: 300 } },
                      { label: '300-500', value: { min: 300, max: 500 } },
                      { label: '500+', value: { min: 500, max: 99999 } },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => setPriceFilter(option.value)}
                        className={`h-12 px-6 rounded-2xl text-[13px] font-bold uppercase tracking-wider transition-all border ${
                          JSON.stringify(priceFilter) === JSON.stringify(option.value)
                            ? 'bg-foreground text-background border-foreground shadow-lg'
                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-accent/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-4 mb-8">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-accent" />
                    Trier par
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { id: 'relevance', label: 'Pertinence' },
                      { id: 'rating', label: 'Meilleure note' },
                      { id: 'price', label: 'Prix croissant' },
                      { id: 'distance', label: 'Plus proche' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id as any)}
                        className={`h-12 px-6 rounded-2xl text-[13px] font-bold uppercase tracking-wider transition-all border ${
                          sortBy === option.id
                            ? 'bg-foreground text-background border-foreground shadow-lg'
                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-accent/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset & Apply */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRatingFilter(0);
                      setPriceFilter(null);
                      setSortBy('relevance');
                      toast.info('Filtres réinitialisés');
                    }}
                    className="flex-1 h-14 rounded-2xl text-[13px] font-bold uppercase tracking-widest"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    onClick={() => {
                      setShowFilters(false);
                      toast.success('Filtres appliqués');
                    }}
                    className="flex-1 h-14 rounded-2xl bg-foreground text-background text-[13px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                  >
                    Appliquer ({filteredItems.length} résultats)
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

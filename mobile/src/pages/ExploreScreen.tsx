import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Star,
  Heart,
  Navigation,
  MapPin,
  Filter,
  X,
  Check,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { MapPlace, mapService } from '../services/mapService';

interface ExploreScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  selectedCity?: string;
  selectedCountry?: string;
}

const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit",
    "stylers": [{ "visibility": "off" }]
  }
];

export default function ExploreScreen({ onNavigate, selectedCity, selectedCountry }: ExploreScreenProps) {
  const CATEGORIES = [
    { id: 'all', label: 'All', query: `Top points of interest ${selectedCity}` },
    { id: 'monuments', label: 'Monuments', query: `Monuments ${selectedCity}` },
    { id: 'restaurants', label: 'Food', query: `Restaurants ${selectedCity}` },
    { id: 'activities', label: 'Activities', query: `Attractions ${selectedCity}` },
  ];
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);

  const [currentCoords, setCurrentCoords] = useState({ lat: 31.6295, lng: -7.9811 });
  const mapRef = useRef<MapView>(null);

  const fetchPlaces = useCallback(async (query: string, categoryId: string, coords = currentCoords) => {
    setIsLoading(true);
    const type = categoryId === 'restaurants' ? 'restaurant' : 'tourist_attraction';
    const results = await mapService.searchPlaces(query, coords, type);
    setPlaces(results);
    setFilteredPlaces(results);
    setIsLoading(false);
  }, [currentCoords]);

  const applyFilters = useCallback(() => {
    let filtered = [...places];

    // Price Filter
    filtered = filtered.filter(p => {
      const pPrice = typeof p.price === 'number' ? p.price : 0;
      return pPrice >= priceRange[0] && pPrice <= priceRange[1];
    });

    // Rating Filter
    filtered = filtered.filter(p => p.rating >= minRating);

    setFilteredPlaces(filtered);
    setShowFilters(false);
  }, [places, priceRange, minRating]);

  const handlePlacePress = (place: MapPlace) => {
    if (place.category === 'restaurants') {
      onNavigate('restaurantDetail', { place });
    } else {
      onNavigate('activityDetail', { place });
    }
  };

  useEffect(() => {
    const initLocation = async () => {
      if (selectedCity) {
        const coords = await mapService.getCityCoordinates(selectedCity, selectedCountry);
        setCurrentCoords(coords);
        
        // Animate map to new city
        mapRef.current?.animateToRegion({
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);

        const queryCountry = selectedCountry ? `${selectedCountry}` : '';
        fetchPlaces(`Top places ${selectedCity} ${queryCountry}`, 'all', coords);
      } else {
        fetchPlaces('Top places', 'all');
      }
    };
    initLocation();
  }, [selectedCity, selectedCountry]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchPlaces(searchQuery, activeCategory);
    }
  };

  const handleCategoryPress = (category: typeof CATEGORIES[0]) => {
    setActiveCategory(category.id);
    fetchPlaces(category.query, category.id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Explore</Text>
          <View style={styles.viewToggleContainer}>
            <Pressable
              style={styles.viewToggle}
              onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            >
              {viewMode === 'list' ? (
                <MapIcon size={20} color={colors.primary[500]} />
              ) : (
                <List size={20} color={colors.primary[500]} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.text.tertiary} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Where to next?"
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>
          <Pressable style={styles.filterIconButton} onPress={() => setShowFilters(true)}>
            <SlidersHorizontal size={20} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                activeCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text
                style={[
                  styles.categoryLabel,
                  activeCategory === category.id && styles.categoryLabelActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          <Text style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
            {places.length}
          </Text> places match
        </Text>
        <Pressable
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          {viewMode === 'list' ? (
            <MapIcon size={20} color={colors.primary[500]} />
          ) : (
            <List size={20} color={colors.primary[500]} />
          )}
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>
            {selectedCountry === 'China' ? '搜索中国景点...' : 'Searching local gems...'}
          </Text>
        </View>
      ) : (
        <>
          {viewMode === 'list' ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.placesContainer}
            >
              {filteredPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  style={styles.placeCard}
                  onPress={() => handlePlacePress(place)}
                >
                  <Image source={{ uri: place.image }} style={styles.placeImage} />

                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.placeGradient}
                  />

                  {/* Favorite Button */}
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(place.id);
                    }}
                  >
                    <Heart
                      size={20}
                      color={favorites.includes(place.id) ? colors.semantic.error : colors.text.inverse}
                      fill={favorites.includes(place.id) ? colors.semantic.error : 'transparent'}
                    />
                  </Pressable>

                  {/* Content */}
                  <View style={styles.placeContent}>
                    <View style={styles.placeHeader}>
                      <View style={styles.ratingContainer}>
                        <Star size={14} color={colors.accent[400]} fill={colors.accent[400]} />
                        <Text style={styles.ratingText}>{place.rating}</Text>
                        <Text style={styles.reviewsText}>({place.reviews})</Text>
                      </View>
                    </View>

                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <Text style={styles.placeLocation} numberOfLines={1}>{place.location}</Text>
                      <View style={styles.placeFooter}>
                        <Text style={styles.placePrice}>
                          {typeof place.price === 'number' ? `From ${place.price} MAD` : place.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.mapWrapper}>
              <MapView
                ref={mapRef}
                style={styles.map}
                region={{
                  latitude: currentCoords.lat,
                  longitude: currentCoords.lng,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <UrlTile 
                  urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
                {filteredPlaces.map((place) => (
                  <Marker
                    key={place.id}
                    coordinate={{
                      latitude: place.lat,
                      longitude: place.lng,
                    }}
                    title={place.name}
                    description={place.location}
                    onCalloutPress={() => handlePlacePress(place)}
                  >
                    <View style={styles.customMarker}>
                      <View style={styles.markerInner}>
                        <MapIcon size={12} color={colors.text.inverse} />
                      </View>
                      <View style={styles.markerTip} />
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>
          )}
        </>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <X size={24} color={colors.text.primary} />
              </Pressable>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Rating</Text>
              <View style={styles.ratingRow}>
                {[3, 4, 4.5].map((rating) => (
                  <Pressable
                    key={rating}
                    style={[
                      styles.ratingChip,
                      minRating === rating && styles.ratingChipActive
                    ]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Star 
                      size={14} 
                      color={minRating === rating ? colors.text.inverse : colors.text.secondary} 
                      fill={minRating === rating ? colors.text.inverse : 'transparent'} 
                    />
                    <Text style={[
                      styles.ratingChipText,
                      minRating === rating && styles.ratingChipTextActive
                    ]}>{rating}+</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range (MAD)</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInputBox}>
                  <Text style={styles.priceInputLabel}>Min</Text>
                  <Text style={styles.priceInputVal}>{priceRange[0]}</Text>
                </View>
                <View style={styles.priceInputDivider} />
                <View style={styles.priceInputBox}>
                  <Text style={styles.priceInputLabel}>Max</Text>
                  <Text style={styles.priceInputVal}>{priceRange[1]}</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                {[100, 200, 500, 800].map(max => (
                  <Pressable 
                    key={max} 
                    style={[styles.priceChip, priceRange[1] === max && styles.priceChipActive]}
                    onPress={() => setPriceRange([0, max])}
                  >
                    <Text style={[styles.priceChipText, priceRange[1] === max && styles.priceChipTextActive]}>Under {max}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <Pressable style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    backgroundColor: colors.surface.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  viewToggleContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    padding: 2,
  },
  viewToggle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
  },
  searchSection: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  searchTextInput: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: colors.text.primary,
    height: '100%',
    padding: 0,
  },
  filterIconButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoriesScroll: {
    paddingHorizontal: spacing[6],
    gap: spacing[2],
  },
  categoryChip: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2.5],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  categoryChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  categoryLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  categoryLabelActive: {
    color: colors.text.inverse,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.primary,
  },
  resultsCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  placesContainer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },
  placeCard: {
    height: 240,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  placeImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  placeGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  placeContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing[5],
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
  },
  ratingText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  reviewsText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  placeInfo: {
    gap: spacing[2],
  },
  placeName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.inverse,
  },
  placeLocation: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: 'rgba(255,255,255,0.8)',
  },
  placeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  placePrice: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.text.inverse,
  },
  mapWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    borderWidth: 2,
    borderColor: colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary[500],
    marginTop: -2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    marginTop: spacing[4],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    padding: spacing[6],
    paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[6],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  filterSection: {
    marginBottom: spacing[6],
  },
  filterLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  ratingChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  ratingChipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  ratingChipTextActive: {
    color: colors.text.inverse,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  priceInputBox: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  priceInputLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  priceInputVal: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  priceInputDivider: {
    width: 20,
    height: 1,
    backgroundColor: colors.border.medium,
  },
  priceChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  priceChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  priceChipText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  priceChipTextActive: {
    color: colors.text.inverse,
  },
  applyButton: {
    backgroundColor: colors.primary[500],
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[4],
  },
  applyButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.inverse,
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { mapService, MapPlace } from '../services/mapService';

interface RestaurantsScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  selectedCity?: string;
}

export default function RestaurantsScreen({ onNavigate, selectedCity }: RestaurantsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurants = useCallback(async (query: string) => {
    setIsLoading(true);
    const coords = selectedCity ? await mapService.getCityCoordinates(selectedCity) : { lat: 31.6295, lng: -7.9811 };
    const results = await mapService.searchPlaces(query, coords, 'restaurant');
    setRestaurants(results);
    setIsLoading(false);
  }, [selectedCity]);

  useEffect(() => {
    fetchRestaurants(`Top restaurants ${selectedCity}`);
  }, [selectedCity]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchRestaurants(searchQuery);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Restaurants</Text>
        <Text style={styles.headerSubtitle}>Discover authentic Moroccan flavors</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Finding best tables...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Restaurant List */}
          <View style={styles.list}>
            {restaurants.map((restaurant) => (
              <Pressable
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() => onNavigate('restaurantDetail', { place: restaurant })}
              >
                <View style={styles.restaurantContent}>
                  <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
                    <Text style={styles.restaurantCuisine}>Moroccan • Casual</Text>
                    <View style={styles.restaurantMeta}>
                      <Star size={14} color={colors.accent[400]} fill={colors.accent[400]} />
                      <Text style={styles.restaurantRating}>{restaurant.rating}</Text>
                      <Text style={styles.restaurantReviews}>({restaurant.reviews})</Text>
                      <Text style={styles.restaurantPrice}>{restaurant.price}</Text>
                    </View>
                    <View style={styles.locationBadge}>
                      <MapPin size={12} color={colors.text.tertiary} />
                      <Text style={styles.restaurantCity} numberOfLines={1}>{restaurant.location}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['3xl'],
    color: colors.text.inverse,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  searchSection: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: colors.surface.primary,
    marginTop: -spacing[4],
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  searchBar: {
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
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  list: {
    gap: spacing[4],
  },
  restaurantCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  restaurantContent: {
    flexDirection: 'row',
    padding: spacing[4],
    gap: spacing[4],
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  restaurantName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  restaurantCuisine: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  restaurantRating: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  restaurantReviews: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  restaurantPrice: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.primary[600],
    marginLeft: spacing[1],
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  restaurantCity: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.text.tertiary,
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
});

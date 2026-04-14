import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  User,
  Search,
  Camera,
  DollarSign,
  Car,
  Shield,
  Star,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';
import { mapService, MapPlace } from '../services/mapService';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  selectedCity: string;
  onNavigate: (screen: Screen, params?: { activityId?: number }) => void;
}

const QUICK_ACTIONS = [
  { id: 'ocr', icon: Camera, label: 'Translate', color: colors.primary[500] },
  { id: 'price', icon: DollarSign, label: 'Prices', color: colors.secondary[500] },
  { id: 'transport', icon: Car, label: 'Transport', color: colors.accent[500] },
  { id: 'safety', icon: Shield, label: 'Safety', color: colors.semantic.success },
];

export default function HomeScreen({ selectedCity, onNavigate }: HomeScreenProps) {
  const [featuredPlaces, setFeaturedPlaces] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t: tr } = useLanguage();
  const t = (path: string) => tr(path);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      const coords = await mapService.getCityCoordinates(selectedCity);
      const results = await mapService.searchPlaces(`monuments ${selectedCity}`, coords, 'tourist_attraction');
      setFeaturedPlaces(results.slice(0, 5));
      setIsLoading(false);
    };
    fetchHomeData();
  }, [selectedCity]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationContainer}>
              <MapPin size={20} color={colors.primary[500]} />
              <View>
                <Text style={styles.locationLabel}>{t('home.welcome')}</Text>
                <Text style={styles.locationName}>{selectedCity}</Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => onNavigate('profile')}
          >
            <View style={styles.avatar}>
              <User size={20} color={colors.text.secondary} />
            </View>
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable
          style={styles.searchBar}
          onPress={() => onNavigate('explore')}
        >
          <Search size={20} color={colors.text.tertiary} />
          <Text style={styles.searchPlaceholder}>What are you looking for?</Text>
        </Pressable>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.actionItem}
                onPress={() => onNavigate(action.id as Screen)}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + '15' },
                  ]}
                >
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Nearby Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover {selectedCity}</Text>
            <Pressable onPress={() => onNavigate('explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary[500]} style={{ marginHorizontal: 20 }} />
            ) : featuredPlaces.map((place) => (
              <Pressable
                key={place.id}
                style={styles.placeCard}
                onPress={() => onNavigate('activityDetail', { place: place } as any)}
              >
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                <View style={styles.placeOverlay}>
                  <View style={styles.placeBadge}>
                    <Star size={12} color={colors.accent[400]} fill={colors.accent[400]} />
                    <Text style={styles.placeRating}>{place.rating}</Text>
                  </View>
                </View>

                <View style={styles.placeInfo}>
                  <Text style={styles.placeName} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <Text style={styles.placeCity}>{place.location}</Text>
                  <Text style={styles.placePrice}>
                    {place.price ? `From ${place.price} MAD` : 'Free entry'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular experiences</Text>
          </View>

          <View style={styles.experiencesContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : featuredPlaces.length > 3 ? (
              featuredPlaces.slice(2, 5).map((experience) => (
                <Pressable
                  key={experience.id}
                  style={styles.experienceCard}
                  onPress={() => onNavigate('activityDetail', { place: experience } as any)}
                >
                  <Image source={{ uri: experience.image }} style={styles.experienceImage} />
                  <View style={styles.experienceContent}>
                    <Text style={styles.experienceName}>{experience.name}</Text>
                    <View style={styles.experienceInfo}>
                      <Star size={12} color={colors.accent[400]} fill={colors.accent[400]} />
                      <Text style={styles.experienceRating}>{experience.rating}</Text>
                      <Text style={styles.experienceLocation}>• {experience.location}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
               <Text style={{ color: colors.text.tertiary, textAlign: 'center' }}>Discover local cultural spots</Text>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingTop: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    marginBottom: spacing[5],
  },
  headerLeft: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  locationLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  locationName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[6],
    height: 56,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },
  actionsSection: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[8],
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    gap: spacing[2],
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  seeAll: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.primary[500],
  },
  horizontalScroll: {
    paddingLeft: spacing[6],
    gap: spacing[4],
  },
  placeCard: {
    width: 160,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  placeImage: {
    width: '100%',
    height: 120,
  },
  placeOverlay: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
  },
  placeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
  },
  placeRating: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.primary,
  },
  placeInfo: {
    padding: spacing[3],
  },
  placeName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  placeCity: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[2],
  },
  placePrice: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.primary[500],
  },
  experiencesContainer: {
    paddingHorizontal: spacing[6],
    gap: spacing[4],
  },
  experienceCard: {
    height: 200,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  experienceImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  experienceGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  experienceContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing[5],
  },
  experienceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
  },
  experienceBadgeText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.inverse,
  },
  experienceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
  },
  experienceRatingText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.inverse,
  },
  experienceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  experienceName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.inverse,
    marginBottom: spacing[1],
  },
  experienceCity: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: 'rgba(255,255,255,0.8)',
  },
  experiencePriceContainer: {
    alignItems: 'flex-end',
  },
  experiencePrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.inverse,
  },
  experiencePriceLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.6)',
  },
  bottomSpacing: {
    height: 120,
  },
});

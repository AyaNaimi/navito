import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  MapPin,
  Star,
  Languages,
  Clock,
  Briefcase,
  Phone,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Filter,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { mapService, MapPlace } from '../services/mapService';

interface GuideScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  selectedCity?: string;
}

const { width } = Dimensions.get('window');

export default function GuideScreen({ onNavigate, selectedCity: initialCity }: GuideScreenProps) {
  const [guides, setGuides] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || 'Marrakech');

  const fetchGuides = useCallback(async (city: string) => {
    setIsLoading(true);
    const coords = await mapService.getCityCoordinates(city);
    const results = await mapService.searchPlaces(`Tourist information ${city}`, coords, 'tourism' as any);
    setGuides(results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGuides(selectedCity);
  }, [selectedCity]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make calls on this device');
    });
  };

  const handleMessage = (phone: string) => {
    Linking.openURL(`sms:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to send messages on this device');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Local Guides</Text>
            <Text style={styles.headerSubtitle}>Book verified local experts</Text>
          </View>
          <View style={styles.headerBadge}>
            <ShieldCheck size={16} color={colors.primary[500]} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        </View>

        {/* Filters Scroll */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <View style={styles.filterGroup}>
              <Filter size={14} color={colors.text.tertiary} style={{ marginRight: 8 }} />
              {['Tanger', 'Marrakech', 'Agadir', 'Casablanca'].map(city => (
                <Pressable
                  key={city}
                  onPress={() => setSelectedCity(city)}
                  style={[styles.filterChip, selectedCity === city && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, selectedCity === city && styles.filterChipTextActive]}>
                    {city}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterScroll, { marginTop: spacing[3] }]}>
            <View style={styles.filterGroup}>
              {specialties.map(spec => (
                <Pressable
                  key={spec}
                  onPress={() => setSelectedSpecialty(spec)}
                  style={[styles.filterChip, selectedSpecialty === spec && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, selectedSpecialty === spec && styles.filterChipTextActive]}>
                    {spec}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filteredGuides.length > 0 ? (
          <View style={styles.list}>
            {filteredGuides.map((guide) => (
              <Pressable 
                key={guide.id} 
                style={styles.guideCard}
                onPress={() => onNavigate('guideRequest')}
              >
                <View style={styles.guideTop}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: guide.image }} style={styles.avatar} />
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={12} color="#ffffff" />
                    </View>
                  </View>

                  <View style={styles.guideInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.guideName}>{guide.name}</Text>
                      <View style={styles.ratingRow}>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                        <Text style={styles.ratingText}>{guide.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.locationRow}>
                      <MapPin size={14} color="#6b7280" />
                      <Text style={styles.locationText}>{guide.location}</Text>
                      <Text style={styles.dot}>•</Text>
                      <View style={styles.detailItem}>
                        <Languages size={14} color={colors.text.tertiary} />
                        <Text style={styles.detailText}>Langs</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.guideDivider} />

                <View style={styles.guideBottom}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Fee</Text>
                    <Text style={styles.priceValue}>{guide.price || 'Contact'}</Text>
                    <Text style={styles.priceUnit}>MAD</Text>
                  </View>

                  <View style={styles.actions}>
                    <Pressable style={styles.actionIcon} onPress={() => handleCall(guide.phone)}>
                      <Phone size={18} color={colors.primary[500]} />
                    </Pressable>
                    <Pressable style={styles.actionIcon} onPress={() => handleMessage(guide.phone)}>
                      <MessageSquare size={18} color={colors.primary[500]} />
                    </Pressable>
                    <Pressable style={styles.requestBtn} onPress={() => onNavigate('guideRequest')}>
                      <Text style={styles.requestBtnText}>Book Now</Text>
                      <ChevronRight size={16} color={colors.text.inverse} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.responseBanner}>
                  <Clock size={12} color={colors.text.tertiary} />
                  <Text style={styles.responseText}>Typically open during business hours</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Search size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No Guides Found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your filters to find available local experts.</Text>
            <Pressable 
              style={styles.resetBtn}
              onPress={() => {
                setSelectedCity('All');
                setSelectedSpecialty('All');
              }}
            >
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    backgroundColor: colors.surface.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.primary[500],
    textTransform: 'uppercase',
  },
  filterSection: {
    gap: spacing[2],
  },
  filterScroll: {
    paddingRight: spacing[6],
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterChipText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.inverse,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    padding: spacing[6],
    paddingBottom: 120,
  },
  list: {
    gap: spacing[6],
  },
  guideCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    ...shadows.md,
  },
  guideTop: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.semantic.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface.primary,
  },
  guideInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  guideName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing[2],
  },
  locationText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  dot: {
    color: colors.text.tertiary,
    fontSize: 10,
  },
  specialtyText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.primary[500],
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  guideDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing[4],
  },
  guideBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.primary[500],
  },
  priceUnit: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  requestBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    ...shadows.md,
  },
  requestBtnText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.inverse,
  },
  responseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    borderStyle: 'dashed',
  },
  responseText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 9,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[20],
    gap: spacing[4],
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  emptyDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing[10],
  },
  resetBtn: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  resetBtnText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
});

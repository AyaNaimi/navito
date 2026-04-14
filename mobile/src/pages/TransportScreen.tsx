import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  Star,
  Shield,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';
import { drivers, transportOptions } from '../data/mockData';

import { mapService, MapPlace } from '../services/mapService';

interface TransportScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  selectedCity?: string;
}

export default function TransportScreen({ onNavigate, selectedCity }: TransportScreenProps) {
  const [selectedOption, setSelectedOption] = useState('private');
  const [activeTab, setActiveTab] = useState<'ride' | 'book'>('ride');
  const [nearbyDrivers, setNearbyDrivers] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransport = useCallback(async () => {
    setIsLoading(true);
    const coords = selectedCity ? await mapService.getCityCoordinates(selectedCity) : { lat: 31.6295, lng: -7.9811 };
    const results = await mapService.searchPlaces('Taxi Rank', coords, 'amenity');
    setNearbyDrivers(results);
    setIsLoading(false);
  }, [selectedCity]);

  useEffect(() => {
    fetchTransport();
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
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transport</Text>
          <Text style={styles.headerSubtitle}>
            Reliable rides around Morocco
          </Text>
        </View>

        {/* Location Inputs */}
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <View style={styles.locationInput}>
              <Text style={styles.locationLabel}>Pickup location</Text>
              <Text style={styles.locationValue}>Current location</Text>
            </View>
          </View>

          <View style={styles.locationDivider} />

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotDestination]} />
            <View style={styles.locationInput}>
              <Text style={styles.locationLabel}>Where to?</Text>
              <Text style={[styles.locationValue, styles.locationPlaceholder]}>
                Enter destination
              </Text>
            </View>
          </View>
        </View>

        {/* Transport Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your ride</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          >
            {transportOptions.map((option, index) => (
              <Pressable
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedOption === option.id && styles.optionCardActive,
                ]}
                onPress={() => setSelectedOption(option.id)}
              >
                <Text style={styles.optionIcon}>{['🚕', '🚗', '🚌', '🚆'][index]}</Text>
                <Text
                  style={[
                    styles.optionName,
                    selectedOption === option.id && styles.optionNameActive,
                  ]}
                >
                  {option.title}
                </Text>
                <Text style={styles.optionPrice}>{option.description.split('.')[0]}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Available Transport */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available in {selectedCity || 'Marrakech'}</Text>
          </View>

          <View style={styles.driversContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary[500]} style={{ marginVertical: 20 }} />
            ) : nearbyDrivers.length > 0 ? (
              nearbyDrivers.map((driver) => (
                <Pressable
                  key={driver.id}
                  style={styles.driverCard}
                  onPress={() => onNavigate('taxiSimulator', { destination: driver.name })}
                >
                  <View style={styles.driverHeader}>
                    <View style={styles.driverInfo}>
                      <Image
                        source={{ uri: driver.image }}
                        style={styles.driverImage}
                      />
                      <View>
                        <View style={styles.driverNameRow}>
                          <Text style={styles.driverName}>{driver.name}</Text>
                          <View style={styles.verifiedBadge}>
                            <Shield size={12} color="#ffffff" />
                          </View>
                        </View>
                        <View style={styles.driverStats}>
                          <Star size={14} color={colors.accent[400]} fill={colors.accent[400]} />
                          <Text style={styles.driverRating}>{driver.rating}</Text>
                          <Text style={styles.driverTrials}>({driver.reviews} reviews)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceValue}>{driver.price || '7'}</Text>
                      <Text style={styles.priceUnit}>MAD/km</Text>
                    </View>
                  </View>

                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>Petit Taxi / Transport</Text>
                    <Text style={styles.vehiclePlate}>{driver.location || 'Nearby center'}</Text>
                  </View>

                  <View style={styles.driverFooter}>
                    <View style={styles.distanceBadge}>
                      <Clock size={14} color={colors.primary[500]} />
                      <Text style={styles.distanceText}>Active</Text>
                    </View>

                    <View style={styles.actionButtons}>
                      <Pressable style={styles.actionButton} onPress={() => handleCall('0524000000')}>
                        <Phone size={20} color={colors.text.primary} />
                      </Pressable>
                      <Pressable style={styles.bookButton} onPress={() => onNavigate('taxiSimulator', { destination: driver.name })}>
                        <Text style={styles.bookButtonText}>Ride</Text>
                        <ChevronRight size={16} color={colors.text.inverse} />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: colors.text.secondary, padding: 20 }}>No real-time transport information available.</Text>
            )}
          </View>
        </View>

        {/* Bottom spacing */}
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
    paddingTop: spacing[6],
  },
  header: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  locationCard: {
    marginHorizontal: spacing[6],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
  },
  locationDotDestination: {
    backgroundColor: colors.semantic.error,
  },
  locationInput: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },
  locationValue: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  locationPlaceholder: {
    color: colors.text.tertiary,
  },
  locationDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing[4],
    marginLeft: 28,
  },
  section: {
    marginTop: spacing[8],
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
  optionsContainer: {
    paddingHorizontal: spacing[6],
    gap: spacing[3],
  },
  optionCard: {
    width: 140,
    padding: spacing[4],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  optionCardActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  optionName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  optionNameActive: {
    color: colors.primary[500],
  },
  optionPrice: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  driversContainer: {
    paddingHorizontal: spacing[6],
    gap: spacing[4],
  },
  driverCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  driverImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  driverName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  driverRating: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  driverTrials: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  priceUnit: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  vehicleInfo: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  vehicleName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  vehiclePlate: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  driverFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.base,
  },
  distanceText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.primary[500],
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    height: 44,
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  bookButtonText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.inverse,
  },
  bottomSpacing: {
    height: 120,
  },
});

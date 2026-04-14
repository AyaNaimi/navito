import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { MapPin, Navigation, Car, Clock, ChevronLeft } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { mapService } from '../services/mapService';

interface TaxiSimulatorScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function TaxiSimulatorScreen({ onNavigate }: TaxiSimulatorScreenProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [taxiType, setTaxiType] = useState<'petit' | 'grand'>('petit');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number; distance: number; duration: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [markers, setMarkers] = useState<{ start?: any, end?: any }>({});
  
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: 31.6295,
    longitude: -7.9811,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const calculatePrice = async () => {
    if (!from || !to) return;
    
    setIsLoading(true);
    const data = await mapService.getDirections(from, to);
    
    if (data) {
      const baseRate = taxiType === 'petit' ? 7 : 10;
      const nightMultiplier = timeOfDay === 'night' ? 1.5 : 1;
      const min = Math.floor(data.distanceKm * baseRate * nightMultiplier * 0.9 + 5);
      const max = Math.ceil(data.distanceKm * baseRate * nightMultiplier * 1.1 + 10);
      
      setEstimatedPrice({ 
        min: Math.max(min, 7), // Minimum fare
        max: Math.max(max, 15), 
        distance: parseFloat(data.distanceKm.toFixed(1)),
        duration: data.durationMin
      });

      const start = { latitude: data.startLocation.lat, longitude: data.startLocation.lng };
      const end = { latitude: data.endLocation.lat, longitude: data.endLocation.lng };
      
      setMarkers({ start, end });
      
      // Using real coordinates from OSRM
      setRouteCoords(data.coordinates);

      mapRef.current?.fitToCoordinates(data.coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Interactive Map Background */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
        >
          <UrlTile 
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {/* Start Marker */}
          {markers.start && (
            <Marker
              coordinate={markers.start}
              title="Start"
            >
              <View style={styles.markerContainer}>
                <View style={[styles.markerBody, { backgroundColor: colors.primary[500] }]}>
                  <View style={styles.markerInner} />
                </View>
              </View>
            </Marker>
          )}

          {/* End Marker */}
          {markers.end && (
            <Marker
              coordinate={markers.end}
              title="Destination"
            >
              <View style={styles.markerContainer}>
                <View style={[styles.markerBody, { backgroundColor: colors.text.primary }]}>
                  <Navigation size={12} color="white" fill="white" />
                </View>
              </View>
            </Marker>
          )}

          {/* Real Route */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor={colors.primary[500]}
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>

      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => onNavigate('transport')}>
            <ChevronLeft size={24} color={colors.text.primary} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Taxi Simulator</Text>
            <Text style={styles.headerSubtitle}>Marrakech, Morocco</Text>
          </View>
        </View>

        <ScrollView
          style={styles.bottomSheet}
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.handle} />
          
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <View style={[styles.dot, { backgroundColor: colors.primary[500] }]} />
                <View style={styles.line} />
                <MapPin size={18} color={colors.text.primary} />
              </View>
              <View style={styles.inputs}>
                <TextInput
                  style={styles.input}
                  placeholder="Set pickup location"
                  value={from}
                  onChangeText={setFrom}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Where are you going?"
                  value={to}
                  onChangeText={setTo}
                />
              </View>
            </View>
          </View>

          <View style={styles.optionsGrid}>
            <Pressable
              style={[styles.optionItem, taxiType === 'petit' && styles.optionItemSelected]}
              onPress={() => setTaxiType('petit')}
            >
              <Car size={24} color={taxiType === 'petit' ? colors.primary[500] : colors.text.tertiary} />
              <Text style={[styles.optionLabel, taxiType === 'petit' && styles.optionLabelActive]}>Petit Taxi</Text>
            </Pressable>
            
            <Pressable
              style={[styles.optionItem, taxiType === 'grand' && styles.optionItemSelected]}
              onPress={() => setTaxiType('grand')}
            >
              <Car size={24} color={taxiType === 'grand' ? colors.primary[500] : colors.text.tertiary} />
              <Text style={[styles.optionLabel, taxiType === 'grand' && styles.optionLabelActive]}>Grand Taxi</Text>
            </Pressable>

            <Pressable
              style={[styles.optionItem, timeOfDay === 'day' && styles.optionItemSelected]}
              onPress={() => setTimeOfDay('day')}
            >
              <Clock size={24} color={timeOfDay === 'day' ? colors.primary[500] : colors.text.tertiary} />
              <Text style={[styles.optionLabel, timeOfDay === 'day' && styles.optionLabelActive]}>Day</Text>
            </Pressable>

            <Pressable
              style={[styles.optionItem, timeOfDay === 'night' && styles.optionItemSelected]}
              onPress={() => setTimeOfDay('night')}
            >
              <Clock size={24} color={timeOfDay === 'night' ? colors.primary[500] : colors.text.tertiary} />
              <Text style={[styles.optionLabel, timeOfDay === 'night' && styles.optionLabelActive]}>Night</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.calculateButton, (!from || !to || isLoading) && styles.calculateButtonDisabled]}
            onPress={calculatePrice}
            disabled={isLoading || !from || !to}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.calculateButtonText}>Get Estimate</Text>
            )}
          </Pressable>

          {estimatedPrice && (
            <View style={styles.estimateResultCard}>
              <View style={styles.estimateHeader}>
                <Text style={styles.estimateTitle}>Estimated Fare</Text>
                <Text style={styles.estimateDistance}>{estimatedPrice.distance} km • {estimatedPrice.duration} min</Text>
              </View>
              
              <View style={styles.priceDisplay}>
                <Text style={styles.currencySymbol}>MAD</Text>
                <Text style={styles.priceRange}>{estimatedPrice.min} - {estimatedPrice.max}</Text>
              </View>

              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                  * Always check the meter. Night rate (+50%) {timeOfDay === 'night' ? 'included' : 'not applied'}.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.safetyTips}>
            <Text style={styles.safetyTitle}>Safety Tips</Text>
            <Text style={styles.safetyText}>• Ask for "Le Compteur" (the meter)</Text>
            <Text style={styles.safetyText}>• Petit taxis have a minimum fare of 7.50 MAD</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '40%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  backButton: {
    padding: spacing[2],
  },
  headerTitleContainer: {
    marginLeft: spacing[3],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.text.tertiary,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    ...shadows.xl,
  },
  bottomSheetContent: {
    padding: spacing[6],
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing[6],
  },
  inputSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  inputWrapper: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  inputIconContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.light,
    marginVertical: 4,
  },
  inputs: {
    flex: 1,
    gap: spacing[2],
  },
  input: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    color: colors.text.primary,
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  optionItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.surface.primary,
  },
  optionItemSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  optionLabelActive: {
    color: colors.primary[600],
  },
  calculateButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[6],
    ...shadows.md,
  },
  calculateButtonDisabled: {
    backgroundColor: colors.border.medium,
    opacity: 0.6,
  },
  calculateButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.inverse,
  },
  estimateResultCard: {
    backgroundColor: colors.text.primary,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    marginBottom: spacing[6],
    ...shadows.lg,
  },
  estimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  estimateTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  estimateDistance: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: 14,
    color: colors.primary[400],
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  currencySymbol: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
  },
  priceRange: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 42,
    color: colors.text.inverse,
  },
  disclaimer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: spacing[4],
  },
  disclaimerText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },
  safetyTips: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  safetyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  safetyText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBody: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
});

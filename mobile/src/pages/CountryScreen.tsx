import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';

const { width } = Dimensions.get('window');

const COUNTRIES_DATA = [
  { id: 1, name: 'Morocco', flag: '🇲🇦', cities: 12, places: 250, image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400' },
  { id: 2, name: 'France', flag: '🇫🇷', cities: 15, places: 350, image: 'https://images.unsplash.com/photo-1502602898657-3e91759c8c5a?w=400' },
  { id: 3, name: 'Spain', flag: '🇪🇸', cities: 12, places: 280, image: 'https://images.unsplash.com/photo-1583422409516-2895a4efbba8?w=400' },
  { id: 4, name: 'Portugal', flag: '🇵🇹', cities: 8, places: 180, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400' },
  { id: 5, name: 'Italy', flag: '🇮🇹', cities: 15, places: 320, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
  { id: 6, name: 'United Kingdom', flag: '🇬🇧', cities: 12, places: 290, image: 'https://images.unsplash.com/photo-1513635269975-2e4d4f76eb6b?w=400' },
  { id: 7, name: 'Germany', flag: '🇩🇪', cities: 12, places: 270, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400' },
  { id: 8, name: 'Japan', flag: '🇯🇵', cities: 12, places: 350, image: 'https://images.unsplash.com/photo-1540959733332-eab4deab37af?w=400' },
  { id: 9, name: 'China', flag: '🇨🇳', cities: 18, places: 450, image: 'https://images.unsplash.com/photo-1594522591159-2e7e7d32e4b2?w=400' },
  { id: 10, name: 'United States', flag: '🇺🇸', cities: 25, places: 600, image: 'https://images.unsplash.com/photo-1485871981521-5b1f3807677e?w=400' },
  { id: 11, name: 'Canada', flag: '🇨🇦', cities: 10, places: 200, image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400' },
  { id: 12, name: 'Brazil', flag: '🇧🇷', cities: 12, places: 250, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400' },
  { id: 13, name: 'Mexico', flag: '🇲🇽', cities: 15, places: 300, image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400' },
  { id: 14, name: 'Egypt', flag: '🇪🇬', cities: 8, places: 180, image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a7?w=400' },
  { id: 15, name: 'Turkey', flag: '🇹🇷', cities: 12, places: 260, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a720d7?w=400' },
  { id: 16, name: 'Thailand', flag: '🇹🇭', cities: 10, places: 220, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400' },
  { id: 17, name: 'India', flag: '🇮🇳', cities: 20, places: 420, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400' },
  { id: 18, name: 'Australia', flag: '🇦🇺', cities: 10, places: 230, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400' },
  { id: 19, name: 'United Arab Emirates', flag: '🇦🇪', cities: 6, places: 150, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
  { id: 20, name: 'Greece', flag: '🇬🇷', cities: 10, places: 210, image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=400' },
];

const CITIES_DATA: Record<string, Array<{id: number; name: string; rating: number; places: number; image: string}>> = {
  'Morocco': [
    { id: 1, name: 'Marrakech', rating: 4.8, places: 180, image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400' },
    { id: 2, name: 'Fes', rating: 4.7, places: 150, image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400' },
    { id: 3, name: 'Casablanca', rating: 4.5, places: 120, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400' },
    { id: 4, name: 'Rabat', rating: 4.6, places: 90, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400' },
    { id: 5, name: 'Tanger', rating: 4.4, places: 85, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400' },
    { id: 6, name: 'Agadir', rating: 4.3, places: 70, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  ],
  'France': [
    { id: 1, name: 'Paris', rating: 4.9, places: 250, image: 'https://images.unsplash.com/photo-1502602898657-3e91759c8c5a?w=400' },
    { id: 2, name: 'Nice', rating: 4.7, places: 120, image: 'https://images.unsplash.com/photo-1514890547350-a9c9b4e6c6d6?w=400' },
    { id: 3, name: 'Lyon', rating: 4.6, places: 100, image: 'https://images.unsplash.com/photo-1550340499-a6aa9a28a9d6?w=400' },
    { id: 4, name: 'Marseille', rating: 4.5, places: 90, image: 'https://images.unsplash.com/photo-1534430480872-6def6d9bf728?w=400' },
  ],
  'Spain': [
    { id: 1, name: 'Barcelona', rating: 4.8, places: 180, image: 'https://images.unsplash.com/photo-1583422409516-2895a4efbba8?w=400' },
    { id: 2, name: 'Madrid', rating: 4.7, places: 160, image: 'https://images.unsplash.com/photo-1539037116277-4db208895f67?w=400' },
    { id: 3, name: 'Seville', rating: 4.6, places: 120, image: 'https://images.unsplash.com/photo-1567359781514-3b964e0b00c0?w=400' },
  ],
  'Italy': [
    { id: 1, name: 'Rome', rating: 4.9, places: 200, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
    { id: 2, name: 'Venice', rating: 4.8, places: 150, image: 'https://images.unsplash.com/photo-1514890547350-a9c9b4e6c6d6?w=400' },
    { id: 3, name: 'Florence', rating: 4.7, places: 130, image: 'https://images.unsplash.com/photo-1541370976299-4d24a762c3e6?w=400' },
    { id: 4, name: 'Milan', rating: 4.6, places: 110, image: 'https://images.unsplash.com/photo-1520188747614-a9ed2a81c1d3?w=400' },
  ],
};

const DEFAULT_CITIES = [
  { id: 1, name: 'Paris', rating: 4.9, places: 250, image: 'https://images.unsplash.com/photo-1502602898657-3e91759c8c5a?w=400' },
  { id: 2, name: 'London', rating: 4.8, places: 220, image: 'https://images.unsplash.com/photo-1513635269975-2e4d4f76eb6b?w=400' },
  { id: 3, name: 'New York', rating: 4.7, places: 200, image: 'https://images.unsplash.com/photo-1485871981521-5b1f3807677e?w=400' },
  { id: 4, name: 'Tokyo', rating: 4.9, places: 180, image: 'https://images.unsplash.com/photo-1540959733332-eab4deab37af?w=400' },
  { id: 5, name: 'Dubai', rating: 4.6, places: 150, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
  { id: 6, name: 'Barcelona', rating: 4.8, places: 180, image: 'https://images.unsplash.com/photo-1583422409516-2895a4efbba8?w=400' },
];

interface CountryScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  onCitySelect?: (city: string) => void;
}

export default function CountryScreen({ onNavigate, onBack, onCitySelect }: CountryScreenProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCountryData = COUNTRIES_DATA.find(c => c.name === selectedCountry);
  const cities = selectedCountry ? (CITIES_DATA[selectedCountry] || DEFAULT_CITIES) : [];

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleCitySelect = (cityName: string) => {
    if (onCitySelect) {
      onCitySelect(cityName);
    } else {
      onNavigate('explore');
    }
  };

  if (selectedCountry && currentCountryData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => setSelectedCountry(null)} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.flagLarge}>{currentCountryData.flag}</Text>
            <View>
              <Text style={styles.title}>{selectedCountry}</Text>
              <Text style={styles.subtitle}>{cities.length} cities to explore</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={cities}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.cityList}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.cityCard} 
              onPress={() => handleCitySelect(item.name)}
            >
              <Image source={{ uri: item.image }} style={styles.cityImage} />
              <View style={styles.cityContent}>
                <Text style={styles.cityName}>{item.name}</Text>
                <View style={styles.cityInfo}>
                  <View style={styles.cityRating}>
                    <Star size={14} color={colors.accent[500]} fill={colors.accent[500]} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.placesText}>{item.places} places</Text>
                </View>
              </View>
              <ChevronRight size={24} color={colors.text.tertiary} />
            </Pressable>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Explore the world</Text>
        <Text style={styles.subtitle}>Choose your destination</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.text.tertiary} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search countries..." 
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={COUNTRIES_DATA.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.countryRow}
        contentContainerStyle={styles.countryList}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.countryCard} 
            onPress={() => handleCountrySelect(item.name)}
          >
            <Image source={{ uri: item.image }} style={styles.countryImage} />
            <View style={styles.flagBadge}>
              <Text style={styles.flagText}>{item.flag}</Text>
            </View>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.countryInfo}>{item.cities} cities</Text>
          </Pressable>
        )}
      />
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
    paddingBottom: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  flagLarge: {
    fontSize: 48,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing[3],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  countryRow: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
  },
  countryList: {
    paddingBottom: spacing[8],
  },
  countryCard: {
    width: (width - spacing[6] * 2 - spacing[3]) / 2,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  countryImage: {
    width: '100%',
    height: 100,
  },
  flagBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: borderRadius.md,
    padding: spacing[1],
  },
  flagText: {
    fontSize: 20,
  },
  countryName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[2],
  },
  countryInfo: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[3],
  },
  cityList: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  cityImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
  },
  cityContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  cityName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  cityRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  placesText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

interface CityScreenProps {
  onSelect: (city: string) => void;
  selectedCountry?: string;
}

interface CityResult {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const countryApiNames: Record<string, string> = {
  Morocco: 'Maroc',
  France: 'France',
  Spain: 'España',
  Portugal: 'Portugal',
  China: '中国',
  Italy: 'Italia',
  Germany: 'Deutschland',
  'United Kingdom': 'United Kingdom',
  'United States': 'United States',
  Japan: '日本',
  Thailand: 'Thailand',
  Turkey: 'Türkiye',
  Egypt: 'مصر',
  Tunisia: 'تونس',
  Greece: 'Ελλάδα',
  Brazil: 'Brasil',
  Mexico: 'México',
  India: 'India',
  Australia: 'Australia',
  Canada: 'Canada',
};

export default function CityScreen({ onSelect, selectedCountry }: CityScreenProps) {
  const [cities, setCities] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setCities([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const countryName = countryApiNames[selectedCountry] || selectedCountry;
        const res = await axios.get(`https://photon.komoot.io/api/`, {
          params: { q: countryName, limit: 30 }
        });

        const cityNames = new Set<string>();
        const results: CityResult[] = [];
        let id = 0;

        if (res.data.features) {
          for (const feature of res.data.features) {
            const cityName = feature.properties.name || feature.properties.city;
            const cityType = feature.properties.osm_value;
            
            if (cityName && !cityNames.has(cityName) && 
                (cityType === 'city' || cityType === 'town' || cityType === 'county' || cityType === 'state')) {
              cityNames.add(cityName);
              results.push({
                id: id++,
                name: cityName,
                country: selectedCountry,
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0],
              });
            }
          }
        }

        setCities(results.slice(0, 20));
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      }
      setIsLoading(false);
    };

    fetchCities();
  }, [selectedCountry]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Destination</Text>
          <Text style={styles.title}>Choose your city</Text>
          <Text style={styles.subtitle}>
            {selectedCountry ? `Select a city in ${selectedCountry}` : 'Select your travel destination'}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading cities...</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {cities.map((city) => (
              <Pressable
                key={city.id}
                style={styles.item}
                onPress={() => onSelect(city.name)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.imageContainer}>
                    <Text style={styles.cityIcon}>📍</Text>
                  </View>
                  <View style={styles.textContent}>
                    <Text style={styles.itemText}>{city.name}</Text>
                    <Text style={styles.subText}>{city.country}</Text>
                  </View>
                </View>
                <View style={styles.chevron}>
                  <Text style={styles.chevronText}>›</Text>
                </View>
              </Pressable>
            ))}
            {cities.length === 0 && (
              <Text style={styles.emptyText}>No cities found for this country</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  eyebrow: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityIcon: {
    fontSize: 24,
  },
  textContent: {
    flex: 1,
  },
  itemText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  subText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    color: '#64748b',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    paddingVertical: 20,
  },
});

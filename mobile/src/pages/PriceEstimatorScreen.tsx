import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { findMarketReference } from '../utils/priceValidation';
import { Screen } from '../types/navigation';

interface PriceEstimatorScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Currency {
  code: string;
  symbol: string;
  rateFromMAD: number;
  prefix: boolean;
}

const AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'MAD', symbol: 'MAD', rateFromMAD: 1, prefix: false },
  { code: 'EUR', symbol: '€', rateFromMAD: 0.092, prefix: true },
  { code: 'USD', symbol: '$', rateFromMAD: 0.1, prefix: true },
  { code: 'GBP', symbol: '£', rateFromMAD: 0.079, prefix: true },
  { code: 'CAD', symbol: 'C$', rateFromMAD: 0.14, prefix: true },
];

const currencyByCountry: Record<string, Currency> = {
  Morocco: AVAILABLE_CURRENCIES[0],
  France: AVAILABLE_CURRENCIES[1],
  Spain: AVAILABLE_CURRENCIES[1],
  Portugal: AVAILABLE_CURRENCIES[1],
};

const popularItems = [
  { name: 'Water Bottle', min: 6, max: 7 },
  { name: 'Orange Juice', min: 10, max: 15 },
  { name: 'Mint Tea', min: 10, max: 15 },
  { name: 'Tagine', min: 70, max: 120 },
  { name: 'Babouches', min: 120, max: 220 },
  { name: 'Argan Oil', min: 90, max: 180 },
];

const GROQ_API_KEY = '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';

interface EstimateResult {
  name: string;
  category: string;
  brand: string;
  confidence: number;
  priceMin: number;
  priceMax: number;
  suggestedPrice: number;
  currency: Currency;
  isVerified?: boolean;
}

function formatRange(min: number, max: number, currency: Currency): string {
  const roundedMin = Math.round(min);
  const roundedMax = Math.round(max);
  if (currency.prefix) {
    return `${currency.symbol}${roundedMin} - ${currency.symbol}${roundedMax}`;
  }
  return `${roundedMin} - ${roundedMax} ${currency.symbol}`;
}

type MarketContext = 'modern' | 'souk';

export default function PriceEstimatorScreen({ onNavigate }: PriceEstimatorScreenProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [usingApi, setUsingApi] = useState(false);
  const [marketContext, setMarketContext] = useState<MarketContext>('souk');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('MAD');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<View>(null);

  const currency = AVAILABLE_CURRENCIES.find((c) => c.code === selectedCurrencyCode) ?? AVAILABLE_CURRENCIES[0];

  useEffect(() => {
    const detectedCountry = 'Morocco';
    setSelectedCurrencyCode(currencyByCountry[detectedCountry]?.code ?? 'MAD');
  }, []);

  const handleFileChange = async (imageUri: string) => {
    if (image) setImage(null);
    setImage(imageUri);
    setResult(null);
    setIsProcessing(true);

    try {
      const res = await fetch(imageUri);
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1] || '');
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const ocrRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          temperature: 0.1,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: `Analyze this item in a ${marketContext === 'modern' ? 'MODERN SHOP (Fixed prices)' : 'TRADITIONAL SOUK (Bargaining expected)'} in Morocco. Provide: 1. "priceMin" (bottom local price), 2. "priceMax" (fair price), 3. "suggestedPrice" (target bargaining goal). Return JSON: {"name": "...", "category": "...", "brand": "...", "priceMin": number, "priceMax": number, "suggestedPrice": number}. Respond ONLY with raw JSON.` },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
              ],
            },
          ],
        }),
      });

      if (ocrRes.ok) {
        const data = await ocrRes.json();
        const content = data.choices?.[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(content);
          const name = parsed.name || 'Detected Item';
          const reference = findMarketReference(name);

          const apiResult: EstimateResult = {
            name,
            category: reference?.item ? 'Verified category' : (parsed.category || 'General'),
            brand: parsed.brand || 'Local',
            confidence: reference ? 1.0 : 0.85,
            priceMin: reference?.priceMin || (parsed.priceMin || 15),
            priceMax: reference?.priceMax || (parsed.priceMax || 35),
            suggestedPrice: reference?.suggestedPrice || (parsed.suggestedPrice || parsed.priceMin || 20),
            isVerified: !!reference,
            currency: AVAILABLE_CURRENCIES[0],
          };
          setResult(apiResult);
          setUsingApi(true);
          Alert.alert('Price Estimated', 'Market value estimated successfully');
        } catch {
          throw new Error('Parse failed');
        }
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.error(error);
      const mockResult: EstimateResult = {
        name: 'Detected Item',
        category: 'Essentials',
        brand: 'Local Brand',
        confidence: 0.85,
        priceMin: 15,
        priceMax: 35,
        suggestedPrice: 20,
        currency: AVAILABLE_CURRENCIES[0],
      };
      setResult(mockResult);
      setUsingApi(false);
      Alert.alert('Price Estimated', 'Market value estimated (simulation)');
    } finally {
      setIsProcessing(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleFileChange(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleFileChange(result.assets[0].uri);
    }
  };

  const resetFlow = () => {
    setImage(null);
    setResult(null);
    setIsProcessing(false);
    setUsingApi(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>💎</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Price Analytics</Text>
            <Text style={styles.headerSubtitle}>Fair market verification</Text>
          </View>
        </View>
        <View ref={dropdownRef} style={styles.currencyContainer}>
          <Pressable style={styles.currencyButton} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <Text style={styles.currencyButtonText}>{currency.code}</Text>
            <Text style={styles.currencyArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {dropdownOpen && (
            <View style={styles.dropdown}>
              {AVAILABLE_CURRENCIES.map((c) => (
                <Pressable
                  key={c.code}
                  style={[styles.dropdownItem, c.code === selectedCurrencyCode && styles.dropdownItemActive]}
                  onPress={() => {
                    setSelectedCurrencyCode(c.code);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, c.code === selectedCurrencyCode && styles.dropdownItemTextActive]}>
                    {c.code} ({c.symbol})
                  </Text>
                  {c.code === selectedCurrencyCode && <Text style={styles.dropdownCheck}>✓</Text>}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.contextToggle}>
          <Pressable
            style={[styles.contextButton, marketContext === 'souk' && styles.contextButtonActive]}
            onPress={() => setMarketContext('souk')}
          >
            <Text style={[styles.contextText, marketContext === 'souk' && styles.contextTextActive]}>Souk / Bazaar</Text>
          </Pressable>
          <Pressable
            style={[styles.contextButton, marketContext === 'modern' && styles.contextButtonActive]}
            onPress={() => setMarketContext('modern')}
          >
            <Text style={[styles.contextText, marketContext === 'modern' && styles.contextTextActive]}>Modern Shop</Text>
          </Pressable>
        </View>

        {!image ? (
          <>
            <Pressable style={styles.cameraButton} onPress={takePhoto}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Snap to verify</Text>
            </Pressable>

            <Pressable style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadIcon}>📤</Text>
              <Text style={styles.uploadText}>Upload from library</Text>
            </Pressable>

            <View style={styles.benchmarksSection}>
              <Text style={styles.benchmarksTitle}>Market Benchmarks</Text>
              <View style={styles.benchmarksGrid}>
                {popularItems.map((item) => (
                  <View key={item.name} style={styles.benchmarkItem}>
                    <Text style={styles.benchmarkName}>{item.name}</Text>
                    <Text style={styles.benchmarkPrice}>
                      {formatRange(
                        item.min * currency.rateFromMAD,
                        item.max * currency.rateFromMAD,
                        currency,
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.resultSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.processingText}>Analyzing metrics...</Text>
                </View>
              )}
            </View>

            {result && !isProcessing && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultIcon}>
                    <Text style={styles.resultIconText}>✓</Text>
                  </View>
                  <View>
                    <View style={styles.resultTitleRow}>
                      <Text style={styles.resultName}>{result.name}</Text>
                      {result.isVerified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.resultCategory}>{result.category}</Text>
                  </View>
                </View>

                <View style={styles.priceRangeBox}>
                  <Text style={styles.priceRangeLabel}>Target fair price</Text>
                  <Text style={styles.priceRangeValue}>
                    {formatRange(
                      result.suggestedPrice * currency.rateFromMAD,
                      result.suggestedPrice * currency.rateFromMAD,
                      currency,
                    ).split(' - ')[0]}
                  </Text>
                  <View style={styles.priceAcceptableRow}>
                    <Text style={styles.priceAcceptableLabel}>Fair range:</Text>
                    <Text style={styles.priceAcceptableValue}>
                      {formatRange(
                        result.priceMin * currency.rateFromMAD,
                        result.priceMax * currency.rateFromMAD,
                        currency,
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.confidenceRow}>
                  <Text style={styles.confidenceLabel}>Source confidence</Text>
                  <Text style={styles.confidenceValue}>{Math.round(result.confidence * 100)}%</Text>
                </View>

                <Text style={styles.resultNote}>
                  {result.isVerified ? 'Grounded by Navito Market Index' : (usingApi ? 'Estimated from image analysis' : 'Fallback simulation used for this preview')}
                </Text>

                <View style={styles.guidanceCard}>
                  <View style={styles.guidanceHeader}>
                    <Text style={styles.guidanceIcon}>💡</Text>
                    <Text style={styles.guidanceTitle}>Negotiation Guidance</Text>
                  </View>
                  <Text style={styles.guidanceItem}>• Start around 40% below the first quote if bargaining is expected.</Text>
                  <Text style={styles.guidanceItem}>• Check quality markers before accepting the reference range.</Text>
                  <Text style={styles.guidanceItem}>• Stay polite and consistent to get better local pricing.</Text>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable style={styles.newScanButton} onPress={resetFlow}>
                    <Text style={styles.newScanText}>New scan</Text>
                  </Pressable>
                  <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Save context</Text>
                  </Pressable>
                </View>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#374151',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  currencyContainer: {
    position: 'relative',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    gap: 6,
  },
  currencyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  currencyArrow: {
    fontSize: 8,
    color: '#64748b',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 100,
    minWidth: 140,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemActive: {
    backgroundColor: '#f8fafc',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#64748b',
  },
  dropdownItemTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  dropdownCheck: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  contextToggle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  contextButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  contextButtonActive: {
    backgroundColor: '#0f172a',
  },
  contextText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contextTextActive: {
    color: '#ffffff',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
  cameraButton: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    paddingVertical: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cameraText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    gap: 10,
  },
  uploadIcon: {
    fontSize: 20,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  benchmarksSection: {
    marginTop: 8,
  },
  benchmarksTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
  },
  benchmarksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  benchmarkItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  benchmarkName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  benchmarkPrice: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    marginTop: 4,
  },
  resultSection: {
    gap: 16,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIconText: {
    fontSize: 18,
    color: '#ffffff',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34d399',
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  resultCategory: {
    fontSize: 12,
    color: '#64748b',
    letterSpacing: 1,
  },
  priceRangeBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  priceRangeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 8,
  },
  priceRangeValue: {
    fontSize: 28,
    fontFamily: 'Inter-Black',
    color: '#0f172a',
  },
  priceAcceptableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  priceAcceptableLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  priceAcceptableValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0ea5e9',
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  resultNote: {
    fontSize: 12,
    color: '#64748b',
  },
  guidanceCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  guidanceIcon: {
    fontSize: 14,
  },
  guidanceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 1,
  },
  guidanceItem: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  newScanButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  newScanText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 1,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
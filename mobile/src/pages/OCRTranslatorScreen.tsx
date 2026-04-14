import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../types/navigation';

const GROQ_API_KEY = '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';

interface OCRTranslatorScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LANGUAGES = [
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
];

export default function OCRTranslatorScreen({ onNavigate }: OCRTranslatorScreenProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [targetLang, setTargetLang] = useState('fr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

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
      processImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (imageUri: string) => {
    setCapturedImage(imageUri);
    setExtractedText('');
    setTranslatedText('');
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
                { type: 'text', text: 'Extract all text visible in this image. Return ONLY the text, no explanations.' },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
              ],
            },
          ],
        }),
      });

      let text = '';
      if (ocrRes.ok) {
        const data = await ocrRes.json();
        text = data.choices?.[0]?.message?.content?.trim() || '';
      } else {
        const errData = await ocrRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'OCR failed: ' + ocrRes.status);
      }

      if (!text) {
        Alert.alert('No text', 'No text found in image');
        setIsProcessing(false);
        return;
      }

      setExtractedText(text);

      const langLabel = LANGUAGES.find(l => l.id === targetLang)?.label || 'French';
      const transRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.1,
          messages: [
            { role: 'user', content: `Translate to ${langLabel}. Reply ONLY with translation:\n${text}` }
          ],
        }),
      });

      if (transRes.ok) {
        const transData = await transRes.json();
        setTranslatedText(transData.choices?.[0]?.message?.content?.trim() || '');
      }
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const changeLang = async (langId: string) => {
    if (!extractedText) return;
    setTargetLang(langId);
    setIsProcessing(true);
    try {
      const langLabel = LANGUAGES.find(l => l.id === langId)?.label || 'French';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.1,
          messages: [
            { role: 'user', content: `Translate to ${langLabel}. Reply ONLY with translation:\n${extractedText}` }
          ],
        }),
      });
      const data = await res.json();
      setTranslatedText(data.choices?.[0]?.message?.content?.trim() || '');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Translation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setExtractedText('');
    setTranslatedText('');
    setTargetLang('fr');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('home')}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}><Text>📷</Text></View>
          <View>
            <Text style={styles.headerTitle}>OCR Translator</Text>
            <Text style={styles.headerSubtitle}>Scan & translate</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!capturedImage ? (
          <>
            <View style={styles.tipBanner}>
              <Text style={styles.tipEmoji}>💡</Text>
              <View>
                <Text style={styles.tipTitle}>How it works</Text>
                <Text style={styles.tipList}>📷 Take photo or upload</Text>
                <Text style={styles.tipList}>🔍 AI reads text</Text>
                <Text style={styles.tipList}>⚡ Instant translation</Text>
              </View>
            </View>

            <Pressable style={styles.cameraButton} onPress={takePhoto}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Take a Photo</Text>
            </Pressable>

            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadIcon}>📤</Text>
              <Text style={styles.uploadText}>Upload Image</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />

            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}

            {extractedText && !isProcessing && (
              <View style={styles.textResult}>
                <Text style={styles.resultLabel}>Original:</Text>
                <Text style={styles.originalText}>{extractedText}</Text>
              </View>
            )}

            {translatedText && !isProcessing && (
              <View style={styles.textResult}>
                <Text style={styles.resultLabel}>Translated:</Text>
                <Text style={styles.translatedText}>{translatedText}</Text>
              </View>
            )}

            <Pressable style={styles.resetButton} onPress={reset}>
              <Text style={styles.resetButtonText}>Try Another</Text>
            </Pressable>
          </View>
        )}

        {extractedText && !isProcessing && (
          <Pressable style={styles.languageButton} onPress={() => setShowLanguageSelector(true)}>
            <Text style={styles.languageButtonFlag}>{LANGUAGES.find(l => l.id === targetLang)?.flag}</Text>
            <Text style={styles.languageButtonText}>Translate to {LANGUAGES.find(l => l.id === targetLang)?.label}</Text>
            <Text style={styles.languageButtonArrow}>▼</Text>
          </Pressable>
        )}

        {showLanguageSelector && (
          <View style={styles.languageOverlay}>
            <Pressable style={styles.languageOverlayBg} onPress={() => setShowLanguageSelector(false)} />
            <View style={styles.languageSheet}>
              <View style={styles.languageSheetHandle} />
              <Text style={styles.languageSheetTitle}>Select Language</Text>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.id}
                  style={[styles.languageSheetItem, targetLang === lang.id && styles.languageSheetItemActive]}
                  onPress={() => {
                    changeLang(lang.id);
                    setShowLanguageSelector(false);
                  }}
                >
                  <Text style={styles.languageSheetFlag}>{lang.flag}</Text>
                  <Text style={[styles.languageSheetLabel, targetLang === lang.id && styles.languageSheetLabelActive]}>{lang.label}</Text>
                  {targetLang === lang.id && <Text style={styles.languageSheetCheck}>✓</Text>}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.languagesBanner}>
          <Text style={styles.languagesText}>Arabic · English · French · Spanish</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { fontSize: 24, color: '#374151', marginBottom: 16 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: '#64748b' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  tipBanner: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 20, padding: 16, marginBottom: 24, gap: 14 },
  tipEmoji: { fontSize: 24 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
  tipList: { fontSize: 13, color: '#1d4ed8', marginBottom: 4 },
  cameraButton: { backgroundColor: '#3b82f6', borderRadius: 24, paddingVertical: 48, alignItems: 'center', marginBottom: 24 },
  cameraIcon: { fontSize: 48, marginBottom: 12 },
  cameraText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  orDivider: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 14, color: '#94a3b8' },
  uploadButton: { borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed', borderRadius: 24, paddingVertical: 32, alignItems: 'center', marginBottom: 24 },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  resultContainer: { marginBottom: 24 },
  previewImage: { width: '100%', height: 250, borderRadius: 20, marginBottom: 20 },
  processingContainer: { alignItems: 'center', padding: 30 },
  processingText: { marginTop: 12, fontSize: 14, color: '#3b82f6' },
  textResult: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, marginBottom: 16 },
  resultLabel: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  originalText: { fontSize: 16, color: '#0f172a' },
  translatedText: { fontSize: 18, fontWeight: '700', color: '#3b82f6', textAlign: 'right' },
  resetButton: { backgroundColor: '#f1f5f9', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  resetButtonText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  languageSelector: { marginBottom: 20 },
  languageLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  languageOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  languageOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f1f5f9', gap: 8 },
  languageOptionActive: { backgroundColor: '#3b82f6' },
  languageFlag: { fontSize: 16 },
  languageName: { fontSize: 13, fontWeight: '500', color: '#64748b' },
  languageNameActive: { color: '#ffffff' },
  languagesBanner: { alignItems: 'center' },
  languagesText: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
  languageButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, justifyContent: 'center', gap: 8 },
  languageButtonFlag: { fontSize: 18 },
  languageButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  languageButtonArrow: { fontSize: 10, color: '#94a3b8' },
  languageOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  languageOverlayBg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  languageSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  languageSheetHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  languageSheetTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16, textAlign: 'center' },
  languageSheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12 },
  languageSheetItemActive: {},
  languageSheetFlag: { fontSize: 24 },
  languageSheetLabel: { fontSize: 16, fontWeight: '500', color: '#374151', flex: 1 },
  languageSheetLabelActive: { color: '#3b82f6', fontWeight: '700' },
  languageSheetCheck: { fontSize: 16, color: '#3b82f6', fontWeight: '700' },
});
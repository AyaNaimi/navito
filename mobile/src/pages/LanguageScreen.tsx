import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ChevronRight, Languages } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';
import { languages } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../services/translation';

interface LanguageScreenProps {
  onSelect: (language: string) => void;
}

const LANG_FLAGS: Record<string, string> = {
  'English': '🇬🇧',
  'Français': '🇫🇷',
  'العربية': '🇸🇦',
  '中文': '🇨🇳',
};

const LANG_CODE_MAP: Record<string, string> = {
  'English': 'en',
  'Français': 'fr',
  'العربية': 'ar',
  '中文': 'zh',
};

export default function LanguageScreen({ onSelect }: LanguageScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isPressed, setIsPressed] = useState(false);
  const { setLanguage, t } = useLanguage();

  const handleContinue = () => {
    const code = LANG_CODE_MAP[selectedLanguage] || 'en';
    setLanguage(code as 'en' | 'fr' | 'ar' | 'zh');
    onSelect(code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Languages size={32} color={colors.primary[500]} />
        </View>
        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>
          {t('language.subtitle')}
        </Text>
      </View>

      {/* Language List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {languages.map((lang) => (
          <Pressable
            key={lang}
            style={[
              styles.languageCard,
              selectedLanguage === lang && styles.languageCardActive,
            ]}
            onPress={() => setSelectedLanguage(lang)}
          >
            <View style={styles.languageLeft}>
              <View
                style={[
                  styles.flagContainer,
                  selectedLanguage === lang && styles.flagContainerActive,
                ]}
              >
                <Text style={styles.flag}>{LANG_FLAGS[lang] || '🌐'}</Text>
              </View>
              <View style={styles.languageInfo}>
                <Text
                  style={[
                    styles.languageName,
                    selectedLanguage === lang && styles.languageNameActive,
                  ]}
                >
                  {lang}
                </Text>
                <Text style={styles.languageNative}>{lang}</Text>
              </View>
            </View>

            {selectedLanguage === lang && (
              <View style={styles.checkContainer}>
                <Check size={20} color={colors.text.inverse} strokeWidth={3} />
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            isPressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          <Text style={styles.continueButtonText}>{t('common.continue')}</Text>
          <ChevronRight size={20} color={colors.text.inverse} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.size.base,
    maxWidth: '80%',
  },
  listContainer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[3],
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border.light,
  },
  languageCardActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagContainerActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  flag: {
    fontSize: 24,
  },
  languageInfo: {
    gap: spacing[1],
  },
  languageName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  languageNameActive: {
    color: colors.text.inverse,
  },
  languageNative: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: spacing[6],
    paddingTop: spacing[4],
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  continueButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  continueButtonText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    color: colors.text.inverse,
  },
});

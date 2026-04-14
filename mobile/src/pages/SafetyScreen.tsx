import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  Phone,
  AlertTriangle,
  Info,
  ChevronRight,
  Siren,
  HeartPulse,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { emergencyNumbers, antiScamTips } from '../data/mockData';

const { width } = Dimensions.get('window');

interface SafetyScreenProps {
  onNavigate: (screen: Screen) => void;
  selectedCity?: string;
}

export default function SafetyScreen({ onNavigate, selectedCity }: SafetyScreenProps) {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Emergency Call', `Would you like to call ${number}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} },
      ]);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[colors.secondary[500], colors.secondary[700]]}
        style={styles.header}
      >
        <View style={styles.headerIconContainer}>
          <Shield size={40} color={colors.text.inverse} />
        </View>
        <Text style={styles.headerTitle}>Safety Center</Text>
        <Text style={styles.headerSubtitle}>
          Secure assistance and travel tips for Morocco
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Emergency Numbers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Siren size={20} color={colors.semantic.error} />
            <Text style={styles.sectionTitle}>Emergency Hotlines</Text>
          </View>

          <View style={styles.emergencyGrid}>
            {emergencyNumbers.map((emergency) => (
              <Pressable
                key={emergency.service}
                style={styles.emergencyCard}
                onPress={() => handleCall(emergency.number)}
              >
                <View style={styles.emergencyIconContainer}>
                  <Phone size={20} color={colors.text.inverse} />
                </View>
                <Text style={styles.emergencyNumber}>{emergency.number}</Text>
                <Text style={styles.emergencyName}>{emergency.service}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Anti-Scam Guide */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShieldAlert size={20} color={colors.secondary[500]} />
            <Text style={styles.sectionTitle}>Essential Safety Tips</Text>
          </View>

          <View style={styles.tipsContainer}>
            {antiScamTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <View style={[styles.tipIconBox, { backgroundColor: tip.severity === 'high' ? colors.semantic.error + '10' : colors.primary[50] }]}>
                  <Info size={22} color={tip.severity === 'high' ? colors.semantic.error : colors.primary[500]} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Support & Reporting */}
        <View style={[styles.section, { marginBottom: 120 }]}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={colors.text.primary} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>

          <Pressable style={styles.reportCard}>
            <View style={styles.reportCardLeft}>
              <View style={styles.reportIconCircle}>
                <AlertTriangle size={24} color={colors.semantic.error} />
              </View>
              <View>
                <Text style={styles.reportCardTitle}>Report an Incident</Text>
                <Text style={styles.reportCardSubtitle}>Instant 24/7 travel support</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </Pressable>

          <View style={styles.trustBanner}>
            <ShieldCheck size={16} color={colors.semantic.success} />
            <Text style={styles.trustText}>All Navito partners are verified local businesses.</Text>
          </View>
        </View>
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
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
    alignItems: 'center',
    textAlign: 'center',
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius['2xl'],
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.inverse,
    marginBottom: spacing[2],
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: spacing[6],
  },
  scrollContent: {
    paddingVertical: spacing[6],
  },
  section: {
    marginBottom: spacing[8],
    paddingHorizontal: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  emergencyCard: {
    width: (width - spacing[6] * 2 - spacing[4]) / 2,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    alignItems: 'center',
    ...shadows.md,
  },
  emergencyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  emergencyNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.semantic.error,
    marginBottom: 4,
  },
  emergencyName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tipsContainer: {
    gap: spacing[4],
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    alignItems: 'flex-start',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tipIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.semantic.error + '08',
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.semantic.error + '20',
  },
  reportCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  reportIconCircle: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: colors.semantic.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportCardTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.semantic.error,
  },
  reportCardSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing[6],
  },
  trustText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    color: colors.text.tertiary,
  },
});

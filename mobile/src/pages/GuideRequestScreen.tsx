import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  FileText, 
  CheckCircle2,
  User
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { guides } from '../data/mockData';

interface GuideRequestScreenProps {
  onSubmit: () => void;
  onBack: () => void;
  guideId?: number;
}

export default function GuideRequestScreen({ onSubmit, onBack, guideId = 1 }: GuideRequestScreenProps) {
  const guide = guides.find(g => g.id === guideId) || guides[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Booking Request</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Guide Context Card */}
        <View style={styles.guideCard}>
          <Image source={{ uri: guide.image }} style={styles.avatar} />
          <View style={styles.guideInfo}>
            <Text style={styles.guideName}>{guide.name}</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{guide.specialty}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: colors.secondary[50] }]}>
                <Text style={[styles.tagText, { color: colors.secondary[600] }]}>{guide.city}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Request Details</Text>

          {/* Date Picker (Mocked as Input) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Planned Date</Text>
            <Pressable style={styles.inputBox}>
              <Calendar size={20} color={colors.text.tertiary} />
              <Text style={styles.inputText}>Select a date</Text>
            </Pressable>
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.radioGroup}>
              {['Half Day', 'Full Day', 'Multiple Days'].map((option) => (
                <Pressable 
                  key={option} 
                  style={[styles.radioItem, option === 'Half Day' && styles.radioActive]}
                >
                  <Text style={[styles.radioText, option === 'Half Day' && styles.radioTextActive]}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Travelers */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Travelers</Text>
            <View style={styles.counter}>
              <Users size={20} color={colors.text.tertiary} />
              <TextInput 
                style={styles.counterInput}
                placeholder="2"
                keyboardType="numeric"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>

          {/* Message */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Requests</Text>
            <View style={[styles.inputBox, styles.textArea]}>
              <FileText size={20} color={colors.text.tertiary} style={{ marginTop: 2 }} />
              <TextInput 
                style={styles.textInput}
                placeholder="Tell the guide about your interests..."
                multiline
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Rate ({guide.pricePerHalfDay} MAD/半日)</Text>
            <Text style={styles.summaryValue}>{guide.pricePerHalfDay} MAD</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>15 MAD</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Estimated</Text>
            <Text style={styles.totalValue}>{guide.pricePerHalfDay + 15} MAD</Text>
          </View>
        </View>

        <Pressable style={styles.submitButton} onPress={onSubmit}>
          <LinearGradient
            colors={[colors.secondary[500], colors.secondary[600]]}
            style={styles.gradientButton}
          >
            <Text style={styles.submitButtonText}>Confirm Booking Request</Text>
            <CheckCircle2 size={20} color={colors.text.inverse} />
          </LinearGradient>
        </Pressable>
        
        <Text style={styles.disclaimer}>
          The guide will respond within {guide.responseTime}. No payment is required until approval.
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: spacing[6],
    paddingBottom: 40,
  },
  guideCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[4],
    alignItems: 'center',
    gap: spacing[4],
    ...shadows.md,
    marginBottom: spacing[8],
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.primary,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.primary[600],
    textTransform: 'uppercase',
  },
  formContainer: {
    gap: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  inputGroup: {
    gap: spacing[2],
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3.5],
  },
  inputText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radioActive: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[200],
  },
  radioText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  radioTextActive: {
    color: colors.secondary[700],
    fontFamily: typography.fontFamily.bold,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  counterInput: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  textArea: {
    alignItems: 'flex-start',
    height: 100,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.primary,
    textAlignVertical: 'top',
  },
  summaryBox: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    marginTop: spacing[8],
    gap: spacing[3],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing[1],
  },
  totalLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  totalValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.secondary[600],
  },
  submitButton: {
    marginTop: spacing[8],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: spacing[4],
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.inverse,
  },
  disclaimer: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[4],
    lineHeight: 16,
  },
});

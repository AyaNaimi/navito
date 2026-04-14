import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Type, 
  MapPin, 
  FileText, 
  Users, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface ApplyFormScreenProps {
  onSubmit: () => void;
  onBack: () => void;
}

export default function ApplyFormScreen({ onSubmit, onBack }: ApplyFormScreenProps) {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Create Activity</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.iconCircle}>
              <Sparkles size={32} color={colors.secondary[500]} />
            </View>
            <Text style={styles.title}>Host an Experience</Text>
            <Text style={styles.subtitle}>
              Share your favorite spots or hidden gems with the community.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Type size={14} color={colors.text.secondary} />
                <Text style={styles.label}>Activity Title</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., Hidden Rooftop Photography"
                placeholderTextColor={colors.text.tertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MapPin size={14} color={colors.text.secondary} />
                <Text style={styles.label}>City/Location</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., Fes Medina"
                placeholderTextColor={colors.text.tertiary}
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <FileText size={14} color={colors.text.secondary} />
                <Text style={styles.label}>Details & Requirements</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What will you do? What should people bring?"
                placeholderTextColor={colors.text.tertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
              />
            </View>

            {/* Additional Info Row */}
            <View style={styles.infoSummary}>
              <View style={styles.infoBadge}>
                <Users size={12} color={colors.text.secondary} />
                <Text style={styles.infoBadgeText}>Public Group</Text>
              </View>
              <View style={styles.infoBadge}>
                <Calendar size={12} color={colors.text.secondary} />
                <Text style={styles.infoBadgeText}>Community Post</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.submitButton} onPress={onSubmit}>
                <LinearGradient
                  colors={[colors.secondary[500], colors.secondary[600]]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.submitButtonText}>Publish Experience</Text>
                  <ArrowRight size={20} color={colors.text.inverse} />
                </LinearGradient>
              </Pressable>
              
              <Text style={styles.note}>
                By publishing, you agree to our Community Guidelines.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
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
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.secondary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
    lineHeight: 22,
  },
  form: {
    gap: spacing[6],
  },
  inputGroup: {
    gap: spacing[2],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
    paddingLeft: 2,
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  input: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: spacing[4],
  },
  infoSummary: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.base,
  },
  infoBadgeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    color: colors.text.secondary,
  },
  buttonContainer: {
    marginTop: spacing[4],
    gap: spacing[4],
  },
  submitButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: spacing[4.5],
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.inverse,
  },
  note: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

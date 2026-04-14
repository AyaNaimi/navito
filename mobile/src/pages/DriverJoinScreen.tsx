import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from '../types/navigation';
import { colors, typography, spacing, borderRadius } from '../theme';

interface DriverJoinScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function DriverJoinScreen({ onNavigate }: DriverJoinScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [license, setLicense] = useState('');

  const handleSubmit = () => {
    if (name && phone && vehicle && license) {
      setStep(2);
    }
  };

  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Request Submitted!</Text>
          <Text style={styles.successText}>
            Your driver application is being reviewed. We'll notify you once approved.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => onNavigate('home')}>
            <Text style={styles.primaryButtonText}>Go Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('profile')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Become a Driver</Text>
          <Text style={styles.headerSubtitle}>Join Navito partner network</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why join?</Text>
          <Text style={styles.infoItem}>💰 Earn up to 500 MAD/day</Text>
          <Text style={styles.infoItem}>📅 Flexible hours</Text>
          <Text style={styles.infoItem}>🚗 Professional vehicle</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.text.tertiary}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="+212 6XX XXX XXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={colors.text.tertiary}
          />

          <Text style={styles.label}>Vehicle Type</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Toyota, Mercedes..."
            value={vehicle}
            onChangeText={setVehicle}
            placeholderTextColor={colors.text.tertiary}
          />

          <Text style={styles.label}>License Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter license number"
            value={license}
            onChangeText={setLicense}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing[6], gap: spacing[4] },
  backButton: { padding: spacing[2] },
  backButtonText: { fontSize: 24, color: colors.text.primary },
  headerTitle: { fontSize: 20, fontWeight: typography.weight.bold, color: colors.text.primary },
  headerSubtitle: { fontSize: 13, color: colors.text.secondary },
  content: { flex: 1, paddingHorizontal: spacing[6] },
  infoCard: { backgroundColor: colors.primary[50], borderRadius: borderRadius.xl, padding: spacing[6], marginBottom: spacing[8] },
  infoTitle: { fontSize: 16, fontWeight: typography.weight.bold, color: colors.primary[700], marginBottom: spacing[3] },
  infoItem: { fontSize: 14, color: colors.primary[600], marginBottom: spacing[2] },
  form: { marginBottom: spacing[8] },
  label: { fontSize: 14, fontWeight: typography.weight.semibold, color: colors.text.primary, marginBottom: spacing[3], marginTop: spacing[4] },
  input: { backgroundColor: colors.background.secondary, borderRadius: borderRadius.md, padding: spacing[4], fontSize: 14, color: colors.text.primary },
  submitButton: { backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, padding: spacing[6], alignItems: 'center', marginBottom: spacing[8] },
  submitButtonText: { fontSize: 16, fontWeight: typography.weight.bold, color: colors.text.inverse },
  successContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing[10] },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.semantic.success, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[6] },
  successIconText: { fontSize: 40, color: colors.text.inverse },
  successTitle: { fontSize: 24, fontWeight: typography.weight.bold, color: colors.text.primary, textAlign: 'center', marginBottom: spacing[3] },
  successText: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing[6] },
  primaryButton: { backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, padding: spacing[6], alignItems: 'center', width: '100%' },
  primaryButtonText: { fontSize: 16, fontWeight: typography.weight.bold, color: colors.text.inverse },
});
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from '../types/navigation';
import { colors, typography, spacing, borderRadius } from '../theme';

interface DriverPendingScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function DriverPendingScreen({ onNavigate }: DriverPendingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⏳</Text>
        </View>
        <Text style={styles.title}>Under Review</Text>
        <Text style={styles.text}>
          Your driver application is being reviewed. This usually takes 24-48 hours. We'll notify you once approved.
        </Text>
        <Text style={styles.note}>
          You can check your status anytime from your profile.
        </Text>
        <Pressable style={styles.button} onPress={() => onNavigate('home')}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, padding: spacing[10], justifyContent: 'center', alignItems: 'center' },
  iconContainer: { marginBottom: spacing[6] },
  icon: { fontSize: 64 },
  title: { fontSize: 24, fontWeight: typography.weight.bold, color: colors.text.primary, marginBottom: spacing[3] },
  text: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing[3] },
  note: { fontSize: 12, color: colors.text.tertiary, textAlign: 'center', marginBottom: spacing[8] },
  button: { backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, paddingVertical: spacing[4], paddingHorizontal: spacing[8] },
  buttonText: { fontSize: 16, fontWeight: typography.weight.bold, color: colors.text.inverse },
});
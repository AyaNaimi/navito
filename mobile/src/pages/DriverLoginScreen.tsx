import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Shield, Key, ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';

interface DriverLoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export default function DriverLoginScreen({ onLogin, onRegister, onBack }: DriverLoginScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Car size={40} color={colors.primary[500]} />
          </View>
          <Text style={styles.title}>Chauffeur Navito</Text>
          <Text style={styles.subtitle}>Connectez-vous pour gérer vos courses</Text>
        </View>

        <Pressable style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
          <ArrowRight size={20} color={colors.text.inverse} />
        </Pressable>

        <Pressable style={styles.registerButton} onPress={onRegister}>
          <Text style={styles.registerButtonText}>Créer un compte</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, padding: spacing[6], paddingTop: spacing[4] },
  backButton: { marginBottom: spacing[6] },
  backText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.base, color: colors.primary[500] },
  header: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[4] },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary[100], alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size['2xl'], color: colors.text.primary },
  subtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.text.secondary, textAlign: 'center' },
  loginButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[3], height: 56, backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, marginBottom: spacing[4] },
  loginButtonText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md, color: colors.text.inverse },
  registerButton: { height: 56, backgroundColor: colors.surface.primary, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border.light },
  registerButtonText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.md, color: colors.primary[500] },
});
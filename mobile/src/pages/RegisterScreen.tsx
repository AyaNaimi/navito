import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, KeyboardAvoidingView, Animated, TextInput, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';

interface RegisterScreenProps {
  onRegister: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const GOOGLE_CLIENT_ID = '849106268331-hgr4tac0fon917qk3qnjt7or2aj5hp9r.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = 'http://localhost';

export default function RegisterScreen({ onRegister, onLogin, onBack }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegister();
    }, 500);
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const authUrl = 
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${GOOGLE_REDIRECT_URI}&` +
        `response_type=code&` +
        `scope=email%20profile%20openid`;
      await Linking.openURL(authUrl);
    } catch (error) {
      Alert.alert('Error', 'Failed to open Google sign up');
    }
    setTimeout(() => setIsGoogleLoading(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Pressable onPress={onBack} style={styles.backButton}><Text style={styles.backText}>← Back</Text></Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join Navito and start exploring</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={colors.text.tertiary} value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor={colors.text.tertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} placeholder="Choose a password" placeholderTextColor={colors.text.tertiary} value={password} onChangeText={setPassword} secureTextEntry />
            </View>
          </View>

          <Pressable style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} onPress={handleRegister} disabled={isLoading}>
            <Text style={styles.registerButtonText}>{isLoading ? 'Creating account...' : 'Create Account'}</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={[styles.socialButton, isGoogleLoading && styles.socialButtonDisabled]} onPress={handleGoogleSignUp} disabled={isGoogleLoading}>
              <Text style={styles.socialButtonText}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton}><Text style={styles.socialButtonText}>f</Text></Pressable>
            <Pressable style={styles.socialButton}><Text style={styles.socialButtonText}></Text></Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={onLogin}><Text style={styles.linkText}>Sign in</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flexGrow: 1, paddingHorizontal: spacing[6], paddingTop: spacing[4], paddingBottom: spacing[10] },
  backButton: { marginBottom: spacing[6] },
  backText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.base, color: colors.primary[500] },
  header: { marginBottom: spacing[8] },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size['3xl'], color: colors.text.primary, marginBottom: spacing[2] },
  subtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.lg, color: colors.text.secondary },
  form: { gap: spacing[5], marginBottom: spacing[6] },
  inputGroup: { gap: spacing[2] },
  label: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary },
  input: { height: 56, backgroundColor: colors.surface.primary, borderRadius: borderRadius.lg, paddingHorizontal: spacing[4], fontFamily: typography.fontFamily.regular, fontSize: typography.size.md, color: colors.text.primary, borderWidth: 1.5, borderColor: colors.border.light },
  registerButton: { height: 56, backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  registerButtonDisabled: { opacity: 0.7 },
  registerButtonText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.md, color: colors.text.inverse },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginVertical: spacing[6] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border.light },
  dividerText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.text.tertiary },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: spacing[4], marginBottom: spacing[8] },
  socialButton: { width: 56, height: 56, borderRadius: borderRadius.lg, backgroundColor: colors.surface.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border.light },
  socialButtonDisabled: { opacity: 0.5 },
  socialButtonText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.primary },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: spacing[4] },
  footerText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.text.secondary },
  linkText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.base, color: colors.primary[500] },
});
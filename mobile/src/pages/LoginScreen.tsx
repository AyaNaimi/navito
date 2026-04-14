import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, KeyboardAvoidingView, Animated, TextInput, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onSkip: () => void;
}

const GOOGLE_CLIENT_ID = '849106268331-hgr4tac0fon917qk3qnjt7or2aj5hp9r.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = 'http://localhost';

export default function LoginScreen({ onLogin, onRegister, onSkip }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 500);
  };

  const handleGoogleSignIn = async () => {
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
      Alert.alert('Error', 'Failed to open Google sign in');
    }
    setTimeout(() => setIsGoogleLoading(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}>
                <Mail size={20} color={colors.text.tertiary} />
                <TextInput style={styles.input} placeholder="name@example.com" placeholderTextColor={colors.text.tertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
                <Lock size={20} color={colors.text.tertiary} />
                <TextInput style={styles.input} placeholder="Enter password" placeholderTextColor={colors.text.tertiary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)} />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color={colors.text.tertiary} /> : <Eye size={20} color={colors.text.tertiary} />}
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.loginButtonText}>{isLoading ? 'Signing in...' : 'Sign in'}</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable style={[styles.socialButton, isGoogleLoading && styles.socialButtonDisabled]} onPress={handleGoogleSignIn} disabled={isGoogleLoading}>
              <Text style={styles.socialButtonText}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton}><Text style={styles.socialButtonText}>f</Text></Pressable>
            <Pressable style={styles.socialButton}><Text style={styles.socialButtonText}></Text></Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={onRegister}><Text style={styles.registerLink}>Sign up</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flexGrow: 1, paddingHorizontal: spacing[6], paddingTop: spacing[8], paddingBottom: spacing[10] },
  header: { marginBottom: spacing[8] },
  greeting: { fontFamily: typography.fontFamily.bold, fontSize: typography.size['3xl'], color: colors.text.primary, marginBottom: spacing[2] },
  subtitle: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.lg, color: colors.text.secondary },
  form: { gap: spacing[5], marginBottom: spacing[6] },
  inputContainer: { gap: spacing[2] },
  inputLabel: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.primary },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: colors.surface.primary, borderRadius: borderRadius.lg, paddingHorizontal: spacing[4], gap: spacing[3], borderWidth: 1.5, borderColor: colors.border.light },
  inputWrapperFocused: { borderColor: colors.primary[500] },
  input: { flex: 1, fontFamily: typography.fontFamily.regular, fontSize: typography.size.md, color: colors.text.primary, height: 56 },
  loginButton: { height: 56, backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.md, color: colors.text.inverse },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginVertical: spacing[6] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border.light },
  dividerText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: colors.text.tertiary },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: spacing[4], marginBottom: spacing[8] },
  socialButton: { width: 56, height: 56, borderRadius: borderRadius.lg, backgroundColor: colors.surface.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border.light },
  socialButtonDisabled: { opacity: 0.5 },
  socialButtonText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.primary },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: spacing[4] },
  footerText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: colors.text.secondary },
  registerLink: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.base, color: colors.primary[500] },
});
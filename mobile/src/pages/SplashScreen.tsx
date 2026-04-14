import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUp }],
          }
        ]}
      >
        <View style={styles.logoWrapper}>
          <Animated.View style={[styles.glowCircle, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
          <Text style={styles.brandName}>Navito</Text>
        </View>

        <View style={styles.taglineContainer}>
          <View style={styles.line} />
          <Text style={styles.tagline}>Your Journey Starts Here</Text>
          <View style={styles.line} />
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.version}>v2.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary[100],
  },
  brandName: {
    fontFamily: 'serif',
    fontSize: 64,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -1,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[8],
    gap: 12,
  },
  line: {
    width: 24,
    height: 1,
    backgroundColor: colors.primary[300],
  },
  tagline: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.text.tertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: spacing[12],
  },
  version: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.text.tertiary,
    letterSpacing: 1,
    opacity: 0.4,
  },
});
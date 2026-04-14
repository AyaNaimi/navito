import React, { useRef, useState, useCallback } from 'react';
import { Text, StyleSheet, Animated, Pressable, ActivityIndicator, Platform, View, ViewStyle, TextStyle } from 'react-native';
import { Check, ArrowRight } from 'lucide-react-native';
import { theme } from '../theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  success = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  fullWidth = true,
}: AnimatedButtonProps) {
  const scaleRef = useRef(new Animated.Value(1)).current;
  const opacityRef = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleRef, {
        toValue: 0.96,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityRef, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleRef, opacityRef, disabled, loading]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleRef, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityRef, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleRef, opacityRef]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.94,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRef, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  }, [scaleRef, disabled, loading, onPress]);

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = { ...styles.container };
    
    switch (size) {
      case 'small':
        Object.assign(base, styles.containerSmall);
        break;
      case 'large':
        Object.assign(base, styles.containerLarge);
        break;
      default:
        Object.assign(base, styles.containerMedium);
    }

    switch (variant) {
      case 'secondary':
        Object.assign(base, styles.containerSecondary);
        break;
      case 'outline':
        Object.assign(base, styles.containerOutline);
        break;
      case 'ghost':
        Object.assign(base, styles.containerGhost);
        break;
      default:
        Object.assign(base, styles.containerPrimary);
    }

    if (disabled) Object.assign(base, styles.containerDisabled);
    if (loading) Object.assign(base, styles.containerLoading);
    if (fullWidth) Object.assign(base, styles.containerFullWidth);

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = { ...styles.text };
    
    switch (size) {
      case 'small':
        Object.assign(base, styles.textSmall);
        break;
      case 'large':
        Object.assign(base, styles.textLarge);
        break;
      default:
        Object.assign(base, styles.textMedium);
    }

    switch (variant) {
      case 'secondary':
        Object.assign(base, styles.textSecondary);
        break;
      case 'outline':
        Object.assign(base, styles.textOutline);
        break;
      case 'ghost':
        Object.assign(base, styles.textGhost);
        break;
      default:
        Object.assign(base, styles.textPrimary);
    }

    if (disabled) Object.assign(base, styles.textDisabled);
    if (loading) Object.assign(base, styles.textLoading);

    return base;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : theme.colors.primary} 
        />
      );
    }

    if (success) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.successIcon}>
            <Check size={20} color="#ffffff" strokeWidth={3} />
          </View>
          <Text style={getTextStyle()}>SUCCESS</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
        <Text style={getTextStyle()}>{title}</Text>
        {icon && iconPosition === 'right' && !loading && (
          <View style={styles.iconRight}>
            {typeof icon === 'boolean' ? (
              <ArrowRight size={18} color={variant === 'primary' ? '#ffffff' : theme.colors.foreground} />
            ) : icon}
          </View>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleRef }], opacity: opacityRef },
        isPressed ? styles.containerPressed : {},
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={getContainerStyle}
      >
        {renderContent()}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  containerSmall: {
    height: 40,
    paddingHorizontal: 20,
  },
  containerMedium: {
    height: 56,
    paddingHorizontal: 28,
  },
  containerLarge: {
    height: 68,
    paddingHorizontal: 36,
  },
  containerPrimary: {
    backgroundColor: theme.colors.foreground,
  },
  containerSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.foreground,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  containerGhost: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  containerDisabled: {
    opacity: 0.5,
  },
  containerLoading: {
    opacity: 0.8,
  },
  containerFullWidth: {
    width: '100%',
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 15,
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: theme.colors.foreground,
  },
  textOutline: {
    color: theme.colors.foreground,
  },
  textGhost: {
    color: theme.colors.foreground,
  },
  textDisabled: {
    color: theme.colors.mutedForeground,
  },
  textLoading: {
    opacity: 0.7,
  },
  iconLeft: {
    marginRight: 2,
  },
  iconRight: {
    marginLeft: 2,
  },
  successIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

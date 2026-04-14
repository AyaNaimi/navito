import React, { useRef, useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, Pressable, Platform, ViewStyle, TextStyle } from 'react-native';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../theme';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  success,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  onBlur,
  onFocus,
  icon,
  disabled = false,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleRef = useRef(new Animated.Value(1)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(labelPosition, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus?.();
  }, [labelPosition, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.();
  }, [labelPosition, value, onBlur]);

  const handlePressIn = () => {
    Animated.spring(scaleRef, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleRef, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const labelStyle: Animated.WithAnimatedObject<TextStyle> = {
    position: 'absolute' as const,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 8],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.mutedForeground, isFocused ? theme.colors.primary : theme.colors.mutedForeground],
    }),
  };

  const getBorderColor = (): string => {
    if (error) return '#ef4444';
    if (success) return '#22c55e';
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const inputStyles: ViewStyle[] = [styles.inputContainer, { borderColor: getBorderColor() }];
  if (isFocused) inputStyles.push(styles.inputContainerFocused);
  if (disabled) inputStyles.push(styles.inputContainerDisabled);

  const textInputStyles: TextStyle[] = [styles.input];
  if (multiline) textInputStyles.push(styles.multilineInput);
  if (icon) textInputStyles.push(styles.inputWithIcon);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleRef }] }]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={inputStyles}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <View style={styles.inputWrapper}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <TextInput
              style={textInputStyles}
              value={value}
              onChangeText={onChangeText}
              placeholder={isFocused ? placeholder : ''}
              placeholderTextColor={theme.colors.mutedForeground}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              multiline={multiline}
              numberOfLines={numberOfLines}
              maxLength={maxLength}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={!disabled}
            />
            {secureTextEntry && (
              <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={theme.colors.mutedForeground} />
                ) : (
                  <Eye size={20} color={theme.colors.mutedForeground} />
                )}
              </Pressable>
            )}
            {(error || success) && (
              <View style={styles.statusIcon}>
                {error && <AlertCircle size={20} color="#ef4444" />}
                {success && !error && <CheckCircle size={20} color="#22c55e" />}
              </View>
            )}
          </View>
        </View>
      </Pressable>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainerFocused: {
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputContainerDisabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.muted,
  },
  label: {
    position: 'absolute',
    left: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 60,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.foreground,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 32,
  },
  inputWithIcon: {
    paddingLeft: 50,
  },
  iconContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 2,
  },
  eyeButton: {
    padding: 10,
    marginRight: 8,
  },
  statusIcon: {
    padding: 10,
    marginRight: 8,
  },
  errorContainer: {
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
});

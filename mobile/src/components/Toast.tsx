import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Platform } from 'react-native';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react-native';
import { theme } from '../theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<Toast | null>(null);
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
      translateY.setValue(100);
      opacity.setValue(0);
    });
  }, [translateY, opacity]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newToast: Toast = {
      id: Date.now().toString(),
      message,
      type,
      duration,
    };

    setToast(newToast);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [translateY, opacity, hideToast]);

  const getIcon = () => {
    if (!toast) return null;
    
    const iconProps = { size: 20 };
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} color="#22c55e" />;
      case 'error':
        return <AlertCircle {...iconProps} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle {...iconProps} color="#f59e0b" />;
      case 'info':
      default:
        return <Info {...iconProps} color="#3b82f6" />;
    }
  };

  const getBackgroundColor = () => {
    if (!toast) return theme.colors.card;
    
    switch (toast.type) {
      case 'success':
        return '#f0fdf4';
      case 'error':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      case 'info':
      default:
        return '#eff6ff';
    }
  };

  const getBorderColor = () => {
    if (!toast) return theme.colors.border;
    
    switch (toast.type) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
      default:
        return '#3b82f6';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              opacity,
              backgroundColor: getBackgroundColor(),
              borderLeftColor: getBorderColor(),
            },
          ]}
        >
          <View style={styles.iconContainer}>{getIcon()}</View>
          <Text style={styles.message}>{toast.message}</Text>
          <Pressable onPress={hideToast} style={styles.closeButton}>
            <X size={18} color={theme.colors.mutedForeground} />
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

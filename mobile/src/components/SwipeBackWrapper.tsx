import React, { useRef, useCallback, ReactNode } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, Platform } from 'react-native';
import { theme } from '../theme';

interface SwipeBackWrapperProps {
  children: ReactNode;
  onSwipeBack: () => void;
  enabled?: boolean;
  threshold?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const VELOCITY_THRESHOLD = 0.5;

export default function SwipeBackWrapper({
  children,
  onSwipeBack,
  enabled = true,
  threshold = SWIPE_THRESHOLD,
}: SwipeBackWrapperProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const currentX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return enabled && gestureState.dx >= 0 && currentX.current <= 10;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        return enabled && isHorizontalSwipe && gestureState.dx > 10 && currentX.current <= 10;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(currentX.current);
        translateX.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          currentX.current = 0;
          translateX.setValue(0);
          return;
        }
        const newX = Math.min(gestureState.dx, SCREEN_WIDTH * 0.8);
        translateX.setValue(newX);
        
        const progress = newX / SCREEN_WIDTH;
        opacity.setValue(progress * 0.5);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        const shouldGoBack = 
          gestureState.dx > threshold || 
          (gestureState.dx > 50 && gestureState.vx > VELOCITY_THRESHOLD);

        if (shouldGoBack) {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: SCREEN_WIDTH,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            currentX.current = 0;
            translateX.setValue(0);
            opacity.setValue(0);
            onSwipeBack();
          });
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 8,
              tension: 100,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            currentX.current = 0;
          });
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          currentX.current = 0;
        });
      },
    })
  ).current;

  const backdropOpacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
      {enabled && (
        <View style={styles.swipeIndicator} pointerEvents="none">
          <View style={styles.arrow} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  swipeIndicator: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  arrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: theme.colors.mutedForeground,
    transform: [{ rotate: '45deg' }],
    opacity: 0.4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

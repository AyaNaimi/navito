import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    title: 'Explore the World',
    description: 'Discover amazing destinations and hidden gems around the globe.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    title: 'Your Journey Awaits',
    description: 'Navigate with confidence using smart local insights.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
    title: 'Start Adventure',
    description: 'Begin your unforgettable travel experience today.',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = (index: number) => {
    if (index < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
    });

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
    });

    return (
      <View style={styles.slide}>
        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.image, { transform: [{ scale }], opacity }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        />
        
        <SafeAreaView style={styles.slideContent} pointerEvents="box-none">
          <Animated.View style={[styles.textBlock, { transform: [{ translateY: textTranslateY }] }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>

          <View style={styles.footer}>
            <Pressable
              style={styles.nextButton}
              onPress={() => handleNext(index)}
            >
              <Text style={styles.nextButtonText}>
                {index === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <ArrowRight size={20} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      <View style={styles.pagination}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotScaleX = scrollX.interpolate({
            inputRange,
            outputRange: [1, 3, 1],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { transform: [{ scaleX: dotScaleX }], opacity: dotOpacity }]}
            />
          );
        })}
      </View>

      <Pressable style={styles.skipButton} onPress={onComplete}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  slide: {
    width,
    height,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[8],
    paddingBottom: spacing[12],
  },
  textBlock: {
    marginBottom: spacing[10],
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 42,
    color: 'white',
    lineHeight: 50,
    marginBottom: spacing[4],
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 26,
  },
  footer: {
    marginTop: spacing[8],
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[5],
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  nextButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: 'white',
  },
  pagination: {
    position: 'absolute',
    top: height * 0.12,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  skipButton: {
    position: 'absolute',
    top: height * 0.1,
    right: spacing[6],
    padding: spacing[3],
  },
  skipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
});
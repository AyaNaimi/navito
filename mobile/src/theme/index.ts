/**
 * Navito Design System v2.0
 * International Premium Theme
 * Supports: iOS, Android, Web
 * Languages: EN, FR, ES, AR, DE, etc.
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Screen breakpoints for responsive design
export const SCREEN = {
  width,
  height,
  isSmall: width < 360,
  isMedium: width >= 360 && width < 414,
  isLarge: width >= 414,
  isTablet: width >= 768,
};

// Color Palette - Morocco Luxe (International Friendly)
export const colors = {
  // Primary - Warm Coral Orange (universally welcoming)
  primary: {
    50: '#FFF5EB',
    100: '#FFE4D6',
    200: '#FFC9AC',
    300: '#FFA47A',
    400: '#FF7A4A',
    500: '#E85D04', // Main primary
    600: '#CC4E02',
    700: '#A33D02',
    800: '#7A2E02',
    900: '#521F01',
  },

  // Secondary - Teal (trust, international appeal)
  secondary: {
    50: '#E8F5F6',
    100: '#C8E8EA',
    200: '#9DD5D8',
    300: '#6FBFC4',
    400: '#4BA5AB',
    500: '#006D77', // Main secondary
    600: '#005A62',
    700: '#00474E',
    800: '#003539',
    900: '#002325',
  },

  // Accent - Soft Gold (luxury touch)
  accent: {
    50: '#FBF5ED',
    100: '#F5E8D6',
    200: '#EBD4B0',
    300: '#E0BC89',
    400: '#D4A574', // Main accent
    500: '#C9945C',
    600: '#B8824A',
    700: '#9A6B3D',
    800: '#7C5531',
    900: '#5E4025',
  },

  // Background Colors
  background: {
    primary: '#FAFAFA',
    secondary: '#F5F5F5',
    tertiary: '#EBEBEB',
    elevated: '#FFFFFF',
  },

  // Surface Colors
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8F8F8',
    tertiary: '#F0F0F0',
  },

  // Text Colors
  text: {
    primary: '#2D3436',
    secondary: '#636E72',
    tertiary: '#B2BEC3',
    inverse: '#FFFFFF',
    disabled: '#B2BEC3',
  },

  // Semantic Colors
  semantic: {
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E17055',
    info: '#74B9FF',
  },

  // Border Colors
  border: {
    light: '#E8E8E8',
    default: '#DEDEDE',
    focus: '#E85D04',
  },

  // Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
};

// Typography - Inter (supports all glyphs)
export const typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'Inter-Regular',
      android: 'Inter-Regular',
      default: 'Inter-Regular',
    }),
    medium: Platform.select({
      ios: 'Inter-Medium',
      android: 'Inter-Medium',
      default: 'Inter-Medium',
    }),
    semibold: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
      default: 'Inter-SemiBold',
    }),
    bold: Platform.select({
      ios: 'Inter-Bold',
      android: 'Inter-Bold',
      default: 'Inter-Bold',
    }),
  },

  // Font sizes - optimized for i18n (longer texts in some languages)
  size: {
    xs: 10,    // Captions, badges
    sm: 12,    // Labels, timestamps
    base: 14,  // Body text
    md: 16,    // Input text, buttons
    lg: 18,    // Subheadings
    xl: 20,    // H3
    '2xl': 24, // H2
    '3xl': 32, // H1
    '4xl': 40, // Display
  },

  // Line heights - generous for readability
  lineHeight: {
    tight: 1.2,   // Headings
    normal: 1.5,  // Body text
    relaxed: 1.75, // Long form text
  },

  // Font weights
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Letter spacing (no uppercase excess)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Spacing system (4px base grid)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Border radius (universal appeal)
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadow system (subtle, platform-specific)
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: { elevation: 2 },
    default: {},
  }),
  base: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: { elevation: 3 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 6 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: { elevation: 10 },
    default: {},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 32,
    },
    android: { elevation: 16 },
    default: {},
  }),
};

// Animation constants (smooth, accessible)
export const animation = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 800,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: Platform.select({
      ios: { friction: 8, tension: 40 },
      android: { friction: 8, tension: 40 },
      default: {},
    }),
  },
};

// Component-specific tokens
export const components = {
  // Button
  button: {
    height: {
      sm: 40,
      base: 48,
      lg: 56,
    },
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[6],
  },

  // Input
  input: {
    height: 56,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
  },

  // Card
  card: {
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
  },

  // Avatar
  avatar: {
    sm: 32,
    base: 40,
    lg: 56,
    xl: 80,
  },

  // Icon
  icon: {
    sm: 16,
    base: 24,
    lg: 32,
    xl: 40,
  },
};

// Utility for creating themed styles
export const createThemedStyles = (isRTL: boolean = false) => ({
  direction: isRTL ? 'rtl' : 'ltr',
  flexDirection: isRTL ? 'row-reverse' : 'row',
  textAlign: isRTL ? 'right' : 'left',
});

// Legacy theme export for backward compatibility
export const theme = {
  colors: {
    primary: '#E85D04',
    primaryForeground: '#FFFFFF',
    secondary: '#006D77',
    secondaryForeground: '#FFFFFF',
    background: '#FAFAFA',
    foreground: '#2D3436',
    card: '#FFFFFF',
    cardForeground: '#2D3436',
    muted: '#F5F5F5',
    mutedForeground: '#636E72',
    accent: '#D4A574',
    accentForeground: '#2D3436',
    border: '#DEDEDE',
    input: '#FFFFFF',
    ring: '#E85D04',
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing,
  borderRadius,
  typography,
  shadows,
  animation,
  components,
  SCREEN,
};

export default theme;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mobile-optimized spacing scale (in pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
};

// Minimum touch target size for mobile (Apple HIG: 44x44px minimum)
export const minTouchTarget = "min-h-[44px] min-w-[44px]";

// Safe area insets for notched devices (iPhone notch, dynamic island)
export const safeAreaTop = "pt-[env(safe-area-inset-top)]";
export const safeAreaBottom = "pb-[env(safe-area-inset-bottom)]";
export const safeAreaLeft = "pl-[env(safe-area-inset-left)]";
export const safeAreaRight = "pr-[env(safe-area-inset-right)]";

// Haptic feedback helper (works with iOS Safari and Android Chrome)
export const hapticFeedback = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [40],
      success: [50, 50, 50],
      error: [100, 50, 100],
    };
    navigator.vibrate(patterns[pattern]);
  }
};

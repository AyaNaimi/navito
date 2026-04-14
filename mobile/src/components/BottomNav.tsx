import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { Home, Compass, Car, Users, MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';

const { width } = Dimensions.get('window');

interface TabItem {
  id: Screen;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: MapPin },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'guide', label: 'Guide', icon: Compass },
  { id: 'community', label: 'Community', icon: Users },
];

interface BottomNavProps {
  activeTab: Screen;
  onTabChange: (tab: Screen) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const indicatorPosition = useRef(
    new Animated.Value(getInitialIndicatorPosition(activeTab))
  ).current;

  const scaleValues = useRef(
    TABS.reduce((acc, tab) => {
      acc[tab.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  function getInitialIndicatorPosition(tabId: Screen) {
    const index = TABS.findIndex((t) => t.id === tabId);
    const tabWidth = (width - 48) / TABS.length;
    return index * tabWidth + tabWidth / 2;
  }

  const handleTabPress = useCallback(
    (tab: TabItem, index: number) => {
      // Reset all scales
      Object.values(scaleValues).forEach((scale) => {
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();
      });

      // Animate pressed tab
      Animated.sequence([
        Animated.spring(scaleValues[tab.id], {
          toValue: 0.9,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValues[tab.id], {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Move indicator
      const tabWidth = (width - 48) / TABS.length;
      const targetPosition = index * tabWidth + tabWidth / 2;

      Animated.spring(indicatorPosition, {
        toValue: targetPosition,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();

      onTabChange(tab.id);
    },
    [scaleValues, indicatorPosition, onTabChange]
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Background blur simulation */}
        <View style={styles.background} />

        {/* Active indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: indicatorPosition }],
            },
          ]}
        />

        {/* Tab items */}
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const scale = scaleValues[tab.id];

          return (
            <Animated.View
              key={tab.id}
              style={[
                styles.tabWrapper,
                { transform: [{ scale }] },
              ]}
            >
              <Pressable
                style={styles.tab}
                onPress={() => handleTabPress(tab, index)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isActive && styles.iconContainerActive,
                  ]}
                >
                  <Icon
                    size={24}
                    color={isActive ? colors.primary[500] : colors.text.tertiary}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  container: {
    width: '100%',
    maxWidth: '100%',
    height: 84,
    flexDirection: 'row',
    borderRadius: borderRadius['3xl'],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['3xl'],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  indicator: {
    position: 'absolute',
    bottom: 14,
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[1],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[0],
  },
  iconContainerActive: {
    backgroundColor: colors.primary[50],
  },
  tabLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs - 1,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary[600],
    fontFamily: typography.fontFamily.medium,
  },
});

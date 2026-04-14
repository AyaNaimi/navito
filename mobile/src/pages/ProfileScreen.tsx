import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Languages,
  Moon,
  Globe,
  Car,
  Map,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Personal Information', screen: 'profile' },
      { icon: CreditCard, label: 'Payment Methods', screen: 'profile' },
      { icon: Bell, label: 'Notifications', screen: 'profile' },
      { icon: Shield, label: 'Become a Driver', screen: 'driverJoin' },
      { icon: Car, label: 'Driver Dashboard', screen: 'driverDashboard' },
      { icon: Map as any, label: 'Guide Dashboard', screen: 'guideDashboard' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Languages, label: 'Language', screen: 'language' },
      { icon: Globe, label: 'Country', screen: 'country' },
      { icon: Moon, label: 'Dark Mode', screen: 'profile', toggle: true },
    ],
  },
{
    title: 'Support',
    items: [
      { icon: Shield, label: 'Privacy & Security', screen: 'safety' },
      { icon: HelpCircle, label: 'Help Center', screen: 'profile' },
      { icon: User, label: 'Driver Status', screen: 'driverPending' },
    ],
  },
];

export default function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Profile */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.profileCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
              }}
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Ahmed Ben</Text>
              <Text style={styles.profileEmail}>ahmed.ben@email.com</Text>

              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>Tourist</Text>
              </View>
            </View>

            <Pressable style={styles.editButton}>
              <Settings size={20} color={colors.text.secondary} />
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>

            <View style={styles.menuCard}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuItem,
                    index === section.items.length - 1 && styles.menuItemLast,
                  ]}
                  onPress={() => onNavigate(item.screen as Screen)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <item.icon size={20} color={colors.primary[500]} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>

                  <ChevronRight size={20} color={colors.text.tertiary} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <LogOut size={20} color={colors.semantic.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        {/* App Version */}
        <Text style={styles.version}>Navito v1.0.0</Text>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingTop: spacing[6],
  },
  header: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    marginBottom: spacing[5],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  profileName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  profileEmail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  profileBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
  },
  profileBadgeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.primary[500],
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing[6],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[5],
    marginBottom: spacing[8],
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border.light,
  },
  menuSection: {
    marginBottom: spacing[6],
  },
  menuSectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    paddingHorizontal: spacing[6],
    marginBottom: spacing[3],
  },
  menuCard: {
    marginHorizontal: spacing[6],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginHorizontal: spacing[6],
    height: 56,
    backgroundColor: colors.semantic.error + '10',
    borderRadius: borderRadius.lg,
    marginBottom: spacing[6],
  },
  logoutText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.semantic.error,
  },
  version: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  bottomSpacing: {
    height: 100,
  },
});

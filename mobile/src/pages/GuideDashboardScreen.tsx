import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star, Clock, DollarSign, Navigation, Users, Bell, Search, Calendar, ChevronLeft, ChevronRight, MoreHorizontal, MessageCircle, Settings } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Screen } from '../types/navigation';
import { guideBookings } from '../data/mockData';

interface GuideDashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
}

const assignedTours = [
  { id: 1, title: 'Marrakech City Walk', location: 'Marrakech, Morocco', date: 'Oct 12, 2024', duration: '4 hours', status: 'Upcoming', image: 'https://images.unsplash.com/photo-1597838816882-4435b1977fbe?auto=format&fit=crop&q=80&w=300' },
  { id: 2, title: 'Atlas Mountains Hike', location: 'Atlas, Morocco', date: 'Oct 15, 2024', duration: '8 hours', status: 'Confirmed', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=300' },
  { id: 3, title: 'Sahara Desert Tour', location: 'Merzouga, Morocco', date: 'Oct 20, 2024', duration: '3 days', status: 'Pending', image: 'https://images.unsplash.com/photo-1549424615-54523e5cc2ed?auto=format&fit=crop&q=80&w=300' },
];

const travelers = [
  { id: 1, name: 'Sarah Jenkins', tour: 'Marrakech City Walk', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
  { id: 2, name: 'Michael Chen', tour: 'Atlas Mountains Hike', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Michael' },
  { id: 3, name: 'Emma Thompson', tour: 'Sahara Desert Tour', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emma' },
  { id: 4, name: 'David L.', tour: 'Marrakech City Walk', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David' },
];

export default function GuideDashboardScreen({ onNavigate, onBack }: GuideDashboardScreenProps) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <View style={styles.headerTitle}>
              <Text style={styles.titleText}>Guide Dashboard</Text>
              <Text style={styles.subtitleText}>Tours and Travelers</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Pressable style={styles.searchButton}>
              <Search size={18} color={colors.text.tertiary} />
            </Pressable>
            <Pressable style={styles.bellButton}>
              <Bell size={18} color={colors.text.secondary} />
            </Pressable>
            <Image source={{ uri: 'https://api.dicebear.com/7.x/notionists/svg?seed=Guide' }} style={styles.profileImage} />
          </View>
        </View>

        <View style={styles.content}>
          {/* Status toggle */}
          <View style={styles.statusBar}>
            <Text style={styles.statusBarText}>Disponibilité</Text>
            <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ true: colors.primary[500], false: colors.text.tertiary }} thumbColor={colors.surface.primary} />
          </View>

          {/* Assigned Tours */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Assigned Tours</Text>
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterText}>Latest</Text>
              </Pressable>
            </View>

            {assignedTours.map((tour) => (
              <Pressable key={tour.id} style={styles.tourCard}>
                <Image source={{ uri: tour.image }} style={styles.tourImage} />
                <View style={styles.tourInfo}>
                  <Text style={styles.tourTitle}>{tour.title}</Text>
                  <View style={styles.tourMeta}>
                    <MapPin size={12} color={colors.text.tertiary} />
                    <Text style={styles.tourLocation}>{tour.location}</Text>
                    <Text style={styles.tourDot}>•</Text>
                    <Text style={styles.tourDate}>{tour.date}</Text>
                    <Text style={styles.tourDot}>•</Text>
                    <Text style={styles.tourDuration}>{tour.duration}</Text>
                  </View>
                </View>
                <View style={[
                  styles.tourStatus,
                  tour.status === 'Upcoming' ? styles.statusUpcoming :
                  tour.status === 'Confirmed' ? styles.statusConfirmed :
                  styles.statusPending
                ]}>
                  <Text style={styles.tourStatusText}>{tour.status}</Text>
                </View>
                <MoreHorizontal size={18} color={colors.text.tertiary} />
              </Pressable>
            ))}
          </View>

          {/* Travelers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Travelers</Text>
            <View style={styles.travelersGrid}>
              {travelers.map((traveler) => (
                <Pressable key={traveler.id} style={styles.travelerCard}>
                  <Image source={{ uri: traveler.avatar }} style={styles.travelerAvatar} />
                  <Text style={styles.travelerName}>{traveler.name}</Text>
                  <Text style={styles.travelerTour}>{traveler.tour}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bottom nav */}
          <View style={styles.bottomNav}>
            <Pressable style={styles.navButton}>
              <Calendar size={20} color={colors.primary[500]} />
              <Text style={styles.navTextActive}>Tours</Text>
            </Pressable>
            <Pressable style={styles.navButton}>
              <MessageCircle size={20} color={colors.text.tertiary} />
              <Text style={styles.navText}>Messages</Text>
            </Pressable>
            <Pressable style={styles.navButton}>
              <DollarSign size={20} color={colors.text.tertiary} />
              <Text style={styles.navText}>Revenus</Text>
            </Pressable>
            <Pressable style={styles.navButton}>
              <Settings size={20} color={colors.text.tertiary} />
              <Text style={styles.navText}>Paramètres</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[6], paddingTop: spacing[4], backgroundColor: colors.surface.primary, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  logoContainer: { width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: colors.primary[500], alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.inverse },
  headerTitle: {},
  titleText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.primary },
  subtitleText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  searchButton: { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center' },
  bellButton: { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center' },
  profileImage: { width: 40, height: 40, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border.light },
  content: { padding: spacing[6], paddingBottom: 100 },
  statusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface.primary, padding: spacing[4], borderRadius: borderRadius.xl, marginBottom: spacing[6] },
  statusBarText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.primary },
  section: { marginBottom: spacing[6] },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] },
  sectionTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg, color: colors.text.primary },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: spacing[1], backgroundColor: colors.background.secondary, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: borderRadius.full },
  filterText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text.secondary },
  tourCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, padding: spacing[3], marginBottom: spacing[3] },
  tourImage: { width: 70, height: 70, borderRadius: borderRadius.lg },
  tourInfo: { flex: 1, marginLeft: spacing[3] },
  tourTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: colors.text.primary },
  tourMeta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing[1] },
  tourLocation: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary, marginLeft: 2 },
  tourDot: { marginHorizontal: 4 },
  tourDate: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  tourDuration: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  tourStatus: { paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: borderRadius.md },
  statusUpcoming: { backgroundColor: colors.primary[100] },
  statusConfirmed: { backgroundColor: colors.primary[100] },
  statusPending: { backgroundColor: colors.background.secondary },
  tourStatusText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs, color: colors.text.primary },
  travelersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  travelerCard: { width: '48%', backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, padding: spacing[4], alignItems: 'center' },
  travelerAvatar: { width: 48, height: 48, borderRadius: 24, marginBottom: spacing[2] },
  travelerName: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: colors.text.primary },
  travelerTour: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.secondary, marginTop: 2 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing[4], borderTopWidth: 1, borderTopColor: colors.border.light, backgroundColor: colors.surface.primary, borderRadius: borderRadius.xl, marginTop: spacing[4] },
  navButton: { alignItems: 'center', gap: 2 },
  navText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, color: colors.text.tertiary },
  navTextActive: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs, color: colors.primary[500] },
});
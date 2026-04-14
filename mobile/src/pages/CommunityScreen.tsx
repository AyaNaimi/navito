import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  Plus,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Phone,
  MessageCircle,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { groupActivities, cities } from '../data/mockData';
import { mapService, MapPlace } from '../services/mapService';
import { useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';

interface CommunityScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  selectedCity?: string;
}

export default function CommunityScreen({ onNavigate, selectedCity: initialCity }: CommunityScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || 'Marrakech');
  const [activitiesList, setActivitiesList] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async (city: string) => {
    setIsLoading(true);
    const coords = await mapService.getCityCoordinates(city);
    const results = await mapService.searchPlaces(`gathering places ${city}`, coords, 'point_of_interest');
    setActivitiesList(results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities(selectedCity);
  }, [selectedCity]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make calls on this device');
    });
  };

  const handleMessage = (phone: string) => {
    Linking.openURL(`sms:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to send messages on this device');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Community</Text>
            <Text style={styles.headerSubtitle}>Discover local activities</Text>
          </View>
          <Pressable
            style={styles.createButton}
            onPress={() => onNavigate('applyForm')}
          >
            <Users size={18} color={colors.primary[500]} />
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>

        {/* Categories / Tabs */}
        <View style={styles.headerControls}>
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'all' && styles.tabActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                Explore
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'joined' && styles.tabActive]}
              onPress={() => setActiveTab('joined')}
            >
              <Text style={[styles.tabText, activeTab === 'joined' && styles.tabTextActive]}>
                My Groups
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityScroll}
          >
            {cityList.map((city) => (
              <Pressable
                key={city}
                style={[
                  styles.cityChip,
                  selectedCity === city && styles.cityChipActive,
                ]}
                onPress={() => setSelectedCity(city)}
              >
                <Text
                  style={[
                    styles.cityText,
                    selectedCity === city && styles.cityTextActive,
                  ]}
                >
                  {city}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'all' ? (
          isLoading ? (
            <ActivityIndicator size="small" color={colors.primary[500]} style={{ marginTop: 40 }} />
          ) : activitiesList.length > 0 ? (
            <View style={styles.list}>
              {activitiesList.map((activity) => (
                <Pressable 
                  key={activity.id} 
                  style={styles.activityCard} 
                  onPress={() => onNavigate('groupActivityDetail', { activityId: activity.id })}
                >
                  <Image source={{ uri: activity.image }} style={styles.activityImage} />
                  
                  <View style={styles.activityContent}>
                    {/* Organizer / Info */}
                    <View style={styles.organizerRow}>
                      <Image
                        source={{ uri: `https://i.pravatar.cc/150?img=${(parseInt(activity.id) || 0) % 70}` }}
                        style={styles.organizerAvatar}
                      />
                      <View>
                        <Text style={styles.organizerLabel}>{activity.category === 'leisure' ? 'Leisure' : 'Public Spot'}</Text>
                        <Text style={styles.organizerName}>{activity.name}</Text>
                      </View>
                    </View>

                    <View style={{ marginVertical: spacing[2] }}>
                       <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{activity.location}</Text>
                    </View>
                    
                    {/* Footer */}
                    <View style={styles.activityFooter}>
                      <View style={styles.contactActions}>
                        <Pressable 
                          style={styles.contactIcon} 
                          onPress={() => handleCall('+212600000000')}
                        >
                          <Phone size={16} color={colors.primary[500]} />
                        </Pressable>
                        <Pressable 
                          style={styles.contactIcon} 
                          onPress={() => handleMessage('+212600000000')}
                        >
                          <MessageCircle size={16} color={colors.primary[500]} />
                        </Pressable>
                      </View>
                      
                      <Pressable 
                        style={styles.viewButton}
                        onPress={() => onNavigate('groupActivityDetail', { activityId: parseInt(activity.id) })}
                      >
                        <Text style={styles.viewButtonText}>Visit</Text>
                        <ChevronRight size={14} color={colors.text.inverse} />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Search size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No Activities Found</Text>
              <Text style={styles.emptyDesc}>Try a different city or check back later.</Text>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Users size={32} color={colors.text.tertiary} />
            </View>
            <Text style={styles.emptyTitle}>Your Groups</Text>
            <Text style={styles.emptyDesc}>
              You haven't joined or created any activities yet.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => setActiveTab('all')}
            >
              <Text style={styles.emptyButtonText}>Discover Activities</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    backgroundColor: colors.surface.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  createButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.primary[500],
  },
  headerControls: {
    gap: spacing[4],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    padding: spacing[1],
    borderRadius: borderRadius.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing[2.5],
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  tabActive: {
    backgroundColor: colors.surface.primary,
    ...shadows.sm,
  },
  tabText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  tabTextActive: {
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterChipActive: {
    backgroundColor: colors.text.inverse,
    borderColor: colors.text.inverse,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  filterChipTextActive: {
    color: colors.secondary[600],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingBottom: 120,
  },
  list: {
    gap: spacing[6],
  },
  activityCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.md,
  },
  activityImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background.secondary,
  },
  activityContent: {
    padding: spacing[5],
    gap: spacing[3],
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  organizerAvatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  organizerLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  organizerName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  activityTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  activityDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  activityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: borderRadius.base,
  },
  metaText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: spacing[2],
  },
  contactActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
  },
  viewButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.inverse,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[20],
    gap: spacing[4],
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  emptyDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing[10],
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: colors.secondary[500],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    marginTop: spacing[4],
  },
  emptyButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.inverse,
  },
});

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Image, 
  Dimensions,
  Platform,
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle, 
  Share2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Screen } from '../types/navigation';
import { groupActivities } from '../data/mockData';

interface GroupActivityDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  activityId?: number;
}

const { width } = Dimensions.get('window');

export default function GroupActivityDetailScreen({ onNavigate, activityId }: GroupActivityDetailScreenProps) {
  const [joined, setJoined] = useState(false);

  const activity = groupActivities.find(a => a.id === activityId) ?? groupActivities[0];

  const handleJoin = () => {
    setJoined(!joined);
    if (!joined) {
      Alert.alert('Success!', 'You have successfully joined this group activity.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: activity.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          <SafeAreaView style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              <Pressable 
                onPress={() => onNavigate('community')} 
                style={styles.backButton}
              >
                <ChevronLeft size={24} color={colors.text.inverse} />
              </Pressable>
              <View style={styles.headerActions}>
                <Pressable style={styles.headerIconButton}>
                  <Share2 size={20} color={colors.text.inverse} />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>

          <View style={styles.imageLabels}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>Group Experience</Text>
            </View>
            <Text style={styles.mainTitle}>{activity.title}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Quick Info Bar */}
          <View style={styles.quickInfoBar}>
            <View style={styles.infoItem}>
              <MapPin size={18} color={colors.primary[500]} />
              <Text style={styles.infoText}>{activity.city}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Calendar size={18} color={colors.primary[500]} />
              <Text style={styles.infoText}>{activity.date}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.primary[500]} />
              <Text style={styles.infoText}>{activity.time}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Activity</Text>
            <Text style={styles.descriptionText}>{activity.description}</Text>
          </View>

          {/* Organizer Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Host</Text>
            <View style={styles.organizerCard}>
              <Image source={{ uri: activity.organizerImage }} style={styles.organizerAvatar} />
              <View style={styles.organizerInfo}>
                <View style={styles.organizerNameRow}>
                  <Text style={styles.organizerName}>{activity.organizer}</Text>
                  <ShieldCheck size={16} color={colors.primary[500]} />
                </View>
                <Text style={styles.organizerTag}>Verified Community Leader</Text>
              </View>
              <Pressable style={styles.messageButton}>
                <MessageCircle size={20} color={colors.primary[500]} />
              </Pressable>
            </View>
          </View>

          {/* Availability Card */}
          <View style={styles.availabilityCard}>
            <View style={styles.availHeader}>
              <Users size={20} color={colors.text.primary} />
              <Text style={styles.availTitle}>Participants</Text>
              <View style={styles.availCountBadge}>
                <Text style={styles.availCountText}>
                  {activity.participants}/{activity.maxParticipants}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(activity.participants / activity.maxParticipants) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.availSubtext}>
              Join {activity.maxParticipants - activity.participants} other travelers for this session.
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Floating Join Button */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={styles.footerGradient}
          pointerEvents="none"
        />
        <Pressable 
          style={[styles.joinButton, joined && styles.joinedButton]} 
          onPress={handleJoin}
        >
          <LinearGradient
            colors={joined ? [colors.semantic.success, colors.semantic.success] : [colors.primary[500], colors.primary[600]]}
            style={styles.buttonGradient}
          >
            {joined ? (
              <>
                <CheckCircle2 size={20} color={colors.text.inverse} />
                <Text style={styles.joinButtonText}>Joined Success</Text>
              </>
            ) : (
              <>
                <Text style={styles.joinButtonText}>Secure My Spot</Text>
                <ChevronLeft size={20} color={colors.text.inverse} style={{ transform: [{ rotate: '180deg' }] }} />
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLabels: {
    position: 'absolute',
    bottom: spacing[8],
    left: spacing[6],
    right: spacing[6],
  },
  categoryBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.base,
    alignSelf: 'flex-start',
    marginBottom: spacing[3],
  },
  categoryText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.text.inverse,
    lineHeight: 34,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    marginTop: -30,
    paddingTop: spacing[8],
    paddingHorizontal: spacing[6],
  },
  quickInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
    marginBottom: spacing[8],
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.light,
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  descriptionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing[4],
    borderRadius: borderRadius['2xl'],
    gap: spacing[4],
  },
  organizerAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  organizerName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  organizerTag: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.text.tertiary,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  availabilityCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    marginBottom: spacing[8],
  },
  availHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing[4],
  },
  availTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  availCountBadge: {
    backgroundColor: colors.surface.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  availCountText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.primary[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.full,
    marginBottom: spacing[3],
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  availSubtext: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[6],
    paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[6],
    paddingTop: spacing[4],
  },
  footerGradient: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 40,
  },
  joinButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  joinedButton: {
    ...shadows.none,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: spacing[4.5],
  },
  joinButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.inverse,
  },
});
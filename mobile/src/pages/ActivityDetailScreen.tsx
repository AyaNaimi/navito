import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
} from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

import { MapPlace } from '../services/mapService';

interface ActivityDetailScreenProps {
  onBook: () => void;
  onBack: () => void;
  itemId?: number;
  place?: MapPlace;
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: "Sarah M.",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "2026-04-01",
    comment: "Une expérience incroyable ! Le guide était passionné et les lieux magnifiques.",
  },
  {
    id: 2,
    user: "Marco R.",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    date: "2026-03-28",
    comment: "Très belle découverte. Je recommande d'y aller tôt le matin.",
  },
  {
    id: 3,
    user: "Yuki T.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "2026-03-15",
    comment: "Parfait pour les photos. Architecture impressionnante.",
  },
];

const { width } = Dimensions.get('window');

export default function ActivityDetailScreen({ onBook, onBack, place }: ActivityDetailScreenProps) {
  const item = place;
  const isMonument = place?.category === 'tourist_attraction';

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [participants, setParticipants] = useState(1);

  const galleryImages = [
    item?.image,
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80",
  ].filter(Boolean);

  const availableDates = [
    { date: '2026-04-15', day: 'Mar', num: '15' },
    { date: '2026-04-16', day: 'Mer', num: '16' },
    { date: '2026-04-17', day: 'Jeu', num: '17' },
    { date: '2026-04-18', day: 'Ven', num: '18' },
    { date: '2026-04-19', day: 'Sam', num: '19' },
  ];

  const availableTimes = ['09:00', '11:00', '14:00', '16:00'];

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Activity not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLike = () => setIsLiked(!isLiked);
  const handleSave = () => setIsSaved(!isSaved);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    setShowBooking(false);
    onBook();
  };

  const totalPrice = isMonument ? 0 : (activity?.price || 0) * participants;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <Pressable onPress={() => setShowGallery(true)}>
          <View style={styles.imageHeader}>
            <Image source={{ uri: item.image }} style={styles.headerImage} />
            <View style={styles.galleryThumbs}>
              {galleryImages.slice(0, 4).map((_, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.thumbDot, idx === 0 && styles.thumbDotActive]}
                  onPress={() => { setCurrentImageIndex(idx); setShowGallery(true); }}
                />
              ))}
            </View>
          </View>
        </Pressable>

        <View style={styles.backButton}>
          <Pressable onPress={onBack}>
            <ChevronLeft size={24} color="#0f172a" />
          </Pressable>
        </View>

        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton}>
            <Share2 size={20} color="#0f172a" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleLike}>
            <Heart size={20} color={isLiked ? '#e11d48' : '#0f172a'} fill={isLiked ? '#e11d48' : 'transparent'} />
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.ratingRow}>
              <MapPin size={16} color="#64748b" />
              <Text style={styles.ratingText}>{item.city}</Text>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingValue}>{item.rating}</Text>
              <Text style={styles.ratingCount}>({item.reviews} avis)</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            {isMonument ? (
              <>
                <View style={styles.infoCard}>
                  <Clock size={20} color="#0D9488" />
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{monument.duration}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Calendar size={20} color="#0D9488" />
                  <Text style={styles.infoLabel}>Hours</Text>
                  <Text style={styles.infoValue}>{monument.hours}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoCard}>
                  <Clock size={20} color="#0D9488" />
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{activity?.duration}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Users size={20} color="#0D9488" />
                  <Text style={styles.infoLabel}>Group Size</Text>
                  <Text style={styles.infoValue}>{activity?.groupSize}</Text>
                </View>
              </>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* What's Included */}
          {!isMonument && activity && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              {activity.includes.split(',').map((inc, index) => (
                <View key={index} style={styles.includeItem}>
                  <View style={styles.checkIcon}>
                    <Check size={16} color="#16a34a" />
                  </View>
                  <Text style={styles.includeText}>{inc.trim()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tips */}
          {isMonument && monument && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>{monument.tips}</Text>
              </View>
            </View>
          )}

          {/* Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {mockReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        color={i < review.rating ? '#f59e0b' : '#cbd5e1'}
                        fill={i < review.rating ? '#f59e0b' : 'transparent'}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>
            {isMonument ? monument.price : `${activity?.price} MAD`}
          </Text>
        </View>
        <View style={styles.bottomActions}>
          <Pressable
            style={[styles.saveButton, isSaved && styles.saveButtonActive]}
            onPress={handleSave}
          >
            <Heart size={20} color={isSaved ? '#fff' : '#0f172a'} fill={isSaved ? '#fff' : 'transparent'} />
          </Pressable>
          <Pressable style={styles.bookButton} onPress={() => setShowBooking(true)}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </Pressable>
        </View>
      </View>

      {/* Gallery Modal */}
      <Modal visible={showGallery} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalClose} onPress={() => setShowGallery(false)}>
            <X size={24} color="#fff" />
          </Pressable>
          <Pressable style={styles.modalNavLeft} onPress={prevImage}>
            <ChevronLeft size={32} color="#fff" />
          </Pressable>
          <Image source={{ uri: galleryImages[currentImageIndex] }} style={styles.modalImage} />
          <Pressable style={styles.modalNavRight} onPress={nextImage}>
            <ChevronRight size={32} color="#fff" />
          </Pressable>
          <View style={styles.modalDots}>
            {galleryImages.map((_, idx) => (
              <Pressable
                key={idx}
                style={[styles.modalDot, idx === currentImageIndex && styles.modalDotActive]}
                onPress={() => setCurrentImageIndex(idx)}
              />
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
  },
  imageHeader: {
    height: 280,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  galleryThumbs: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -40 }],
    flexDirection: 'row',
    gap: 8,
  },
  thumbDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  thumbDotActive: {
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#64748b',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  ratingCount: {
    fontSize: 14,
    color: '#94a3b8',
  },
  quickInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '700',
  },
  includeText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#1d4ed8',
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewMeta: {
    flex: 1,
    marginLeft: 12,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewDate: {
    fontSize: 12,
    color: '#64748b',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  bookButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 12,
  },
  modalNavLeft: {
    position: 'absolute',
    left: 20,
    top: '50%',
    zIndex: 10,
    padding: 12,
  },
  modalNavRight: {
    position: 'absolute',
    right: 20,
    top: '50%',
    zIndex: 10,
    padding: 12,
  },
  modalImage: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 16,
  },
  modalDots: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 8,
  },
  modalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  modalDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  modalDotInactive: {
    opacity: 0.5,
  },
});

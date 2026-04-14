import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { MapPlace } from '../services/mapService';

interface RestaurantDetailScreenProps {
  onBook: () => void;
  onBack: () => void;
  place?: MapPlace;
}

export default function RestaurantDetailScreen({ onBook, onBack, place }: RestaurantDetailScreenProps) {
  const restaurant = place;

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Restaurant not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View style={styles.imageHeader}>
          {restaurant.image ? (
            <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageEmoji}>🍽️</Text>
            </View>
          )}
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <View style={styles.actionButtons}>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>↗️</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>❤️</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingValue}>{restaurant.rating}</Text>
              <Text style={styles.ratingCount}>({restaurant.reviews} reviews)</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>🍴 Cuisine</Text>
              <Text style={styles.infoValue}>{(restaurant as any).cuisine || 'Moroccan'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>💰 Avg Price</Text>
              <Text style={styles.infoValue}>{(restaurant as any).avgPrice || restaurant.price} MAD</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>

          {/* Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hours</Text>
            <View style={styles.hoursCard}>
              <Text style={styles.hoursText}>{(restaurant as any).hours || '09:00 - 23:00'}</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresRow}>
              {restaurant.halal && (
                <View style={styles.featureBadge}>
                  <Text style={styles.featureText}>✓ Halal</Text>
                </View>
              )}
              <View style={styles.featureBadge}>
                <Text style={styles.featureText}>{restaurant.priceRange}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Avg. per person</Text>
          <Text style={styles.priceValue}>{restaurant.avgPrice} MAD</Text>
        </View>
        <Pressable style={styles.bookButton} onPress={onBook}>
          <Text style={styles.bookButtonText}>Book Table</Text>
        </Pressable>
      </View>
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
    backgroundColor: '#fef3c7',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 80,
    opacity: 0.5,
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
  },
  backButtonText: {
    fontSize: 20,
    color: '#0f172a',
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
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
  ratingIcon: {
    fontSize: 14,
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
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
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
  hoursCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 14,
  },
  hoursText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 10,
  },
  featureBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
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
  bookButton: {
    backgroundColor: '#0D9488',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});

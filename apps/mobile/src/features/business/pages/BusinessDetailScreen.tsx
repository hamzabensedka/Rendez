import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography, radius, shadows } from '@planity/ui';
import api from '../../../shared/lib/api';
import { useFavorites } from '../../../application/providers';

const { width } = Dimensions.get('window');

interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  ratingAvg: number;
  ratingCount: number;
  services: Array<{
    id: string;
    name: string;
    serviceVariants: Array<{
      id: string;
      name: string;
      durationMin: number;
      priceCents: number | null;
    }>;
  }>;
  locations?: Array<{
    id: string;
    address: string;
  }>;
}

type TabType = 'services' | 'about' | 'reviews';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('services');

  useEffect(() => {
    if (id) {
      loadBusiness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadBusiness() {
    try {
      const response = await api.get(`/businesses/${id}`);
      setBusiness(response.data);
    } catch (error) {
      console.error('Failed to load business:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFavorite() {
    if (id) {
      await toggleFavorite(id);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.light.accent} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Business not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Carousel Placeholder */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>📸</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Text style={styles.favoriteIcon}>{id && isFavorite(id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Business Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{business.name}</Text>
        </View>

        {business.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{business.category}</Text>
          </View>
        )}

        {business.locations && business.locations.length > 0 && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{business.locations[0].address}</Text>
          </View>
        )}

        {business.ratingCount > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>{business.ratingAvg.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({business.ratingCount} reviews)</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'services' && styles.tabActive]}
          onPress={() => setActiveTab('services')}
        >
          <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>
            Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'about' && styles.tabActive]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
            Reviews
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'services' && (
          <View style={styles.servicesSection}>
            {business.services.length === 0 ? (
              <Text style={styles.emptyText}>No services available</Text>
            ) : (
              business.services.map((service) => (
                <View key={service.id} style={styles.serviceGroup}>
                  <Text style={styles.serviceGroupTitle}>{service.name}</Text>
                  {service.serviceVariants.map((variant) => (
                    <TouchableOpacity
                      key={variant.id}
                      style={styles.serviceCard}
                      onPress={() => {
                        router.push({
                          pathname: '/(tabs)/booking',
                          params: {
                            businessId: business.id,
                            serviceVariantId: variant.id,
                          },
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{variant.name}</Text>
                        <Text style={styles.serviceDuration}>{variant.durationMin} min</Text>
                      </View>
                      {variant.priceCents && (
                        <Text style={styles.servicePrice}>
                          €{(variant.priceCents / 100).toFixed(2)}
                        </Text>
                      )}
                      <Text style={styles.serviceArrow}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.aboutSection}>
            {business.description ? (
              <Text style={styles.description}>{business.description}</Text>
            ) : (
              <Text style={styles.emptyText}>No description available</Text>
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.reviewsSection}>
            {business.ratingCount > 0 ? (
              <View>
                <View style={styles.ratingSummary}>
                  <Text style={styles.ratingLarge}>{business.ratingAvg.toFixed(1)}</Text>
                  <Text style={styles.ratingStarLarge}>⭐</Text>
                  <Text style={styles.ratingCountLarge}>
                    Based on {business.ratingCount} reviews
                  </Text>
                </View>
                <Text style={styles.comingSoonText}>Individual reviews coming soon</Text>
              </View>
            ) : (
              <Text style={styles.emptyText}>No reviews yet</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 64,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  header: {
    padding: spacing.xl,
    backgroundColor: colors.light.surface,
  },
  headerTop: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.largeTitle,
    color: colors.light.text,
  },
  categoryContainer: {
    marginBottom: spacing.sm,
  },
  category: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    ...typography.body,
    color: colors.light.textSecondary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingStar: {
    fontSize: 16,
  },
  ratingText: {
    ...typography.headline,
    color: colors.light.text,
  },
  ratingCount: {
    ...typography.footnote,
    color: colors.light.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    paddingHorizontal: spacing.xl,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: spacing.xl,
  },
  tabActive: {
    borderBottomColor: colors.light.accent,
  },
  tabText: {
    ...typography.headline,
    color: colors.light.textSecondary,
  },
  tabTextActive: {
    color: colors.light.accent,
    fontWeight: '600',
  },
  content: {
    padding: spacing.xl,
  },
  servicesSection: {
    gap: spacing.xl,
  },
  serviceGroup: {
    marginBottom: spacing.xl,
  },
  serviceGroupTitle: {
    ...typography.title2,
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  serviceCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.headline,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  serviceDuration: {
    ...typography.footnote,
    color: colors.light.textSecondary,
  },
  servicePrice: {
    ...typography.title3,
    color: colors.light.text,
    marginRight: spacing.md,
  },
  serviceArrow: {
    ...typography.largeTitle,
    color: colors.light.textSecondary,
    fontSize: 24,
  },
  aboutSection: {},
  description: {
    ...typography.body,
    color: colors.light.text,
    lineHeight: 24,
  },
  reviewsSection: {},
  ratingSummary: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  ratingLarge: {
    ...typography.largeTitle,
    color: colors.light.text,
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  ratingStarLarge: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  ratingCountLarge: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  comingSoonText: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing['2xl'],
  },
  errorText: {
    ...typography.body,
    color: colors.light.error,
  },
});



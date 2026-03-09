import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import api from '../../../shared/lib/api';
import { useFavorites } from '../../../application/providers';
import { ScreenHeader } from '../../search/components';

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

const TABS: TabType[] = ['services', 'about', 'reviews'];

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
      console.error('Failed to load business', error);
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
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.light.text} />
      </View>
    );
  }

  if (!business) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader title="Business" />
        <View style={styles.center}>
          <Text variant="body" color={colors.light.textSecondary}>
            Business not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const favoriteIcon = id && isFavorite(id) ? 'heart' : 'heart-outline';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <ScreenHeader
        title={business.name}
        rightElement={
          <TouchableOpacity
            style={styles.favoriteHeaderButton}
            onPress={handleToggleFavorite}
            accessibilityLabel={id && isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityRole="button"
          >
            <Ionicons
              name={favoriteIcon}
              size={22}
              color={id && isFavorite(id) ? colors.light.error : colors.light.text}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color={colors.light.textTertiary} />
          </View>
        </View>

        {/* Meta block */}
        <View style={styles.metaBlock}>
          {business.category && (
            <Text variant="footnote" color={colors.light.textSecondary} style={styles.category}>
              {business.category}
            </Text>
          )}
          {business.locations && business.locations.length > 0 && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={colors.light.textSecondary} />
              <Text variant="body" color={colors.light.textSecondary} style={styles.locationText} numberOfLines={2}>
                {business.locations[0].address}
              </Text>
            </View>
          )}
          {business.ratingCount > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={colors.light.text} />
              <Text variant="headline" style={styles.ratingValue}>
                {business.ratingAvg.toFixed(1)}
              </Text>
              <Text variant="footnote" color={colors.light.textSecondary}>
                ({business.ratingCount} reviews)
              </Text>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              accessibilityLabel={`Tab ${tab}`}
              accessibilityRole="tab"
            >
              <Text
                variant="footnote"
                weight={activeTab === tab ? '600' : '400'}
                color={activeTab === tab ? colors.light.text : colors.light.textSecondary}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <View style={styles.content}>
          {activeTab === 'services' && (
            <View style={styles.section}>
              {business.services.length === 0 ? (
                <Card variant="flat" padding="lg">
                  <Text variant="body" color={colors.light.textSecondary} style={styles.emptyText}>
                    No services available
                  </Text>
                </Card>
              ) : (
                business.services.map((service) => (
                  <View key={service.id} style={styles.serviceGroup}>
                    <Text variant="title3" style={styles.serviceGroupTitle}>
                      {service.name}
                    </Text>
                    {service.serviceVariants.map((variant) => (
                      <TouchableOpacity
                        key={variant.id}
                        activeOpacity={0.7}
                        onPress={() => {
                          router.push({
                            pathname: '/(tabs)/booking',
                            params: {
                              businessId: business.id,
                              serviceVariantId: variant.id,
                            },
                          });
                        }}
                        accessibilityLabel={`${variant.name}, ${variant.durationMin} min`}
                        accessibilityRole="button"
                      >
                        <Card variant="elevated" padding="lg" style={styles.serviceCard}>
                          <View style={styles.serviceRow}>
                            <View style={styles.serviceInfo}>
                              <Text variant="headline">{variant.name}</Text>
                              <Text variant="footnote" color={colors.light.textSecondary}>
                                {variant.durationMin} min
                              </Text>
                            </View>
                            <View style={styles.serviceRight}>
                              {variant.priceCents != null && (
                                <Text variant="title3" style={styles.servicePrice}>
                                  €{(variant.priceCents / 100).toFixed(2)}
                                </Text>
                              )}
                              <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
                            </View>
                          </View>
                        </Card>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'about' && (
            <View style={styles.section}>
              <Card variant="flat" padding="lg">
                {business.description ? (
                  <Text variant="body" color={colors.light.text} style={styles.description}>
                    {business.description}
                  </Text>
                ) : (
                  <Text variant="body" color={colors.light.textSecondary} style={styles.emptyText}>
                    No description available
                  </Text>
                )}
              </Card>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.section}>
              <Card variant="flat" padding="lg">
                {business.ratingCount > 0 ? (
                  <>
                    <View style={styles.ratingSummary}>
                      <Text variant="largeTitle" style={styles.ratingLarge}>
                        {business.ratingAvg.toFixed(1)}
                      </Text>
                      <Ionicons name="star" size={32} color={colors.light.text} style={styles.ratingStarIcon} />
                      <Text variant="body" color={colors.light.textSecondary}>
                        Based on {business.ratingCount} reviews
                      </Text>
                    </View>
                    <Text variant="footnote" color={colors.light.textTertiary} style={styles.comingSoon}>
                      Individual reviews coming soon
                    </Text>
                  </>
                ) : (
                  <Text variant="body" color={colors.light.textSecondary} style={styles.emptyText}>
                    No reviews yet
                  </Text>
                )}
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scroll: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.light.surfaceSecondary,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  category: {
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  locationText: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingValue: {
    marginRight: spacing.xs,
  },
  favoriteHeaderButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabActive: {
    borderBottomColor: colors.light.text,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  section: {
    gap: spacing.lg,
  },
  serviceGroup: {
    marginBottom: spacing.xl,
  },
  serviceGroupTitle: {
    marginBottom: spacing.md,
  },
  serviceCard: {
    marginBottom: spacing.md,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  servicePrice: {
    marginRight: spacing.xs,
  },
  description: {
    lineHeight: 24,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  ratingSummary: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  ratingLarge: {
    marginBottom: spacing.sm,
  },
  ratingStarIcon: {
    marginBottom: spacing.sm,
  },
  comingSoon: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

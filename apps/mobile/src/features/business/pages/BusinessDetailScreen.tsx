import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../shared/lib/api';
import { ProfileButton } from '../../search/components/ProfileButton';
import { useFavorites } from '../../../application/providers';
import { DEFAULT_SALON_IMAGES } from '../../search/constants';
import { SalonReviews } from '../../search/components';

/** Location shape from API (businesses findOne) */
interface ApiLocation {
  id: string;
  label: string;
  address1: string;
  address2?: string | null;
  postalCode: string;
  city: string;
  country: string;
}

interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  ratingAvg: number;
  ratingCount: number;
  status: string;
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
  locations?: ApiLocation[];
}

function formatLocationAddress(loc: ApiLocation): string {
  const parts = [loc.address1, loc.address2, loc.postalCode, loc.city].filter(Boolean);
  return parts.join(', ');
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_PADDING = 24;
const HERO_BORDER_RADIUS = 16;
const HERO_INNER_WIDTH = SCREEN_WIDTH - HERO_PADDING * 2;
const HERO_HEIGHT = HERO_INNER_WIDTH * 1.25; // Aspect ratio 4/5

export default function BusinessDetailScreen() {
  const { id, addToBooking, existingServices } = useLocalSearchParams<{
    id: string;
    addToBooking?: string;
    existingServices?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { isFavorite, toggleFavorite } = useFavorites();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBusiness();
    }
  }, [id]);

  async function loadBusiness() {
    try {
      const response = await api.get(`/businesses/${id}`);
      setBusiness(response.data);
    } catch {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = async () => {
    if (!business) return;
    const appUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://rendez.app';
    const shareUrl = `${appUrl.replace(/\/$/, '')}/business/${business.id}`;
    try {
      await Share.share({
        message: `Check out ${business.name}!`,
        url: shareUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const minPrice = useMemo(() => {
    if (!business?.services) return null;
    let min = Infinity;
    business.services.forEach((s) => {
      s.serviceVariants.forEach((v) => {
        if (v.priceCents !== null && v.priceCents < min) {
          min = v.priceCents;
        }
      });
    });
    return min === Infinity ? null : min;
  }, [business]);

  const handleBookAppointment = () => {
    const variant = business?.services?.[0]?.serviceVariants?.[0];
    if (variant) {
      const isAdding = addToBooking === '1' && existingServices;
      const baseParams = {
        businessId: business.id,
        businessName: business.name ?? undefined,
      };
      if (isAdding && typeof existingServices === 'string') {
        try {
          const parsed = JSON.parse(existingServices) as Array<{
            serviceVariantId: string;
            name: string;
            durationMin: number;
            priceCents: number | null;
          }>;
          const newItem = {
            serviceVariantId: variant.id,
            name: variant.name,
            durationMin: variant.durationMin,
            priceCents: variant.priceCents,
          };
          router.replace({
            pathname: '/(tabs)/booking',
            params: {
              ...baseParams,
              serviceVariantId: variant.id,
              existingServices: JSON.stringify([...parsed, newItem]),
            },
          });
          return;
        } catch {
          // fall through to normal push
        }
      }
      router.push({
        pathname: '/(tabs)/booking',
        params: {
          ...baseParams,
          serviceVariantId: variant.id,
          serviceName: variant.name,
          durationMin: String(variant.durationMin),
          priceCents: variant.priceCents != null ? String(variant.priceCents) : undefined,
        },
      });
    }
  };

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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.light.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text variant="body" color={colors.light.textSecondary}>
            Business not found
          </Text>
        </View>
      </View>
    );
  }

  const isFav = id && isFavorite(id);
  // Deterministic random image based on ID char code sum
  const imageIndex = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % DEFAULT_SALON_IMAGES.length : 0;
  const heroImage = DEFAULT_SALON_IMAGES[imageIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // Extra padding to ensure content can scroll above the bottom bar
          paddingBottom: 140 + insets.bottom,
        }}
        bounces={false}
      >
        {/* Top Nav - in white padding area */}
        <View style={[styles.navBar, { paddingTop: insets.top, paddingHorizontal: HERO_PADDING }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.navButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.light.text} />
          </TouchableOpacity>

          <View style={styles.navActions}>
            <TouchableOpacity onPress={handleShare} style={styles.navButton}>
              <Ionicons name="share-outline" size={24} color={colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => id && toggleFavorite(id)} style={styles.navButton}>
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={24}
                color={isFav ? colors.light.error : colors.light.text}
              />
            </TouchableOpacity>
            <ProfileButton />
          </View>
        </View>

        {/* Hero Section - rounded corners, white padding on all sides */}
        <View style={[styles.heroWrapper, { paddingHorizontal: HERO_PADDING }]}>
          <View style={[styles.heroImageContainer, { height: HERO_HEIGHT, borderRadius: HERO_BORDER_RADIUS }]}>
            <Image
              source={{ uri: heroImage }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            {/* Rating Badge - inside rounded image, top right */}
            <View style={[styles.ratingBadge, { top: 16, right: 16 }]}>
              <Ionicons name="star" size={16} color="#EAB308" />
              <Text variant="footnote" weight="700" style={{ marginLeft: 4 }}>
                {business.ratingAvg.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Salon Info */}
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.salonName}>{business.name}</Text>
            <Ionicons name="checkmark-circle" size={24} color={colors.light.text} />
          </View>

          {business.locations && business.locations.length > 0 && (
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color={colors.light.textSecondary} />
              <Text variant="body" color={colors.light.textSecondary} style={{ marginLeft: 4 }}>
                {formatLocationAddress(business.locations[0])}
              </Text>
            </View>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>REVIEWS</Text>
              <Text style={styles.statValue}>
                {business.ratingCount > 1000 ? (business.ratingCount / 1000).toFixed(1) + 'k' : business.ratingCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>YEARS</Text>
              <Text style={styles.statValue}>5+</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>STATUS</Text>
              <Text style={[styles.statValue, { color: '#16A34A' }]}>
                {business.status === 'active' ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={24} color="#FFF" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>READ BEFORE BOOKING</Text>
              <Text style={styles.infoText}>
                Please arrive 10 minutes early. Cancellations within 24 hours incur a 50% fee. All tools are sterilized medically.
              </Text>
            </View>
          </View>

          {/* Services Section */}
          <View style={styles.servicesSection}>
            <View style={styles.servicesHeader}>
              <Text style={styles.servicesTitle}>SERVICES</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {business.services.map((service) => {
              const isExpanded = expandedServiceId === service.id;
              let iconName: keyof typeof Ionicons.glyphMap = 'cut-outline';
              const lowerName = service.name.toLowerCase();
              if (lowerName.includes('eye') || lowerName.includes('lash') || lowerName.includes('brow')) iconName = 'eye-outline';
              else if (lowerName.includes('nail') || lowerName.includes('manicure')) iconName = 'hand-left-outline';
              else if (lowerName.includes('skin') || lowerName.includes('face')) iconName = 'happy-outline';
              else if (lowerName.includes('massage')) iconName = 'body-outline';

              return (
                <View key={service.id} style={styles.serviceItemWrapper}>
                  <TouchableOpacity
                    style={styles.serviceItem}
                    onPress={() => {
                      setExpandedServiceId((prev) => (prev === service.id ? null : service.id));
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.serviceItemLeft}>
                      <Ionicons name={iconName} size={32} color={colors.light.text} style={{ opacity: 0.8 }} />
                      <View style={{ marginLeft: 16 }}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceDesc} numberOfLines={1}>
                          {service.serviceVariants.map((v) => v.name).join(', ')}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color={colors.light.textTertiary}
                    />
                  </TouchableOpacity>
                  {isExpanded && service.serviceVariants.length > 0 && (
                    <View style={styles.serviceVariants}>
                      {service.serviceVariants.map((variant) => (
                        <TouchableOpacity
                          key={variant.id}
                          style={styles.serviceVariantRow}
                          onPress={() => {
                            const isAdding = addToBooking === '1' && existingServices;
                            if (isAdding && typeof existingServices === 'string') {
                              try {
                                const parsed = JSON.parse(existingServices) as Array<{
                                  serviceVariantId: string;
                                  name: string;
                                  durationMin: number;
                                  priceCents: number | null;
                                }>;
                                const newItem = {
                                  serviceVariantId: variant.id,
                                  name: variant.name,
                                  durationMin: variant.durationMin,
                                  priceCents: variant.priceCents,
                                };
                                router.replace({
                                  pathname: '/(tabs)/booking',
                                  params: {
                                    businessId: business.id,
                                    businessName: business.name ?? undefined,
                                    serviceVariantId: variant.id,
                                    existingServices: JSON.stringify([...parsed, newItem]),
                                  },
                                });
                                return;
                              } catch {
                                // fall through
                              }
                            }
                            router.push({
                              pathname: '/(tabs)/booking',
                              params: {
                                businessId: business.id,
                                serviceVariantId: variant.id,
                                businessName: business.name ?? undefined,
                                serviceName: variant.name,
                                durationMin: String(variant.durationMin),
                                priceCents: variant.priceCents != null ? String(variant.priceCents) : undefined,
                              },
                            });
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.serviceVariantName}>{variant.name}</Text>
                          <View style={styles.serviceVariantMeta}>
                            <Text style={styles.serviceVariantDuration}>{variant.durationMin} min</Text>
                            {variant.priceCents != null && (
                              <Text style={styles.serviceVariantPrice}>
                                €{(variant.priceCents / 100).toFixed(2)}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Reviews */}
        {id ? <SalonReviews businessId={id} /> : null}
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { bottom: insets.bottom },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text style={styles.startingFrom}>STARTING FROM</Text>
          <Text style={styles.priceValue}>
            {minPrice ? `$${(minPrice / 100).toFixed(2)}` : '—'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>BOOK APPOINTMENT</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244,244,245,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navActions: {
    flexDirection: 'row',
    gap: 8,
  },
  heroWrapper: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroImageContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.light.surfaceSecondary,
  },
  ratingBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  salonName: {
    fontSize: 32,
    fontWeight: '300', // Light font as per design
    letterSpacing: -0.5,
    color: colors.light.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F4F4F5', // accent-gray
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textTertiary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  infoBanner: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '300',
  },
  servicesSection: {
    marginBottom: 24,
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    paddingBottom: 16,
    marginBottom: 0,
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textTertiary,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
    color: colors.light.text,
  },
  serviceItemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light.surfaceSecondary,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  serviceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.light.text,
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.light.textSecondary,
    maxWidth: 200,
  },
  serviceVariants: {
    paddingLeft: 48,
    paddingBottom: 12,
    paddingRight: 0,
    gap: 4,
  },
  serviceVariantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.light.background,
    borderRadius: 8,
    marginBottom: 4,
  },
  serviceVariantName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.light.text,
    flex: 1,
  },
  serviceVariantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceVariantDuration: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  serviceVariantPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  startingFrom: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textTertiary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
  },
  bookButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconButton: {
    padding: 8,
  },
});

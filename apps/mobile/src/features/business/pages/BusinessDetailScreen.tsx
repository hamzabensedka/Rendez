import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
  Image,
  Share,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFloatingBarOffset } from '../../../application/components/BottomNav';
import { useBusinessDetailQuery } from '../../../application/query/hooks';
import { useFavorites } from '../../../application/providers';
import { SalonReviews } from '../../search/components';
import { salonImageForId } from '../../search/constants';
import { AtelierButton } from '../../../shared/ui/atelier/AtelierButton';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface ApiLocation {
  id: string;
  label: string;
  address1: string;
  address2?: string | null;
  postalCode: string;
  city: string;
  country: string;
}

interface Variant {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number | null;
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
    serviceVariants: Variant[];
  }>;
  locations?: ApiLocation[];
  staff?: Array<{ id: string; name: string; role?: string | null }>;
}

function goToBooking(
  router: ReturnType<typeof useRouter>,
  business: Business,
  variant: Variant,
  addToBooking?: string,
  existingServices?: string
) {
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
        pathname: '/(main)/booking',
        params: {
          ...baseParams,
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
    pathname: '/(main)/booking',
    params: {
      ...baseParams,
      serviceVariantId: variant.id,
      serviceName: variant.name,
      durationMin: String(variant.durationMin),
      priceCents: variant.priceCents != null ? String(variant.priceCents) : undefined,
    },
  });
}

export default function BusinessDetailScreen() {
  const { id, addToBooking, existingServices } = useLocalSearchParams<{
    id: string;
    addToBooking?: string;
    existingServices?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const footerOffset = useFloatingBarOffset();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: business = null, isPending: loading } = useBusinessDetailQuery<Business>(id);

  const variants = useMemo(() => {
    if (!business?.services) return [];
    return business.services.flatMap((s) =>
      s.serviceVariants.map((v) => ({ ...v, group: s.name }))
    );
  }, [business]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={T.colors.ink} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
        </Pressable>
        <Text style={styles.muted}>Business not found</Text>
      </View>
    );
  }

  const city = business.locations?.[0]?.city ?? '';
  const meta = [city, business.ratingAvg?.toFixed(1), business.ratingCount]
    .filter((v) => v !== '' && v != null)
    .join(' · ');
  const isFav = id ? isFavorite(id) : false;

  return (
    <View style={[styles.screen, { paddingBottom: footerOffset }]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.icon} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
          </Pressable>
          <View style={styles.topRight}>
            <Pressable
              onPress={() =>
                Share.share({ message: business.name }).catch(() => undefined)
              }
              style={styles.icon}
            >
              <Ionicons name="share-outline" size={20} color={T.colors.ink} />
            </Pressable>
            <Pressable onPress={() => id && toggleFavorite(id)} style={styles.icon}>
              <Ionicons
                name={isFav ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={T.colors.ink}
              />
            </Pressable>
          </View>
        </View>

        <Image
          source={{ uri: salonImageForId(business.id) }}
          style={styles.hero}
          accessibilityIgnoresInvertColors
        />

        <View style={styles.pad}>
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.meta}>{meta}</Text>

          <Text style={styles.section}>Services</Text>
          {variants.map((variant) => (
            <View key={variant.id} style={styles.serviceRow}>
              <View style={styles.serviceBody}>
                <Text style={styles.serviceName}>{variant.name}</Text>
                <Text style={styles.serviceMeta}>{variant.durationMin} min</Text>
              </View>
              <Text style={styles.servicePrice}>
                {variant.priceCents != null ? `${(variant.priceCents / 100).toFixed(0)}€` : '—'}
              </Text>
              <Pressable
                onPress={() => goToBooking(router, business, variant, addToBooking, existingServices)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${variant.name}`}
              >
                <Text style={styles.add}>Add</Text>
              </Pressable>
            </View>
          ))}

          {business.staff && business.staff.length > 0 ? (
            <>
              <Text style={styles.section}>Team</Text>
              {business.staff.map((member) => (
                <Text key={member.id} style={styles.team}>
                  {member.name}
                  {member.role ? `  ${member.role}` : ''}
                </Text>
              ))}
            </>
          ) : null}
        </View>

        {id ? <SalonReviews businessId={id} /> : null}
      </ScrollView>

      <View style={styles.bar}>
        <AtelierButton
          label="Book"
          onPress={() => {
            const first = variants[0];
            if (first) goToBooking(router, business, first, addToBooking, existingServices);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  center: { alignItems: 'center', justifyContent: 'center' },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  topRight: { flexDirection: 'row' },
  back: { padding: 16 },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 220, backgroundColor: T.colors.past },
  pad: { paddingHorizontal: 16, paddingTop: 20 },
  name: {
    fontFamily: T.font.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: T.colors.ink,
  },
  meta: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, marginTop: 6 },
  section: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginTop: 28,
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    gap: 12,
  },
  serviceBody: { flex: 1 },
  serviceName: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink },
  serviceMeta: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, marginTop: 2 },
  servicePrice: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink },
  add: { fontFamily: T.font.medium, fontSize: 14, color: T.colors.ink },
  team: { fontFamily: T.font.body, fontSize: 16, color: T.colors.ink, paddingVertical: 6 },
  muted: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, padding: 16 },
  bar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: T.colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.colors.rule,
  },
});

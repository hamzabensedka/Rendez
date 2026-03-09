import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Card } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { AppLogo, ProfileButton, BusinessCard, type ApiBusinessListItem } from '../../search/components';
import api from '../../../shared/lib/api';

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<ApiBusinessListItem[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get<{ data: ApiBusinessListItem[] }>('/businesses');
        const list = res.data?.data;
        if (!cancelled) setBusinesses(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setBusinesses([]);
      } finally {
        if (!cancelled) setBusinessesLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleProfilePress() {
    if (user) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/(auth)/login');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.regionButton} activeOpacity={0.7}>
            <Ionicons name="location-outline" size={18} color={colors.light.textSecondary} />
            <Text variant="footnote" color={colors.light.textSecondary} style={styles.regionText} numberOfLines={1}>
              Location
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.light.textSecondary} />
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <AppLogo style={styles.logo} />
          </View>

          <ProfileButton onPress={handleProfilePress} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Primary search CTA */}
          <View style={styles.heroSection}>
            <Text variant="title2" style={styles.heroTitle}>
              Find and book
            </Text>
            <Text variant="body" color={colors.light.textSecondary} style={styles.heroSubtitle}>
              Search by service or provider
            </Text>

            <TouchableOpacity
              style={styles.searchCard}
              activeOpacity={0.9}
              onPress={() => router.push('/search')}
            >
              <View style={styles.searchRow}>
                <Ionicons name="search" size={20} color={colors.light.textSecondary} />
                <Text variant="body" color={colors.light.textTertiary} style={styles.searchPlaceholder}>
                  Service, provider, or keyword
                </Text>
                <View style={styles.searchIconWrap}>
                  <Ionicons name="arrow-forward" size={18} color={colors.light.surface} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Browse businesses (live from API) */}
          <View style={styles.section}>
            <Text variant="headline" style={styles.sectionTitle}>
              Browse businesses
            </Text>
            {businessesLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.light.accent} />
                <Text variant="footnote" color={colors.light.textSecondary} style={styles.loadingText}>
                  Loading…
                </Text>
              </View>
            ) : businesses.length === 0 ? (
              <Text variant="body" color={colors.light.textSecondary} style={styles.emptyText}>
                No businesses yet. Check back later.
              </Text>
            ) : (
              businesses.slice(0, 8).map((b) => (
                <BusinessCard
                  key={b.id}
                  business={b}
                  onPress={() => router.push(`/(tabs)/business/${b.id}`)}
                />
              ))
            )}
          </View>

          {/* Quick links */}
          <View style={styles.section}>
            <Text variant="headline" style={styles.sectionTitle}>
              Quick access
            </Text>
            <View style={styles.quickRow}>
              <TouchableOpacity
                style={styles.quickCard}
                activeOpacity={0.8}
                onPress={() => router.push('/search')}
              >
                <View style={styles.quickIconWrap}>
                  <Ionicons name="search-outline" size={24} color={colors.light.accent} />
                </View>
                <Text variant="footnote" weight="600" style={styles.quickLabel}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickCard}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/bookings')}
              >
                <View style={styles.quickIconWrap}>
                  <Ionicons name="list-outline" size={24} color={colors.light.accent} />
                </View>
                <Text variant="footnote" weight="600" style={styles.quickLabel}>Bookings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Provider CTA */}
          <View style={styles.section}>
            <Card variant="outlined" padding="lg" style={styles.providerCard}>
              <Text variant="headline" style={styles.providerTitle}>
                Service providers
              </Text>
              <Text variant="footnote" color={colors.light.textSecondary} style={styles.providerSubtitle}>
                Manage your business and availability
              </Text>
              <Button
                title="Provider login"
                onPress={() => router.push('/(auth)/login')}
                variant="outline"
                size="md"
                style={styles.providerButton}
              />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 80,
  },
  regionText: {
    marginLeft: 2,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 18,
    letterSpacing: 3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  heroSection: {
    marginBottom: spacing['2xl'],
  },
  heroTitle: {
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    marginBottom: spacing.lg,
  },
  searchCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: spacing.md,
  },
  searchIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.xs,
  },
  quickIconWrap: {
    marginBottom: spacing.sm,
  },
  quickLabel: {
    color: colors.light.text,
  },
  providerCard: {
    marginTop: spacing.xs,
  },
  providerTitle: {
    marginBottom: spacing.xs,
  },
  providerSubtitle: {
    marginBottom: spacing.md,
  },
  providerButton: {
    alignSelf: 'flex-start',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  loadingText: {
    marginLeft: spacing.xs,
  },
  emptyText: {
    paddingVertical: spacing.lg,
  },
});

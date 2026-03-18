import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import {
  SearchResultsHeader,
  SearchExpandedView,
  RendezSearchBar,
  RendezFilterPills,
  RendezSalonCard,
  type RendezSalonCardData,
  SearchFilters,
  ServiceFilters,
  TimeFilter,
  FilterState,
  type ApiBusinessListItem,
} from '../components';
import { DEFAULT_SALON_IMAGES, RESULT_FILTER_PILLS } from '../constants';
import api from '../../../shared/lib/api';
import MapSearchScreen from './MapSearchScreen';

/** Map API business to RENDEZ-style card data (image, rating, verified). No fake slots; use empty or "Book to see times". */
function mapBusinessToRendezCard(b: ApiBusinessListItem): RendezSalonCardData {
  const address =
    b.locations && b.locations.length > 0
      ? [b.locations[0].address1, b.locations[0].postalCode, b.locations[0].city].filter(Boolean).join(', ')
      : '—';
  return {
    id: b.id,
    name: b.name,
    address,
    rating: b.ratingAvg,
    reviewCount: b.ratingCount,
    priceLevel: '€€€',
    categories: b.category || 'Hair, Nails, Skincare',
    imageUri: DEFAULT_SALON_IMAGES[0],
    slots: [],
    verified: true,
  };
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const { address, category, time } = useLocalSearchParams<{ address?: string; category?: string; time?: string }>();

  const [businesses, setBusinesses] = useState<ApiBusinessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isServiceFiltersVisible, setIsServiceFiltersVisible] = useState(false);
  const [isTimeFilterVisible, setIsTimeFilterVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(time || 'Any time');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Use city name for API filter. "Toulouse, France" → city "Toulouse"; "Paris" → city "Paris".
  const city = address?.trim()
    ? (address.includes(',') ? address.split(',')[0]?.trim() : address.trim())
    : undefined;
  const query = city ? undefined : ([category, address].filter(Boolean).join(' ') || undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ data: ApiBusinessListItem[] }>('/businesses', {
          params: { query: query || undefined, city: city || undefined },
        });
        const list = res.data?.data;
        const items = Array.isArray(list) ? list : [];
        if (!cancelled) {
          setBusinesses(items);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setBusinesses([]);
          const message =
            e && typeof e === 'object' && 'message' in e && typeof (e as Error).message === 'string'
              ? (e as Error).message
              : 'Failed to load results';
          const isNetworkError =
            message === 'Network Error' ||
            message.includes('Network request failed') ||
            message.includes('ECONNREFUSED') ||
            message.includes('ENOTFOUND');
          setError(
            isNetworkError
              ? 'Cannot reach the server. On a device or emulator, set EXPO_PUBLIC_API_URL to your computer’s IP (e.g. http://192.168.1.x:3000/v1) and ensure the API is running.'
              : message
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query, city]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleBusinessPress = useCallback(
    (businessId: string) => {
      router.push(`/(tabs)/business/${businessId}`);
    },
    [router]
  );

  const handleFilterSelect = useCallback((filterId: string) => {
    if (filterId === 'filters') {
      setIsFiltersVisible(true);
    } else if (filterId === 'services') {
      setIsServiceFiltersVisible(true);
    } else {
      // map or other
    }
  }, []);

  const handleApplyFilters = useCallback((filters: FilterState) => {
    console.log('Filters applied:', filters);
  }, []);

  const handleApplyServiceFilters = useCallback((services: string[]) => {
    console.log('Services applied:', services);
  }, []);

  const handleApplyTimeFilter = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  // Toggle Search Expansion
  const handleToggleSearch = useCallback(() => {
    setIsSearchExpanded(prev => !prev);
  }, []);

  // Handlers for interactions INSIDE Expanded View (search/address screens removed; just close)
  const handleCategoryPress = useCallback(() => {
    setIsSearchExpanded(false);
  }, []);

  const handleAddressPress = useCallback(() => {
    setIsSearchExpanded(false);
  }, []);

  const handleTimePress = useCallback(() => {
    setIsTimeFilterVisible(true);
  }, []);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {isSearchExpanded ? (
        <SearchExpandedView
          category={category || 'Services'}
          address={address || 'Near me'}
          time={selectedTime}
          onClose={handleToggleSearch}
          onCategoryPress={handleCategoryPress}
          onAddressPress={handleAddressPress}
          onTimePress={handleTimePress}
        />
      ) : (
        <>
          <View style={styles.searchBarWrapper}>
            <RendezSearchBar
              categoryLabel={category || 'Services'}
              address={address || 'Near me'}
              onPress={handleToggleSearch}
            />
          </View>
          <View style={styles.pillsRow}>
            <TouchableOpacity
              style={[styles.mapPill, viewMode === 'list' && styles.mapPillActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list-outline" size={16} color={viewMode === 'list' ? colors.light.background : colors.light.text} />
              <Text variant="footnote" style={[styles.mapPillText, viewMode === 'list' && styles.mapPillTextActive]}>Liste</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mapPill, viewMode === 'map' && styles.mapPillActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons name="map-outline" size={16} color={viewMode === 'map' ? colors.light.background : colors.light.text} />
              <Text variant="footnote" style={[styles.mapPillText, viewMode === 'map' && styles.mapPillTextActive]}>Carte</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  ), [address, category, selectedTime, isSearchExpanded, viewMode, handleToggleSearch, handleFilterSelect, handleCategoryPress, handleAddressPress, handleTimePress]);

  const renderItem = useCallback(
    ({ item, index }: { item: ApiBusinessListItem; index: number }) => {
      const cardData = mapBusinessToRendezCard(item);
      cardData.imageUri = DEFAULT_SALON_IMAGES[index % DEFAULT_SALON_IMAGES.length];
      return (
        <View style={styles.cardWrapper}>
        <RendezSalonCard
          data={cardData}
          onPress={() => handleBusinessPress(item.id)}
          onBookNow={() => handleBusinessPress(item.id)}
        />
        </View>
      );
    },
    [handleBusinessPress]
  );

  return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <SearchResultsHeader onBack={handleBack} />

      {/* Header (search bar + Liste/Carte pills) always visible so user can switch views */}
      {renderHeader()}

      {viewMode === 'list' ? (
        <FlatList
          data={businesses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.light.accent} />
              ) : (
                <Text variant="body" color={colors.light.textSecondary}>
                  {error || 'No results. Try adjusting your search or filters.'}
                </Text>
              )}
            </View>
          }
        />
      ) : (
        <View style={styles.mapWrapper}>
          <MapSearchScreen embedded initialBusinesses={businesses} />
        </View>
      )}

      {/* Filter Modals */}
      <SearchFilters
        visible={isFiltersVisible}
        onClose={() => setIsFiltersVisible(false)}
        onApply={handleApplyFilters}
      />

      <ServiceFilters
        visible={isServiceFiltersVisible}
        onClose={() => setIsServiceFiltersVisible(false)}
        onApply={handleApplyServiceFilters}
      />

      <TimeFilter
        visible={isTimeFilterVisible}
        onClose={() => setIsTimeFilterVisible(false)}
        onApply={handleApplyTimeFilter}
        currentTime={selectedTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  headerContainer: {
    backgroundColor: colors.light.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBarWrapper: {
    marginBottom: spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.light.surfaceSecondary,
  },
  mapPillText: {
    color: colors.light.text,
  },
  mapPillActive: {
    backgroundColor: colors.light.text,
  },
  mapPillTextActive: {
    color: colors.light.background,
  },
  mapWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  cardWrapper: {
    paddingHorizontal: 0,
  },
  empty: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
});

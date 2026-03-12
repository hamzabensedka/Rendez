import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import {
  TOULOUSE_SALONS_FALLBACK,
  DEFAULT_SALON_IMAGES,
  DEFAULT_BOOKING_SLOTS,
  RESULT_FILTER_PILLS,
} from '../constants';
import api from '../../../shared/lib/api';

/** Map API business to RENDEZ-style card data (image, rating, verified, slots). */
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
    slots: [...DEFAULT_BOOKING_SLOTS],
    verified: true,
  };
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const { address, category, time } = useLocalSearchParams<{ address?: string; category?: string; time?: string }>();

  const [businesses, setBusinesses] = useState<ApiBusinessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isServiceFiltersVisible, setIsServiceFiltersVisible] = useState(false);
  const [isTimeFilterVisible, setIsTimeFilterVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(time || 'Any time');

  // Do not put full address in API query or no business will match. When user selected a location,
  // filter by city only so all businesses in that city are shown.
  const city = address && address.includes(',') ? address.split(',').pop()?.trim() : undefined;
  const query = city ? undefined : ([category, address].filter(Boolean).join(' ') || undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get<{ data: ApiBusinessListItem[] }>('/businesses', {
          params: { query: query || undefined, city: city || undefined },
        });
        const list = res.data?.data;
        const items = Array.isArray(list) ? list : [];
        if (!cancelled) {
          setBusinesses(
            items.length > 0 ? items : city && city.toLowerCase() === 'toulouse' ? [...TOULOUSE_SALONS_FALLBACK] : []
          );
        }
      } catch {
        if (!cancelled) {
          setBusinesses(city && city.toLowerCase() === 'toulouse' ? [...TOULOUSE_SALONS_FALLBACK] : []);
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

  // Handlers for interactions INSIDE Expanded View
  const handleCategoryPress = useCallback(() => {
    router.push('/search');
  }, [router]);

  const handleAddressPress = useCallback(() => {
    router.push({
      pathname: '/address',
      params: { address: address } // Pass the current address to pre-fill
    });
  }, [router, address]);

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
          <RendezFilterPills
            pills={RESULT_FILTER_PILLS}
            onSelect={(id) => {
              if (id === 'availability') setIsTimeFilterVisible(true);
              else if (id === 'specialties') setIsServiceFiltersVisible(true);
              else setIsFiltersVisible(true);
            }}
          />
        </>
      )}
    </View>
  ), [address, category, selectedTime, isSearchExpanded, handleToggleSearch, handleFilterSelect, handleCategoryPress, handleAddressPress, handleTimePress]);

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

      <FlatList
        data={businesses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.light.accent} />
            ) : (
              <Text variant="body" color={colors.light.textSecondary}>
                No results. Try adjusting your search or filters.
              </Text>
            )}
          </View>
        }
      />

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

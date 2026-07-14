import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import {
  SearchResultsHeader,
  SearchExpandedView,
  RendezSearchBar,
  RendezSalonCard,
  type RendezSalonCardData,
  ServiceFilters,
  TimeFilter,
  type TimeFilterApplyPayload,
  type ApiBusinessListItem,
} from '../components';
import { DEFAULT_SALON_IMAGES } from '../constants';
import MapSearchScreen from './MapSearchScreen';
import {
  useBusinessesSearchQuery,
  useServiceCategoriesQuery,
} from '../../../application/query/hooks';
import { searchAddresses, getCurrentLocation } from '../services/addressService';
import type { AddressSuggestion } from '../types';

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
    priceLevel: '€',
    categories: b.category || '—',
    imageUri: DEFAULT_SALON_IMAGES[0],
    slots: [],
  };
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    address?: string;
    city?: string;
    categories?: string;
    nearMe?: string;
    availDate?: string;
    time?: string;
  }>();

  const addressParam = params.address?.trim() ?? '';
  const cityParam = params.city?.trim() ?? '';
  const categoriesParam = params.categories?.trim() ?? '';
  const nearMe = params.nearMe === '1';
  const availDateParam = params.availDate?.trim() ?? '';
  const timeSummaryParam = params.time?.trim() ?? '';

  const categorySlugs = useMemo(
    () => categoriesParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    [categoriesParam]
  );

  const { data: categoryRows = [] } = useServiceCategoriesQuery();
  const labelBySlug = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categoryRows) {
      m.set(c.slug, c.label);
    }
    return m;
  }, [categoryRows]);

  const serviceSummaryLabel = useMemo(() => {
    if (categorySlugs.length === 0) return 'Prestations';
    const labels = categorySlugs.map((s) => labelBySlug.get(s) ?? s);
    return labels.length > 2 ? `${labels.slice(0, 2).join(', ')}…` : labels.join(', ');
  }, [categorySlugs, labelBySlug]);

  const timeRowLabel = useMemo(() => {
    if (timeSummaryParam) return timeSummaryParam;
    if (availDateParam) return availDateParam;
    return 'N’importe quand';
  }, [timeSummaryParam, availDateParam]);

  const barAddressLine = useMemo(() => {
    if (nearMe) return 'Près de moi';
    return addressParam;
  }, [nearMe, addressParam]);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isServiceFiltersVisible, setIsServiceFiltersVisible] = useState(false);
  const [isTimeFilterVisible, setIsTimeFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [locationDraft, setLocationDraft] = useState(addressParam);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [nearCoords, setNearCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (isSearchExpanded) {
      setLocationDraft(nearMe ? '' : addressParam);
    }
  }, [isSearchExpanded, nearMe, addressParam]);

  useEffect(() => {
    if (!nearMe) {
      setNearCoords(null);
      return;
    }
    let cancelled = false;
    getCurrentLocation().then((c) => {
      if (!cancelled && c) setNearCoords(c);
    });
    return () => {
      cancelled = true;
    };
  }, [nearMe]);

  useEffect(() => {
    const q = locationDraft.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    setSuggestLoading(true);
    const t = setTimeout(() => {
      searchAddresses({ query: q, limit: 10 })
        .then(setSuggestions)
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestLoading(false));
    }, 300);
    return () => {
      clearTimeout(t);
      setSuggestLoading(false);
    };
  }, [locationDraft]);

  const apiCity = useMemo(() => {
    if (nearMe) return undefined;
    if (cityParam) return cityParam;
    if (addressParam.includes(',')) return addressParam.split(',')[0]?.trim() || undefined;
    return undefined;
  }, [nearMe, cityParam, addressParam]);

  const apiQuery = useMemo(() => {
    if (nearMe || apiCity) return undefined;
    if (addressParam.trim()) return addressParam.trim();
    return undefined;
  }, [nearMe, apiCity, addressParam]);

  const searchEnabled = !nearMe || nearCoords != null;

  const {
    data: businesses = [],
    isPending: loading,
    isError,
    error: queryError,
  } = useBusinessesSearchQuery({
    query: apiQuery,
    city: apiCity,
    categories: categorySlugs.length ? categorySlugs : undefined,
    nearMeCoords: nearMe && nearCoords ? nearCoords : null,
    availDate: availDateParam || undefined,
    enabled: searchEnabled,
  });

  const error = useMemo(() => {
    if (!isError || !queryError) return null;
    const message =
      queryError instanceof Error ? queryError.message : 'Failed to load results';
    const isNetworkError =
      message === 'Network Error' ||
      message.includes('Network request failed') ||
      message.includes('ECONNREFUSED') ||
      message.includes('ENOTFOUND');
    return isNetworkError
      ? 'Cannot reach the server. On a device or emulator, set EXPO_PUBLIC_API_URL to your computer’s IP (e.g. http://192.168.1.x:3000/v1) and ensure the API is running.'
      : message;
  }, [isError, queryError]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleBusinessPress = useCallback(
    (businessId: string) => {
      router.push(`/(main)/business/${businessId}`);
    },
    [router]
  );

  const setSearchParams = useCallback(
    (next: Record<string, string | undefined>) => {
      router.setParams(next as Record<string, string>);
    },
    [router]
  );

  const handleApplyServiceFilters = useCallback(
    (slugs: string[]) => {
      setSearchParams({
        categories: slugs.length ? slugs.join(',') : '',
      });
    },
    [setSearchParams]
  );

  const handleApplyTimeFilter = useCallback(
    (payload: TimeFilterApplyPayload) => {
      if (payload.preset === 'any') {
        setSearchParams({ availDate: '', time: '' });
      } else {
        setSearchParams({
          availDate: payload.availDate ?? '',
          time: payload.summary,
        });
      }
    },
    [setSearchParams]
  );

  const handleToggleSearch = useCallback(() => {
    setIsSearchExpanded((prev) => {
      if (prev && !nearMe) {
        setSearchParams({
          address: locationDraft.trim() || undefined,
        });
      }
      return !prev;
    });
  }, [locationDraft, nearMe, setSearchParams]);

  const handleCategoryPress = useCallback(() => {
    setIsServiceFiltersVisible(true);
  }, []);

  const handleTimePress = useCallback(() => {
    setIsTimeFilterVisible(true);
  }, []);

  const handleSelectSuggestion = useCallback(
    (item: AddressSuggestion) => {
      setSearchParams({
        address: item.address,
        city: item.city?.trim() || undefined,
        nearMe: undefined,
      });
      setLocationDraft(item.address);
    },
    [setSearchParams]
  );

  const handleSelectNearMe = useCallback(() => {
    setSearchParams({
      nearMe: '1',
      address: undefined,
      city: undefined,
    });
    setLocationDraft('');
  }, [setSearchParams]);

  const onLocationDraftChange = useCallback(
    (text: string) => {
      setLocationDraft(text);
      if (nearMe) {
        setSearchParams({ nearMe: undefined });
      }
    },
    [nearMe, setSearchParams]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        {isSearchExpanded ? (
          <SearchExpandedView
            serviceSummaryLabel={serviceSummaryLabel}
            locationDraft={locationDraft}
            onLocationDraftChange={onLocationDraftChange}
            locationSuggestions={suggestions}
            locationLoading={suggestLoading}
            onSelectSuggestion={handleSelectSuggestion}
            onSelectNearMe={handleSelectNearMe}
            timeDisplay={timeRowLabel}
            onClose={handleToggleSearch}
            onCategoryPress={handleCategoryPress}
            onTimePress={handleTimePress}
          />
        ) : (
          <View style={styles.searchBarWrapper}>
            <RendezSearchBar
              categoryLabel={serviceSummaryLabel}
              addressLine={barAddressLine}
              onPress={handleToggleSearch}
            />
          </View>
        )}
        <View style={styles.pillsRow}>
          <TouchableOpacity
            style={[styles.mapPill, viewMode === 'list' && styles.mapPillActive]}
            onPress={() => setViewMode('list')}
            accessibilityRole="button"
            accessibilityLabel="Liste"
            accessibilityState={{ selected: viewMode === 'list' }}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={viewMode === 'list' ? colors.light.background : colors.light.text}
            />
            <Text variant="footnote" style={[styles.mapPillText, viewMode === 'list' && styles.mapPillTextActive]}>
              Liste
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mapPill, viewMode === 'map' && styles.mapPillActive]}
            onPress={() => setViewMode('map')}
            accessibilityRole="button"
            accessibilityLabel="Carte"
            accessibilityState={{ selected: viewMode === 'map' }}
          >
            <Ionicons
              name="map-outline"
              size={16}
              color={viewMode === 'map' ? colors.light.background : colors.light.text}
            />
            <Text variant="footnote" style={[styles.mapPillText, viewMode === 'map' && styles.mapPillTextActive]}>
              Carte
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [
      isSearchExpanded,
      serviceSummaryLabel,
      locationDraft,
      onLocationDraftChange,
      suggestions,
      suggestLoading,
      handleSelectSuggestion,
      handleSelectNearMe,
      timeRowLabel,
      handleToggleSearch,
      handleCategoryPress,
      handleTimePress,
      barAddressLine,
      viewMode,
    ]
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ApiBusinessListItem>) => {
      const cardData = mapBusinessToRendezCard(item);
      cardData.imageUri = DEFAULT_SALON_IMAGES[index % DEFAULT_SALON_IMAGES.length];
      cardData.categories = labelBySlug.get(item.category ?? '') ?? item.category ?? cardData.categories;
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
    [handleBusinessPress, labelBySlug]
  );

  const listLoading = loading || (nearMe && !nearCoords);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <SearchResultsHeader onBack={handleBack} />

      {renderHeader()}

      <View style={styles.mainContent}>
        {viewMode === 'list' ? (
          <FlashList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.flashList}
            contentContainerStyle={[
              styles.listContent,
              businesses.length === 0 ? styles.listContentEmpty : null,
            ]}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === 'android'}
            ListEmptyComponent={
              <View style={styles.empty}>
                {listLoading ? (
                  <ActivityIndicator size="small" color={colors.light.accent} />
                ) : (
                  <Text variant="body" color={colors.light.textSecondary}>
                    {error || 'Aucun résultat. Modifiez les filtres ci-dessus.'}
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
      </View>

      <ServiceFilters
        visible={isServiceFiltersVisible}
        onClose={() => setIsServiceFiltersVisible(false)}
        onApply={handleApplyServiceFilters}
        initialSlugs={categorySlugs}
      />

      <TimeFilter
        visible={isTimeFilterVisible}
        onClose={() => setIsTimeFilterVisible(false)}
        onApply={handleApplyTimeFilter}
        initialAvailDate={availDateParam || undefined}
        initialSummary={timeSummaryParam || undefined}
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
  /** Fills all space below search header so list/map use the full screen. */
  mainContent: {
    flex: 1,
    minHeight: 0,
  },
  flashList: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  /** Let empty / loading state fill the list area vertically. */
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardWrapper: {
    paddingHorizontal: 0,
  },
  empty: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
});

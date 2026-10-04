import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  SearchExpandedView,
  SearchResultRow,
  ServiceFilters,
  TimeFilter,
  type TimeFilterApplyPayload,
  type ApiBusinessListItem,
} from '../components';
import MapSearchScreen from './MapSearchScreen';
import { salonImageForId } from '../constants';
import { resultFromPriceForId, resultSlotForId } from '../resultChrome';
import { useBottomNavInset, useNavClearance } from '../../../application/components/BottomNav';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { Ionicons } from '@expo/vector-icons';
import {
  useBusinessesSearchQuery,
  useServiceCategoriesQuery,
} from '../../../application/query/hooks';
import { searchAddresses, getCurrentLocation } from '../services/addressService';
import type { AddressSuggestion } from '../types';

function neighborhoodOf(b: ApiBusinessListItem): string {
  const loc = b.locations?.[0];
  if (!loc) return '—';
  return [loc.address2, loc.city].filter(Boolean).join(', ') || loc.city || '—';
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const navClearance = useNavClearance();
  const bottomInset = useBottomNavInset();
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
    () =>
      categoriesParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
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
    if (categorySlugs.length === 0) return 'Services';
    const labels = categorySlugs.map((s) => labelBySlug.get(s) ?? s);
    return labels.length > 2 ? `${labels.slice(0, 2).join(', ')}…` : labels.join(', ');
  }, [categorySlugs, labelBySlug]);

  const timeRowLabel = useMemo(() => {
    if (timeSummaryParam) return timeSummaryParam;
    if (availDateParam) return availDateParam;
    return 'Any time';
  }, [timeSummaryParam, availDateParam]);

  const nearPillLabel = useMemo(() => {
    if (nearMe) return 'Near';
    if (cityParam) return cityParam;
    if (addressParam) return addressParam.split(',')[0]?.trim() || 'Near';
    return 'Near';
  }, [nearMe, cityParam, addressParam]);

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
    const message = queryError instanceof Error ? queryError.message : 'Failed to load results';
    const isNetworkError =
      message === 'Network Error' ||
      message.includes('Network request failed') ||
      message.includes('ECONNREFUSED') ||
      message.includes('ENOTFOUND');
    return isNetworkError
      ? 'Cannot reach the server. On a device or emulator, set EXPO_PUBLIC_API_URL to your computer’s IP (e.g. http://192.168.1.x:3000/v1) and ensure the API is running.'
      : message;
  }, [isError, queryError]);

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

  const listLoading = loading || (nearMe && !nearCoords);

  const salonCountLabel = useMemo(() => {
    const n = businesses.length;
    return n === 1 ? '1 salon' : `${n} salons`;
  }, [businesses.length]);

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
          <>
            <Text style={styles.title}>Results</Text>
            <View style={styles.countRow}>
              <Text style={styles.count}>{listLoading ? ' ' : salonCountLabel}</Text>
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => setViewMode((m) => (m === 'list' ? 'map' : 'list'))}
                accessibilityRole="button"
                accessibilityLabel={viewMode === 'list' ? 'Map' : 'List'}
              >
                <Ionicons
                  name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
                  size={16}
                  color={T.colors.ink}
                />
                <Text style={styles.mapBtnText}>{viewMode === 'list' ? 'MAP' : 'LIST'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.pill}
                onPress={handleTimePress}
                accessibilityRole="button"
                accessibilityLabel={timeRowLabel}
              >
                <Text style={styles.pillText}>{timeRowLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pill}
                onPress={handleToggleSearch}
                accessibilityRole="button"
                accessibilityLabel={nearPillLabel}
              >
                <Text style={styles.pillText}>{nearPillLabel}</Text>
                <Ionicons name="chevron-down" size={14} color={T.colors.ink} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pill}
                onPress={handleCategoryPress}
                accessibilityRole="button"
                accessibilityLabel={serviceSummaryLabel}
              >
                <Text style={styles.pillText}>{serviceSummaryLabel}</Text>
                <Ionicons name="chevron-down" size={14} color={T.colors.ink} />
              </TouchableOpacity>
            </View>
          </>
        )}
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
      nearPillLabel,
      viewMode,
      salonCountLabel,
      listLoading,
    ]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ApiBusinessListItem>) => (
      <SearchResultRow
        name={item.name}
        neighborhood={neighborhoodOf(item)}
        nextSlot={resultSlotForId(item.id, timeSummaryParam || availDateParam)}
        fromPrice={resultFromPriceForId(item.id)}
        imageUri={salonImageForId(item.id)}
        onPress={() => handleBusinessPress(item.id)}
      />
    ),
    [handleBusinessPress, timeSummaryParam, availDateParam]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {renderHeader()}

      <View style={[styles.mainContent, { paddingBottom: navClearance }]}>
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
            ListFooterComponent={<View style={{ height: bottomInset - navClearance }} />}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === 'android'}
            ListEmptyComponent={
              <View style={styles.empty}>
                {listLoading ? (
                  <ActivityIndicator size="small" color={T.colors.ink} />
                ) : (
                  <Text style={styles.emptyText}>
                    {error || 'No results. Change the filters above.'}
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
    backgroundColor: T.colors.paper,
  },
  headerContainer: {
    backgroundColor: T.colors.paper,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontFamily: T.font.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    color: T.colors.ink,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 16,
  },
  count: {
    fontFamily: T.font.body,
    fontSize: 14,
    lineHeight: 20,
    color: T.colors.muted,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapBtnText: {
    fontFamily: T.font.label,
    fontSize: 11,
    letterSpacing: 1.4,
    color: T.colors.ink,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: T.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    backgroundColor: T.colors.paper,
  },
  pillText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.ink,
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
    paddingHorizontal: 16,
    paddingTop: 8,
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
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    textAlign: 'center',
  },
});

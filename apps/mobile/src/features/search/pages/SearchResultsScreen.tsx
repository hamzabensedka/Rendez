import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import {
  SearchResultsHeader,
  SearchSummaryCard,
  SearchExpandedView,
  FilterBar,
  BusinessCard,
  SearchFilters,
  ServiceFilters,
  TimeFilter,
  FilterState,
  type ApiBusinessListItem,
} from '../components';
import { SEARCH_FILTERS } from '../constants';
import api from '../../../shared/lib/api';

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

  const query = [category, address].filter(Boolean).join(' ') || undefined;
  const city = address && address.includes(',') ? address.split(',').pop()?.trim() : undefined;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get<{ data: ApiBusinessListItem[] }>('/businesses', {
          params: { query: query || undefined, city: city || undefined },
        });
        const list = res.data?.data;
        if (!cancelled) setBusinesses(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setBusinesses([]);
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
          <SearchSummaryCard 
            category={category || 'Services'} 
            address={address || 'Near me'}
            time={selectedTime}
            onPress={handleToggleSearch}
          />
          <FilterBar 
            filters={SEARCH_FILTERS} 
            onSelect={handleFilterSelect} 
          />
        </>
      )}
      
      <View style={styles.sectionHeader}>
        <Text variant="title3" style={styles.sectionTitle}>Results</Text>
        <Text variant="body" color={colors.light.textSecondary} style={styles.sectionSubtitle}>
          Providers near you — book online
        </Text>
      </View>
    </View>
  ), [address, category, selectedTime, isSearchExpanded, handleToggleSearch, handleFilterSelect, handleCategoryPress, handleAddressPress, handleTimePress]);

  const renderItem = useCallback(
    ({ item }: { item: ApiBusinessListItem }) => (
      <View style={styles.cardWrapper}>
        <BusinessCard business={item} onPress={() => handleBusinessPress(item.id)} />
      </View>
    ),
    [handleBusinessPress]
  );

  return (
    <SafeAreaView style={styles.container}>
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
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    lineHeight: 22,
  },
  cardWrapper: {
    paddingHorizontal: spacing.lg,
  },
  empty: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
});

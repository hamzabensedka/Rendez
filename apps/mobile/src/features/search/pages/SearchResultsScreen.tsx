import React, { useCallback, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { 
  SearchResultsHeader, 
  SearchSummaryCard, 
  SearchExpandedView,
  FilterBar, 
  SalonCard,
  SearchFilters,
  ServiceFilters,
  TimeFilter,
  FilterState
} from '../components';
import { MOCK_SALONS, SEARCH_FILTERS } from '../constants';
import { Salon } from '../types';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { address, category, time } = useLocalSearchParams<{ address: string; category: string; time: string }>();
  
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isServiceFiltersVisible, setIsServiceFiltersVisible] = useState(false);
  const [isTimeFilterVisible, setIsTimeFilterVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(time || 'Any time');

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSalonPress = useCallback((salonId: string) => {
    router.push(`/salon/${salonId}`);
  }, [router]);

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

  const renderItem = useCallback(({ item }: { item: Salon }) => (
    <View style={styles.cardWrapper}>
      <SalonCard 
        salon={item} 
        onPress={() => handleSalonPress(item.id)} 
      />
    </View>
  ), [handleSalonPress]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchResultsHeader onBack={handleBack} />
      
      <FlatList
        data={MOCK_SALONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="body" color={colors.light.textSecondary}>No results. Try adjusting your search or filters.</Text>
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

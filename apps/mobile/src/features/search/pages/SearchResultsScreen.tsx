import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  SearchResultsHeader, 
  SearchSummaryCard, 
  FilterBar, 
  SalonCard,
  SearchFilters,
  FilterState
} from '../components';
import { MOCK_SALONS, SEARCH_FILTERS } from '../constants';
import { Salon } from '../types';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { address, category } = useLocalSearchParams<{ address: string; category: string }>();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSalonPress = useCallback((salonId: string) => {
    router.push(`/salon/${salonId}`);
  }, [router]);

  const handleFilterSelect = useCallback((filterId: string) => {
    if (filterId === 'filtres') {
      setIsFiltersVisible(true);
    } else {
      console.log('Filter selected:', filterId);
    }
  }, []);

  const handleApplyFilters = useCallback((filters: FilterState) => {
    console.log('Filters applied:', filters);
    // Here you would typically update the list of salons based on filters
  }, []);

  const renderHeader = useCallback(() => (
    <View>
      <SearchSummaryCard 
        category={category || 'Coiffeurs'} 
        address={address || 'Autour de moi'} 
      />
      <FilterBar 
        filters={SEARCH_FILTERS} 
        onSelect={handleFilterSelect} 
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sélectionnez un salon de coiffure</Text>
        <Text style={styles.sectionSubtitle}>
          Les meilleurs salons et instituts aux alentours de ma position : Réservation en ligne
        </Text>
      </View>
    </View>
  ), [address, category, handleFilterSelect]);

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
      />

      <SearchFilters
        visible={isFiltersVisible}
        onClose={() => setIsFiltersVisible(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    paddingBottom: 10,
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
});

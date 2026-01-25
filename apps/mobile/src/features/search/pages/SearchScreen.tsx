import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ScreenHeader, SearchInput, SearchList } from '../components';
import { useFrequentSearches } from '../hooks';
import { SEARCH_PLACEHOLDERS } from '../constants';

/**
 * SearchScreen - Main search interface for finding businesses
 * Allows users to search by business name or services
 */
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searches, selectSearch } = useFrequentSearches();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader title="Rechercher" leftIcon="close" />

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={SEARCH_PLACEHOLDERS.BUSINESS}
        autoFocus
        showClearButton={false}
      />

      <SearchList
        data={searches}
        query={searchQuery}
        onSelect={selectSearch}
        getItemText={(item) => item}
        title="Recherches fréquentes"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});


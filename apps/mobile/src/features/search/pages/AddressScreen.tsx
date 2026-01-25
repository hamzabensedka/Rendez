import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader, SearchInput, AroundMeButton, AddressSuggestionList } from '../components';
import { useAddressSearch } from '../hooks';
import { SEARCH_PLACEHOLDERS } from '../constants';

/**
 * AddressScreen - Address search interface
 * Allows users to search for addresses or use their current location
 */
export default function AddressScreen() {
  const router = useRouter();
  const { query, setQuery, suggestions, selectAddress } = useAddressSearch();

  const handleAroundMe = useCallback(() => {
    // TODO: Implement geolocation functionality
    // In production: Request location permission and get coordinates
    console.log('Around me pressed');
    router.push({
      pathname: '/search-results',
      params: { address: 'Autour de moi', category: 'Coiffeurs' }
    });
  }, [router]);

  const handleSelectAddress = useCallback(
    (address: ReturnType<typeof useAddressSearch>['suggestions'][0]) => {
      selectAddress(address);
      router.push({
        pathname: '/search-results',
        params: { address: address.address, category: 'Coiffeurs' }
      });
    },
    [selectAddress, router]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader title="Adresse" />

      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={SEARCH_PLACEHOLDERS.ADDRESS}
        autoFocus
      />

      <View style={styles.contentArea}>
        {!query.trim() && <AroundMeButton onPress={handleAroundMe} />}

        {query.trim() && (
          <AddressSuggestionList
            suggestions={suggestions}
            query={query}
            onSelect={handleSelectAddress}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

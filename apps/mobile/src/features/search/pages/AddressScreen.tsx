import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenHeader, SearchInput, AroundMeButton, AddressSuggestionList } from '../components';
import { useAddressSearch } from '../hooks';
import { SEARCH_PLACEHOLDERS } from '../constants';

export default function AddressScreen() {
  const router = useRouter();
  const { address: initialAddress } = useLocalSearchParams<{ address?: string }>();
  const { query, setQuery, suggestions, selectAddress } = useAddressSearch();

  useEffect(() => {
    if (initialAddress) {
      setQuery(initialAddress);
    }
  }, [initialAddress, setQuery]);

  const handleAroundMe = useCallback(() => {
    router.push({
      pathname: '/search-results',
      params: { address: 'Near me', category: 'Services' },
    });
  }, [router]);

  const handleSelectAddress = useCallback(
    (address: ReturnType<typeof useAddressSearch>['suggestions'][0]) => {
      selectAddress(address);
      router.push({
        pathname: '/search-results',
        params: { address: address.address, category: 'Services' },
      });
    },
    [selectAddress, router]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Location" />

        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            Where?
          </Text>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={SEARCH_PLACEHOLDERS.ADDRESS}
            autoFocus
          />
        </View>

        <View style={styles.contentArea}>
          {!query.trim() ? (
            <View style={styles.aroundSection}>
              <Text variant="headline" style={styles.sectionTitle}>
                Use location
              </Text>
              <AroundMeButton onPress={handleAroundMe} />
            </View>
          ) : (
            <AddressSuggestionList
              suggestions={suggestions}
              query={query}
              onSelect={handleSelectAddress}
            />
          )}
        </View>
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
  section: {
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  aroundSection: {
    paddingTop: spacing.lg,
  },
});

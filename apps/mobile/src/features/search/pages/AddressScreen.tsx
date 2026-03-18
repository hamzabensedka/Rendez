import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@planity/ui';
import { Text } from '@planity/ui';
import { SearchInput, AddressSuggestionList } from '../components';
import { useAddressSearch } from '../hooks';
import { SEARCH_PLACEHOLDERS, FALLBACK_CITY_SUGGESTIONS } from '../constants';
import type { AddressSuggestion } from '../types';

const EXPLORE_IMAGE_URI = 'https://picsum.photos/seed/explore-map/800/450';

export default function AddressScreen() {
  const router = useRouter();
  const { address: initialAddress } = useLocalSearchParams<{ address?: string }>();
  const { query, setQuery, suggestions, selectAddress, isLoading } = useAddressSearch();

  useEffect(() => {
    if (initialAddress) {
      setQuery(initialAddress);
    }
  }, [initialAddress, setQuery]);

  const handleSelectAddress = useCallback(
    (address: AddressSuggestion) => {
      selectAddress(address);
      router.push({
        pathname: '/search-results',
        params: { address: address.address, category: 'Services' },
      });
    },
    [selectAddress, router]
  );

  const handleClear = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  const handleExploreCurrentArea = useCallback(() => {
    router.push({ pathname: '/search-results', params: { category: 'Services' } });
  }, [router]);

  const handleSubmitSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push({
        pathname: '/search-results',
        params: { address: trimmed, category: 'Services' },
      });
    }
  }, [query, router]);

  const fallbackSuggestions: AddressSuggestion[] =
    query.trim() && suggestions.length === 0 && !isLoading
      ? FALLBACK_CITY_SUGGESTIONS.filter(
          (s) =>
            s.city.toLowerCase().includes(query.trim().toLowerCase()) ||
            s.country.toLowerCase().includes(query.trim().toLowerCase())
        ).map((s) => ({ id: s.id, address: s.address, city: s.city, country: s.country }))
      : [];
  const listSuggestions = suggestions.length > 0 ? suggestions : fallbackSuggestions;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header: back + WHERE? + Clear */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Back"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={24} color={colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>WHERE?</Text>
          </View>
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityLabel="Clear"
            accessibilityRole="button"
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={SEARCH_PLACEHOLDERS.LOCATION}
            onSubmitEditing={handleSubmitSearch}
            autoFocus
            showClearButton={false}
            variant="pill"
          />
        </View>

        {/* Content: Suggested Locations + List + Explore card */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionLabel}>SUGGESTED LOCATIONS</Text>

          {listSuggestions.length > 0 ? (
            <View style={styles.listWrap}>
              <AddressSuggestionList
                suggestions={listSuggestions}
                query={query}
                onSelect={handleSelectAddress}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <Text style={styles.emptyHint}>
              {query.trim() ? 'No suggestions. Type a city name or press Search to use your text.' : 'Type to search for a location'}
            </Text>
          )}

          {/* Explore current area card */}
          <TouchableOpacity
            style={styles.exploreCard}
            activeOpacity={0.9}
            onPress={handleExploreCurrentArea}
            accessibilityLabel="Explore current area"
            accessibilityRole="button"
          >
            <Image
              source={{ uri: EXPLORE_IMAGE_URI }}
              style={styles.exploreImage}
              resizeMode="cover"
            />
            <View style={styles.exploreOverlay} />
            <Text style={styles.exploreLabel}>EXPLORE CURRENT AREA</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: colors.light.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl + spacing.sm,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.light.text,
    textTransform: 'uppercase',
  },
  clearButton: {
    padding: spacing.sm,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.light.text,
    textTransform: 'uppercase',
  },
  searchSection: {
    paddingHorizontal: 0,
    paddingTop: spacing.xl,
    backgroundColor: colors.light.surface,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 4,
    color: colors.light.text,
    marginBottom: spacing.xl,
    textTransform: 'uppercase',
  },
  emptyHint: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.lg,
  },
  listWrap: {
    marginBottom: 0,
  },
  exploreCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  exploreImage: {
    width: '100%',
    height: '100%',
  },
  exploreOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  exploreLabel: {
    position: 'absolute',
    left: spacing.xl,
    bottom: spacing.xl,
    right: spacing.xl,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});

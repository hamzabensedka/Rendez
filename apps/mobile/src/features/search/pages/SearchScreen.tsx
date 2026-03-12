import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { Text } from '@planity/ui';
import { ScreenHeader, SearchInput } from '../components';
import { useFrequentSearches } from '../hooks';
import { SEARCH_PLACEHOLDERS, FREQUENT_SEARCHES, TRENDING_NEAR_YOU } from '../constants';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 240;
const CARD_ASPECT = 4 / 3;

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<readonly string[]>(() => FREQUENT_SEARCHES);
  const { selectSearch } = useFrequentSearches();

  const handleSelectSearch = useCallback(
    (item: string) => {
      selectSearch(item);
    },
    [selectSearch]
  );

  const handleClearAll = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const handleTrendingPress = useCallback(
    (id: string) => {
      router.push('/address');
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <ScreenHeader title="SEARCH" leftIcon="close" noBorder />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchSection}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={SEARCH_PLACEHOLDERS.TREATMENTS}
              autoFocus
              showClearButton={false}
              variant="pill"
            />
          </View>

          <View style={styles.main}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionLabel}>RECENT SEARCHES</Text>
              {recentSearches.length > 0 ? (
                <TouchableOpacity
                  onPress={handleClearAll}
                  activeOpacity={0.7}
                  accessibilityLabel="Clear all recent searches"
                  accessibilityRole="button"
                >
                  <Text style={styles.clearAll}>Clear All</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {recentSearches.length > 0 ? (
              <View style={styles.recentList}>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={`${item}-${index}`}
                    style={styles.recentItem}
                    activeOpacity={0.7}
                    onPress={() => handleSelectSearch(item)}
                    accessibilityLabel={item}
                    accessibilityRole="button"
                  >
                    <View style={styles.recentItemLeft}>
                      <Text style={styles.recentTerm}>{item}</Text>
                    </View>
                    <Ionicons
                      name="arrow-up-outline"
                      size={20}
                      color={colors.light.textTertiary}
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <View style={styles.trendingSection}>
              <Text style={styles.trendingSectionLabel}>TRENDING NEAR YOU</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingScrollContent}
                style={styles.trendingScrollView}
                decelerationRate="fast"
                nestedScrollEnabled
              >
                {TRENDING_NEAR_YOU.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={styles.trendingCard}
                    activeOpacity={0.9}
                    onPress={() => handleTrendingPress(card.id)}
                    accessibilityLabel={card.label}
                    accessibilityRole="button"
                  >
                    <Image
                      source={{ uri: card.imageUrl }}
                      style={[styles.trendingImage, Platform.OS === 'web' && styles.trendingImageGrayscale]}
                      resizeMode="cover"
                    />
                    <View style={styles.trendingGradient} />
                    <Text style={styles.trendingLabel}>{card.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
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
    backgroundColor: colors.light.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  searchSection: {
    paddingHorizontal: 0,
  },
  main: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3.2,
    color: colors.light.textSecondary,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  clearAll: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.accent,
  },
  recentList: {
    marginBottom: spacing.xl,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  recentIndex: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.light.textSecondary,
    minWidth: 24,
  },
  recentTerm: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: -0.5,
    color: colors.light.text,
  },
  trendingSection: {
    marginTop: spacing['3xl'],
  },
  trendingSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3.2,
    color: colors.light.textSecondary,
    marginBottom: spacing.xl,
  },
  trendingScrollView: {
    marginHorizontal: -spacing.xl,
    flexGrow: 0,
  },
  trendingScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  trendingCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT / CARD_ASPECT,
    marginRight: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceSecondary,
    ...shadows.sm,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingImageGrayscale: {
    filter: 'grayscale(100%)',
  } as const,
  trendingGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  trendingLabel: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavClearance } from '../../../application/components/BottomNav';
import { queryKeys } from '../../../application/query/queryKeys';
import api from '../../../shared/lib/api';
import {
  ReviewCard,
  REVIEWS_PAGE_SIZE,
  type ApiReview,
  type ReviewsResponse,
} from '../../search/components/SalonReviews';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export default function BusinessReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navClearance = useNavClearance();

  const query = useInfiniteQuery({
    queryKey: queryKeys.businessReviews(id),
    enabled: Boolean(id),
    initialPageParam: 1,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await api.get<ReviewsResponse>(`/businesses/${id}/reviews`, {
        params: { page: pageParam, limit: REVIEWS_PAGE_SIZE },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
  });

  const reviews = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  );
  const summary = query.data?.pages[0];
  const ratingAvg = summary?.ratingAvg ?? 0;
  const ratingCount = summary?.ratingCount ?? 0;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ApiReview>) => <ReviewCard review={item} />,
    []
  );

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
        </Pressable>
      </View>
      <Text style={styles.title}>Reviews</Text>
      {!query.isPending ? (
        <Text style={styles.summary}>
          {ratingCount === 0 ? 'No reviews yet' : `${ratingAvg.toFixed(1)}  ${ratingCount} reviews`}
        </Text>
      ) : null}

      {query.isPending ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={T.colors.ink} />
        </View>
      ) : query.isError ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Failed to load reviews</Text>
        </View>
      ) : (
        <FlashList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          style={styles.list}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: navClearance + 16,
          }}
          ListEmptyComponent={<Text style={styles.muted}>No reviews yet</Text>}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator size="small" color={T.colors.ink} style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  header: { paddingHorizontal: 8, paddingVertical: 4 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', paddingLeft: 8 },
  title: {
    fontFamily: T.font.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: T.colors.ink,
    paddingHorizontal: 16,
  },
  summary: {
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.muted,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  list: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted },
});

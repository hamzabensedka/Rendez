import React, { useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { ReviewCard } from './ReviewCard';
import { Review } from '../types/review';
import { Ionicons } from '@expo/vector-icons';

interface ReviewsListProps {
  reviews: Review[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  totalCount?: number;
  averageRating?: number;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  totalCount,
  averageRating,
}) => {
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: Review }) => <ReviewCard review={item} />,
    []
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="star-outline" size={64} color={colors.borderLight} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No reviews yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Be the first to share your experience!
        </Text>
      </View>
    );
  }, [isLoading, colors]);

  const renderHeader = useCallback(() => {
    if (totalCount === undefined && averageRating === undefined) return null;
    return (
      <View style={[styles.summaryContainer, { borderBottomColor: colors.border }]}>
        {averageRating !== undefined && (
          <View style={styles.ratingSummary}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={[styles.averageRating, { color: colors.text }]}>
              {averageRating.toFixed(1)}
            </Text>
            {totalCount !== undefined && (
              <Text style={[styles.totalCount, { color: colors.textSecondary }]}>
                ({totalCount} {totalCount === 1 ? 'review' : 'reviews'})
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }, [averageRating, totalCount, colors]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  averageRating: {
    fontSize: 24,
    fontWeight: '700',
  },
  totalCount: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

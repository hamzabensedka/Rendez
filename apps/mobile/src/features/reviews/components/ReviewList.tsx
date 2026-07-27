import React, { useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ReviewCard } from './ReviewCard';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  emptyMessage?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  isRefreshing,
  onRefresh,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
  emptyMessage = 'No reviews yet. Be the first to leave a review!',
}) => {
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: Review }) => <ReviewCard review={item} />,
    []
  );

  const keyExtractor = useCallback((item: Review) => item.id.toString(), []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant || colors.secondary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }, [isLoading, emptyMessage, colors.onSurfaceVariant, colors.secondary]);

  if (isLoading && reviews.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={reviews.length === 0 ? styles.emptyList : styles.list}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={hasNextPage ? onEndReached : undefined}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ReviewCard } from './ReviewCard';
import { useTheme } from '../../../theme/ThemeContext';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  onEndReached: () => void;
  hasNextPage: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  isError,
  onEndReached,
  hasNextPage,
  ListHeaderComponent,
}) => {
  const { theme } = useTheme();

  if (isLoading && reviews.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError && reviews.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Failed to load reviews.</Text>
      </View>
    );
  }

  if (!isLoading && reviews.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No reviews yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReviewCard review={item} />}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={hasNextPage ? onEndReached : null}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading && reviews.length > 0 ? (
          <ActivityIndicator style={styles.footer} color={theme.colors.primary} />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  footer: {
    marginVertical: 16,
  },
});

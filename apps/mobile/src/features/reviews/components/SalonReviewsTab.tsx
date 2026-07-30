import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { useReviews } from '../../../hooks/useReviews';
import { ReviewsList } from './ReviewsList';

interface SalonReviewsTabProps {
  businessId: string;
}

export const SalonReviewsTab: React.FC<SalonReviewsTabProps> = ({ businessId }) => {
  const { colors } = useTheme();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useReviews({ businessId, limit: 5 });

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];
  const meta = data?.pages[0]?.meta;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ReviewsList
        reviews={reviews}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
        totalCount={meta?.totalCount}
        averageRating={meta?.averageRating}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

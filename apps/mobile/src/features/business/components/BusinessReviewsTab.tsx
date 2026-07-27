import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ReviewList } from '../../reviews/components/ReviewList';
import { useReviews } from '../../reviews/hooks/useReviews';
import { useRouter } from 'expo-router';

interface BusinessReviewsTabProps {
  businessId: number;
}

export const BusinessReviewsTab: React.FC<BusinessReviewsTabProps> = ({ businessId }) => {
  const { colors } = useTheme();
  const router = useRouter();

  const {
    reviews,
    isLoading,
    isRefreshing,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useReviews(businessId);

  const handleViewAll = () => {
    router.push(`/business/${businessId}/reviews`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
        {reviews.length > 0 && (
          <TouchableOpacity onPress={handleViewAll} accessibilityRole="button" accessibilityLabel="View all reviews">
            <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        )}
      </View>
      <ReviewList
        reviews={reviews.slice(0, 3)}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={refetch}
        onEndReached={fetchNextPage}
        hasNextPage={false}
        isFetchingNextPage={false}
        emptyMessage="No reviews yet."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
});

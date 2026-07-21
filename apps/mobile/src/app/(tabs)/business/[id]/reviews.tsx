import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { ReviewList } from '../../../../features/reviews/components/ReviewList';
import { SubmitReviewModal } from '../../../../features/reviews/components/SubmitReviewModal';
import { useReviews } from '../../../../features/reviews/hooks/useReviews';

export default function BusinessReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useReviews({ businessId: id });

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.summaryRow}>
        <View style={styles.ratingSummary}>
          {averageRating ? (
            <>
              <Text style={[styles.averageRating, { color: theme.colors.textPrimary }]}>{averageRating}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(Number(averageRating)) ? 'star' : 'star-outline'}
                    size={16}
                    color={theme.colors.warning}
                  />
                ))}
              </View>
              <Text style={[styles.reviewCount, { color: theme.colors.textSecondary }]}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Text>
            </>
          ) : (
            <Text style={[styles.noRating, { color: theme.colors.textSecondary }]}>No ratings yet</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.writeButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.writeButtonText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        isError={isError}
        onEndReached={handleEndReached}
        hasNextPage={hasNextPage}
        ListHeaderComponent={<Header />}
      />
      <SubmitReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        businessId={id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summary: {
    alignItems: 'flex-start',
  },
  averageRating: {
    fontSize: 32,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  reviewCount: {
    fontSize: 14,
  },
  noRating: {
    fontSize: 16,
    fontWeight: '500',
  },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { ReviewList } from '../components/ReviewList';
import { SubmitReviewModal } from '../components/SubmitReviewModal';
import { useReviews } from '../hooks/useReviews';

export default function SalonReviews() {
  const { businessId } = useLocalSearchParams<{ businessId: string }>();
  const numericBusinessId = businessId ? Number(businessId) : 0;
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    reviews,
    isLoading,
    isRefreshing,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    invalidate,
  } = useReviews(numericBusinessId);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleReviewSubmitted = useCallback(() => {
    invalidate();
  }, [invalidate]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        emptyMessage="No reviews yet. Be the first to share your experience!"
      />

      <FAB
        icon="pencil"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Write a review"
        accessibilityRole="button"
      />

      <SubmitReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        businessId={numericBusinessId}
        onSubmitted={handleReviewSubmitted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

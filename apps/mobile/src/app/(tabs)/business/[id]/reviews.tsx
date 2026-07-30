import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../shared/theme/ThemeContext';
import { useReviews } from '../../../../hooks/useReviews';
import { ReviewsList } from '../../../../features/Reviews/components/ReviewsList';
import { SubmitReviewModal } from '../../../../features/Reviews/components/SubmitReviewModal';

export default function BusinessReviewsScreen() {
  const { id, appointmentId } = useLocalSearchParams<{
    id: string;
    appointmentId?: string;
  }>();
  const { colors } = useTheme();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useReviews({ businessId: id });

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];
  const meta = data?.pages[0]?.meta;

  const handleReviewSubmitted = useCallback(() => {
    setShowSubmitModal(false);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Reviews',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowSubmitModal(true)}
              style={styles.writeReviewButton}
              accessibilityRole="button"
              accessibilityLabel="Write a review"
            >
              <Ionicons name="create-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
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
      <SubmitReviewModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        businessId={id}
        appointmentId={appointmentId}
        onSubmitted={handleReviewSubmitted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  writeReviewButton: {
    padding: 8,
  },
});

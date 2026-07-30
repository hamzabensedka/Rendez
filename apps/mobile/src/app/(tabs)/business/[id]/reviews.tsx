import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import ReviewList from '@/features/reviews/components/ReviewList';
import SubmitReviewSheet from '@/features/reviews/components/SubmitReviewSheet';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface ReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    averageRating: number;
    page: number;
    limit: number;
  };
}

export default function BusinessReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [showSubmitSheet, setShowSubmitSheet] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<ReviewsResponse>({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const response = await apiClient.get(`/businesses/${id}/reviews`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleOpenSubmitSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseSubmitSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleReviewSuccess = useCallback(() => {
    bottomSheetRef.current?.close();
    refetch();
  }, [refetch]);

  const reviews = reviewsData?.data || [];
  const averageRating = reviewsData?.meta?.averageRating || 0;
  const totalReviews = reviewsData?.meta?.total || 0;

  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <View style={styles.statsHeader}>
        <View style={styles.statsContent}>
          <View style={styles.ratingOverview}>
            <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(averageRating) ? 'star' : 'star-outline'}
                  size={18}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews} avis</Text>
          </View>
          {user && (
            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={handleOpenSubmitSheet}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.writeReviewText}>Écrire un avis</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Reviews List */}
      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isRefreshing={isRefetching}
        emptyMessage="Soyez le premier à donner votre avis !"
      />

      {/* Submit Review Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['70%']}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <SubmitReviewSheet
          businessId={id}
          onClose={handleCloseSubmitSheet}
          onSuccess={handleReviewSuccess}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingOverview: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  totalReviews: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { reviewsApi } from '../../../api/reviews';
import { Review, CreateReviewPayload } from '../../../types/review';
import StarRatingInput from '../../../components/reviews/StarRatingInput';
import ReviewCard from '../../../components/reviews/ReviewCard';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';

export default function SalonReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const businessId = parseInt(id as string, 10);

  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useQuery<Review[]>({
    queryKey: ['reviews', businessId],
    queryFn: () => reviewsApi.getBusinessReviews(businessId),
    enabled: !!businessId,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewsApi.createReview(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', businessId] });
      setShowForm(false);
      setRating(0);
      setComment('');
      Alert.alert('Success', 'Your review has been submitted.');
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error?.message || 'Failed to submit review. Please try again.'
      );
    },
  });

  const handleSubmit = useCallback(() => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to leave a review.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    submitMutation.mutate({ rating, comment: comment.trim() || undefined });
  }, [user, rating, comment, submitMutation, router]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <View style={styles.placeholder} />
      </View>

      {reviews && reviews.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.averageRating}>
            {calculateAverage(reviews).toFixed(1)}
          </Text>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.reviewCount}>
            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyState
        icon="chatbubble-ellipses-outline"
        title="No Reviews Yet"
        description="Be the first to share your experience!"
        actionLabel="Write a Review"
        onAction={() => setShowForm(true)}
      />
    );
  };

  const renderItem = ({ item, index }: { item: Review; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <ReviewCard review={item} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6D28D9" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <EmptyState
            icon="alert-circle-outline"
            title="Failed to Load Reviews"
            description="Something went wrong. Please try again."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Submit Review FAB */}
      {!showForm && (
        <Animated.View
          entering={FadeInDown.springify()}
          exiting={FadeOutUp}
          style={styles.fab}
        >
          <Button
            title="Write a Review"
            onPress={() => setShowForm(true)}
            icon="pencil"
            variant="primary"
            size="lg"
          />
        </Animated.View>
      )}

      {/* Review Form Modal */}
      {showForm && (
        <Animated.View
          entering={FadeInDown.springify()}
          exiting={FadeOutUp}
          style={styles.formOverlay}
        >
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Write a Review</Text>
              <TouchableOpacity
                onPress={() => setShowForm(false)}
                accessibilityLabel="Close review form"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Your Rating</Text>
            <StarRatingInput rating={rating} onRatingChange={setRating} />

            <Text style={styles.label}>Your Review (optional)</Text>
            <View style={styles.commentInputWrapper}>
              <Text style={styles.commentPlaceholder}>
                {comment || 'Share details of your experience...'}
              </Text>
              {/* In a real implementation, use TextInput. 
                  Placeholder text simulates the input area for this wireframe. */}
            </View>

            <View style={styles.formActions}>
              <Button
                title="Cancel"
                onPress={() => setShowForm(false)}
                variant="outline"
                size="md"
              />
              <Button
                title={submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
                onPress={handleSubmit}
                variant="primary"
                size="md"
                disabled={submitMutation.isPending}
                loading={submitMutation.isPending}
              />
            </View>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function calculateAverage(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  averageRating: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  formOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  commentInputWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  commentPlaceholder: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});

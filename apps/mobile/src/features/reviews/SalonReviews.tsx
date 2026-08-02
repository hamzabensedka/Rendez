import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { reviewsApi } from '../../services/api/reviews';
import { Review } from '../../types/review';
import { ReviewCard } from './ReviewCard';
import { StarRating } from '../../components/StarRating';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography } from '../../theme';

export function SalonReviews() {
  const { id: businessId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reviews', businessId],
    queryFn: () => reviewsApi.getReviews(businessId!),
    enabled: !!businessId,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { businessId: string; rating: number; comment: string }) =>
      reviewsApi.submitReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', businessId] });
      setShowForm(false);
      setRating(0);
      setComment('');
      Alert.alert('Success', 'Your review has been submitted.');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to submit review.');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!businessId || rating === 0) {
      Alert.alert('Validation', 'Please select a star rating.');
      return;
    }
    setIsSubmitting(true);
    submitMutation.mutate({ businessId, rating, comment: comment.trim() });
  }, [businessId, rating, comment, submitMutation]);

  const handleToggleForm = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'You need to be signed in to leave a review.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') },
        ]
      );
      return;
    }
    setShowForm((prev) => !prev);
  };

  const renderHeader = () => {
    if (!reviewsData) return null;
    const { averageRating, totalCount } = reviewsData;
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.ratingSummary}>
          <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
          <StarRating rating={Math.round(averageRating)} size={20} readonly />
          <Text style={styles.totalCount}>({totalCount} reviews)</Text>
        </View>
        <Button
          title={showForm ? 'Cancel' : 'Write a Review'}
          variant="outline"
          onPress={handleToggleForm}
          style={styles.writeButton}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No reviews yet</Text>
        <Text style={styles.emptySubtitle}>
          Be the first to share your experience!
        </Text>
        <Button
          title="Write a Review"
          onPress={handleToggleForm}
          style={styles.emptyButton}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load reviews.</Text>
        <Button title="Retry" onPress={() => refetch()} variant="ghost" />
      </View>
    );
  }

  const reviews = reviewsData?.reviews ?? [];

  return (
    <View style={styles.container}>
      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Your Review</Text>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={32}
            readonly={false}
          />
          <TextInput
            placeholder="Share your experience (optional)"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            style={styles.commentInput}
          />
          <View style={styles.formActions}>
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setShowForm(false)}
              disabled={isSubmitting}
            />
            <Button
              title="Submit Review"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={rating === 0 || isSubmitting}
            />
          </View>
        </View>
      )}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  averageRating: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  totalReviews: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  writeButton: {
    alignSelf: 'flex-start',
  },
  formContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  formTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  commentInput: {
    marginTop: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  listContent: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    minWidth: 160,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    marginBottom: 12,
  },
});

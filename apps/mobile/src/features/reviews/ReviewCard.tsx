import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Review } from '../../types/review';
import { StarRating } from '../../components/StarRating';
import { Avatar } from '../../components/Avatar';
import { formatRelativeDate } from '../../utils/date';
import { colors, typography } from '../../shared';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={review.user.avatarUrl ? { uri: review.user.avatarUrl } : undefined}
          name={review.user.name}
          size={40}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.user.name}</Text>
          <Text style={styles.date}>
            {formatRelativeDate(review.createdAt)}
          </Text>
        </View>
        <StarRating rating={review.rating} size={14} readonly />
      </View>
      {review.comment ? (
        <Text style={styles.comment}>{review.comment}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  comment: {
    marginTop: 10,
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: 20,
  },
});

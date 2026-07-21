import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { formatDistanceToNow } from 'date-fns';

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

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { theme } = useTheme();
  const userDisplayName = review.user
    ? `${review.user.firstName ?? ''} ${review.user.lastName ?? ''}`.trim() || 'Anonymous'
    : 'Anonymous';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} accessibilityLabel={`Review by ${userDisplayName}`}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="person" size={20} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>{userDisplayName}</Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={theme.colors.warning} />
          <Text style={[styles.ratingText, { color: theme.colors.textPrimary }]}>{review.rating.toFixed(1)}</Text>
        </View>
      </View>
      {review.comment ? (
        <Text style={[styles.comment, { color: theme.colors.textSecondary }]}>{review.comment}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

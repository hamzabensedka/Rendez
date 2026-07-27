import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { formatRelative } from 'date-fns';

interface ReviewUser {
  id: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { colors } = useTheme();

  const initials = review.user
    ? `${review.user.firstName.charAt(0)}${review.user.lastName?.charAt(0) || ''}`
    : '?';

  const displayName = review.user
    ? `${review.user.firstName} ${review.user.lastName || ''}`.trim()
    : 'Anonymous';

  const relativeTime = formatRelative(new Date(review.createdAt), new Date());

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.outlineVariant || colors.border }]} accessibilityRole="article" accessibilityLabel={`Review by ${displayName}, rated ${review.rating} out of 5`}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryContainer || colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.onPrimaryContainer || colors.onPrimary }]}>
            {initials}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.onSurface }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.date, { color: colors.onSurfaceVariant || colors.secondary }]}>
            {relativeTime}
          </Text>
        </View>
      </View>
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name={i < review.rating ? 'star' : 'star-outline'}
            size={16}
            color={i < review.rating ? colors.warning || '#FFD700' : colors.border || '#D1D5DB'}
            style={styles.starIcon}
          />
        ))}
      </View>
      {review.comment ? (
        <Text style={[styles.comment, { color: colors.onSurface }]} numberOfLines={4}>
          {review.comment}
        </Text>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

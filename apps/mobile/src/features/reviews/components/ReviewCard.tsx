import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/ThemeContext';
import { Review } from '../types';
import { formatRelativeTime } from '../../../shared/utils/date';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { colors } = useTheme();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={14}
        color={index < rating ? '#F59E0B' : colors.borderLight}
        style={styles.starIcon}
      />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityRole="article" accessibilityLabel={`Review by ${review.user?.name || 'Anonymous'}, rated ${review.rating} out of 5`}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {(review.user?.name || 'A').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>
              {review.user?.name || 'Anonymous'}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatRelativeDate(review.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(review.rating)}
        </View>
      </View>
      {review.comment ? (
        <Text style={[styles.comment, { color: colors.text }]}>
          {review.comment}
        </Text>
      ) : null}
      {review.response ? (
        <View style={[styles.responseContainer, { backgroundColor: colors.background, borderLeftColor: colors.primary }]}>
          <Text style={[styles.responseLabel, { color: colors.primary }]}>
            Business response:
          </Text>
          <Text style={[styles.responseText, { color: colors.textSecondary }]}>
            {review.response}
          </Text>
        </View>
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
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginLeft: 2,
  },
  comment: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  responseContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  responseLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

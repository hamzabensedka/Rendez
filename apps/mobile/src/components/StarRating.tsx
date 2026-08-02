import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../shared';

interface StarRatingProps {
  rating: number; // 0-5, can be decimal for display
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  maxStars?: number;
}

export function StarRating({
  rating,
  onRatingChange,
  size = 24,
  readonly = false,
  maxStars = 5,
}: StarRatingProps) {
  const handlePress = useCallback(
    (index: number) => {
      if (!readonly && onRatingChange) {
        onRatingChange(index + 1);
      }
    },
    [readonly, onRatingChange]
  );

  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    const fill = Math.min(1, Math.max(0, rating - i));
    const iconName =
      fill >= 1
        ? 'star'
        : fill > 0
        ? 'star-half'
        : 'star-outline';

    stars.push(
      <TouchableOpacity
        key={i}
        onPress={() => handlePress(i)}
        disabled={readonly}
        activeOpacity={readonly ? 1 : 0.7}
        style={styles.starButton}
        accessibilityRole="button"
        accessibilityLabel={`${i + 1} star${i + 1 > 1 ? 's' : ''}`}
        accessibilityState={{ selected: fill >= 1 }}
      >
        <Ionicons
          name={iconName}
          size={size}
          color={fill > 0 ? colors.warning : colors.border}
        />
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginRight: 2,
  },
});

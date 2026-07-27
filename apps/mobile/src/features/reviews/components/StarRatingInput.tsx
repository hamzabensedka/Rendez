import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  disabled?: boolean;
  maxStars?: number;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onRatingChange,
  size = 32,
  disabled = false,
  maxStars = 5,
}) => {
  const { colors } = useTheme();

  const handlePress = useCallback(
    (star: number) => {
      if (!disabled) {
        onRatingChange(star);
      }
    },
    [disabled, onRatingChange]
  );

  return (
    <View style={styles.container} accessibilityRole="adjustable" accessibilityLabel={`Rating: ${rating} out of ${maxStars} stars`} accessibilityValue={{ min: 1, max: maxStars, now: rating }}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        const filled = starNumber <= rating;
        return (
          <TouchableOpacity
            key={starNumber}
            onPress={() => handlePress(starNumber)}
            disabled={disabled}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${starNumber} star${starNumber > 1 ? 's' : ''}`}
            accessibilityState={{ selected: filled }}
            style={styles.starButton}
          >
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? colors.warning || '#FFD700' : colors.border || '#D1D5DB'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 2,
  },
});

import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onRatingChange,
  size = 32,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const handlePress = useCallback(
    (star: number) => {
      if (!disabled) {
        onRatingChange(star);
      }
    },
    [disabled, onRatingChange]
  );

  return (
    <View style={styles.container} accessibilityRole="adjustable" accessibilityLabel={`Rating: ${rating} out of 5 stars`} accessibilityValue={{ min: 0, max: 5, now: rating }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleStarPress(star)}
          disabled={disabled}
          activeOpacity={0.7}
          accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
          accessibilityRole="button"
          accessibilityState={{ selected: star <= rating }}
        >
          <Animated.View>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={size}
              color={star <= rating ? theme.colors.warning : theme.colors.border}
            />
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

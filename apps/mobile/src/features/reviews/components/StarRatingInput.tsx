import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  maxStars?: number;
  disabled?: boolean;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onRatingChange,
  size = 32,
  maxStars = 5,
  disabled = false,
}) => {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const starScales = Array.from({ length: maxStars }, () => useSharedValue(1));

  const handlePress = useCallback(
    (starIndex: number) => {
      if (disabled) return;
      const newRating = starIndex + 1;
      onRatingChange(newRating === rating ? 0 : newRating);

      // Animate all stars up to the pressed one
      for (let i = 0; i <= starIndex; i++) {
        scales[i].value = withSpring(1.3, { damping: 10, stiffness: 200 }, () => {
          scales[i].value = withSpring(1);
        });
      }
    },
    [rating, onRatingChange, disabled, scales]
  );

  const animatedStyles = scales.map((scale) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => {
        const filled =
          disabled
            ? index < rating
            : index < (hoveredStar || rating);

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            onPressIn={() => !disabled && setHoveredStar(index + 1)}
            onPressOut={() => !disabled && setHoveredStar(0)}
            disabled={disabled}
            activeOpacity={0.7}
            accessibilityLabel={`${index + 1} star${index > 0 ? 's' : ''}`}
            accessibilityRole="button"
            accessibilityState={{ selected: index < rating }}
          >
            <AnimatedStar style={animatedStyles[index]}>
              <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={size}
                color={filled ? '#FFD700' : '#D1D5DB'}
              />
            </AnimatedStar>
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
    gap: 4,
  },
});

export default StarRatingInput;

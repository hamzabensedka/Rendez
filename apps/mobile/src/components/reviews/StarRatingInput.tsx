import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
  size?: number;
  readonly?: boolean;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function StarRatingInput({
  rating,
  onRatingChange,
  maxStars = 5,
  size = 36,
  readonly = false,
}: StarRatingInputProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <View style={styles.container} accessibilityRole="radiogroup" accessibilityLabel="Star rating">
      {stars.map((star) => (
        <StarButton
          key={star}
          star={star}
          rating={rating}
          onRatingChange={onRatingChange}
          size={size}
          readonly={readonly}
        />
      ))}
    </View>
  );
}

function StarButton({
  star,
  rating,
  onRatingChange,
  size,
  readonly,
}: {
  star: number;
  rating: number;
  onRatingChange: (r: number) => void;
  size: number;
  readonly: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const filled = star <= rating;

  const handlePress = () => {
    if (readonly) return;
    scale.value = withSpring(1.3, { damping: 2, stiffness: 200 }, () => {
      scale.value = withSpring(1);
    });
    onRatingChange(star);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={readonly}
      accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
      accessibilityRole="radio"
      accessibilityState={{ selected: filled }}
    >
      <AnimatedIcon
        name={filled ? 'star' : 'star-outline'}
        size={size}
        color={filled ? '#F59E0B' : '#D1D5DB'}
        style={animatedStyle}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});

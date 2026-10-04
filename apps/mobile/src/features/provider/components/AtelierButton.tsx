import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import { providerTheme as T } from '../providerTheme';

interface AtelierButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'ink' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function AtelierButton({
  title,
  onPress,
  variant = 'ink',
  loading,
  disabled,
  style,
}: AtelierButtonProps) {
  const ink = variant === 'ink';
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        ink && styles.ink,
        outline && styles.outline,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={ink ? T.colors.bookedText : T.colors.ink} />
      ) : (
        <Text style={[styles.label, ink ? styles.labelInk : styles.labelMute]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: T.radius.card,
  },
  ink: { backgroundColor: T.colors.ink },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
  },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  label: {
    fontFamily: T.font.medium,
    fontSize: 13,
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  labelInk: { color: T.colors.bookedText },
  labelMute: { color: T.colors.ink },
});

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface AtelierButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'ink' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export function AtelierButton({
  label,
  onPress,
  variant = 'ink',
  disabled,
  loading,
  accessibilityLabel,
}: AtelierButtonProps) {
  const ghost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        ghost ? styles.ghost : styles.ink,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {loading ? (
        <ActivityIndicator color={ghost ? T.colors.ink : T.colors.bookedText} />
      ) : (
        <Text style={ghost ? styles.ghostText : styles.inkText}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  ink: { backgroundColor: T.colors.ink },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
  },
  inkText: { fontFamily: T.font.medium, fontSize: 15, color: T.colors.bookedText },
  ghostText: { fontFamily: T.font.medium, fontSize: 15, color: T.colors.ink },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
});

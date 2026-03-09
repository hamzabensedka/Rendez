import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { colors, spacing, radius } from '../tokens';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.light.border;
    switch (variant) {
      case 'primary': return colors.light.text; // Black primary
      case 'secondary': return colors.light.surface;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.light.text;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.light.textSecondary;
    switch (variant) {
      case 'primary': return colors.light.surface;
      case 'secondary': return colors.light.text;
      case 'outline': return colors.light.text;
      case 'ghost': return colors.light.text;
      default: return colors.light.surface;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.light.border;
    if (variant === 'secondary') return colors.light.border;
    return 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm };
      case 'lg': return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default: return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg }; // md
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: (variant === 'outline' || variant === 'secondary') ? 1 : 0,
          borderRadius: radius.md,
          ...getPadding(),
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      accessibilityHint={disabled ? undefined : 'Double tap to activate'}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon}
          <Text 
            variant="headline" 
            style={[
              { color: getTextColor(), marginHorizontal: spacing.sm },
              size === 'sm' && { fontSize: 14 },
              textStyle
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

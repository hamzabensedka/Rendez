import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../tokens';

export interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing | 'none';
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'lg',
  style,
  variant = 'elevated',
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.light.surface,
          ...shadows.sm,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: colors.light.surface,
          borderWidth: 1,
          borderColor: colors.light.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.light.surfaceSecondary,
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const paddingValue = padding === 'none' ? 0 : spacing[padding as keyof typeof spacing];

  return (
    <View
      style={[
        styles.base,
        getStyle(),
        { padding: paddingValue },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});

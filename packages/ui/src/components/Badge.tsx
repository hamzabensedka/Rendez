import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '../tokens';

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success': return { bg: colors.light.success + '20', text: colors.light.success }; // 20% opacity
      case 'error': return { bg: colors.light.error + '20', text: colors.light.error };
      case 'warning': return { bg: colors.light.surfaceSecondary, text: colors.light.textSecondary };
      case 'outline': return { bg: 'transparent', text: colors.light.text, border: colors.light.border };
      default: return { bg: colors.light.background, text: colors.light.textSecondary };
    }
  };

  const { bg, text, border } = getColors();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border || 'transparent',
          borderWidth: border ? 1 : 0,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 6 : 8,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        variant="caption"
        color={text}
        weight="600"
        style={size === 'sm' ? { fontSize: 10 } : undefined}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
});

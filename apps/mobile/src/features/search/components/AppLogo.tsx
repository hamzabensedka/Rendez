import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { Text } from '@planity/ui';
import { colors } from '@planity/ui';

export const APP_DISPLAY_NAME = 'Rendez';

export const AppLogo = React.memo<TextProps>(function AppLogo({ style, ...props }) {
  return (
    <Text
      variant="headline"
      style={[styles.logo, style]}
      {...props}
    >
      {APP_DISPLAY_NAME.toUpperCase()}
    </Text>
  );
});

const styles = StyleSheet.create({
  logo: {
    fontSize: 16,
    color: colors.light.text,
    letterSpacing: 4,
    fontWeight: '700',
  },
});

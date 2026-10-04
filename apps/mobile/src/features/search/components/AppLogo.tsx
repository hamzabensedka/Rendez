import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export const APP_DISPLAY_NAME = 'Atelier';

export const AppLogo = React.memo<TextProps>(function AppLogo({ style, ...props }) {
  return (
    <Text style={[styles.logo, style]} {...props}>
      ATELIER
    </Text>
  );
});

const styles = StyleSheet.create({
  logo: {
    fontFamily: T.font.label,
    fontSize: 13,
    color: T.colors.ink,
    letterSpacing: 2.4,
  },
});

import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export const PlanityLogo = React.memo<TextProps>(function PlanityLogo({ style, ...props }) {
  return (
    <Text style={[styles.logo, style]} {...props}>
      RENDEZ
    </Text>
  );
});

const styles = StyleSheet.create({
  logo: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    letterSpacing: 5,
    fontWeight: '800',
  },
});

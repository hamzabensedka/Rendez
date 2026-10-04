import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface BookingProgressBarProps {
  stepLabel: string;
  title: string;
  progressPercent: number;
}

export function BookingProgressBar({ stepLabel, title, progressPercent }: BookingProgressBarProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.step}>{stepLabel}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progressPercent))}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: T.colors.paper,
  },
  step: {
    fontFamily: T.font.label,
    fontSize: 11,
    letterSpacing: 1.4,
    color: T.colors.muted,
    marginBottom: 4,
  },
  title: {
    fontFamily: T.font.display,
    fontSize: 20,
    color: T.colors.ink,
    marginBottom: 12,
  },
  track: {
    height: 2,
    backgroundColor: T.colors.rule,
  },
  fill: {
    height: 2,
    backgroundColor: T.colors.ink,
  },
});

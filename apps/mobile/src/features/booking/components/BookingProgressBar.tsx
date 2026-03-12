import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@planity/ui';

interface BookingProgressBarProps {
  stepLabel: string;
  title: string;
  progressPercent: string;
}

export function BookingProgressBar({ stepLabel, title, progressPercent }: BookingProgressBarProps) {
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressLabels}>
        <Text style={styles.progressStep}>{stepLabel}</Text>
        <Text style={styles.progressTitle}>{title}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: progressPercent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.light.surface,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  progressStep: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: colors.light.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.light.text,
    borderRadius: 1,
  },
});

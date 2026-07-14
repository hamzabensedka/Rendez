import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';

interface AroundMeButtonProps {
  onPress: () => void;
}

export const AroundMeButton = React.memo<AroundMeButtonProps>(function AroundMeButton({
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityLabel="Search near me"
      accessibilityRole="button"
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="location-outline" size={22} color={colors.light.accent} />
        </View>
        <View style={styles.textWrap}>
          <Text variant="headline">Near me</Text>
          <Text variant="footnote" color={colors.light.textSecondary}>
            Use current location
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={colors.light.textTertiary} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    ...shadows.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.light.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
});

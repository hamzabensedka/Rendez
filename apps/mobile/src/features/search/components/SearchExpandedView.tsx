import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';

interface SearchExpandedViewProps {
  category: string;
  address: string;
  time: string;
  onClose: () => void;
  onCategoryPress: () => void;
  onAddressPress: () => void;
  onTimePress: () => void;
}

export const SearchExpandedView = React.memo<SearchExpandedViewProps>(function SearchExpandedView({
  category,
  address,
  time,
  onClose,
  onCategoryPress,
  onAddressPress,
  onTimePress,
}) {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
        <Ionicons name="close" size={24} color={colors.light.text} />
      </TouchableOpacity>

      {/* Inputs Container */}
      <View style={styles.inputsWrapper}>
        {/* Category Input */}
        <TouchableOpacity style={styles.inputRow} onPress={onCategoryPress} activeOpacity={0.7}>
          <Ionicons name="search" size={20} color={colors.light.textSecondary} style={styles.icon} />
          <Text variant="body" color={colors.light.text}>{category}</Text>
        </TouchableOpacity>

        {/* Address Input */}
        <TouchableOpacity style={styles.inputRow} onPress={onAddressPress} activeOpacity={0.7}>
          <Ionicons name="location-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
          <Text variant="body" color={colors.light.text}>{address}</Text>
        </TouchableOpacity>

        {/* Time Input */}
        <TouchableOpacity style={styles.inputRow} onPress={onTimePress} activeOpacity={0.7}>
          <Ionicons name="time-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
          <Text variant="body" color={colors.light.text}>{time}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.light.background,
    zIndex: 10,
  },
  closeIcon: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    marginLeft: 4,
    padding: 4,
  },
  inputsWrapper: {
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
});

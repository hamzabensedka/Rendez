import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
  testID?: string;
  /** Hide bottom border (e.g. search landing) */
  noBorder?: boolean;
}

export const ScreenHeader = React.memo<ScreenHeaderProps>(function ScreenHeader({
  title,
  onBack,
  leftIcon = 'chevron-back',
  rightElement,
  testID,
  noBorder,
}) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);

  return (
    <View style={[styles.header, noBorder && styles.headerNoBorder]} testID={testID}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        accessibilityLabel="Back"
        accessibilityRole="button"
      >
        <Ionicons name={leftIcon} size={24} color={colors.light.text} />
      </TouchableOpacity>
      <Text variant="headline" style={styles.headerTitle}>
        {title}
      </Text>
      <View style={styles.rightContainer}>
        {rightElement ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerNoBorder: {
    borderBottomWidth: 0,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 44,
  },
});

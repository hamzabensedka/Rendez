import React, { useCallback, useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onClear?: () => void;
  showClearButton?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  testID?: string;
  /** Called when user submits (e.g. presses search/return key). Use to navigate to results. */
  onSubmitEditing?: () => void;
  /** Pill style: rounded-full, soft background, no border (search landing) */
  variant?: 'default' | 'pill';
}

export const SearchInput = React.memo<SearchInputProps>(function SearchInput({
  value,
  onChangeText,
  placeholder,
  onClear,
  showClearButton = true,
  autoFocus = false,
  maxLength,
  testID,
  onSubmitEditing,
  variant = 'default',
}) {
  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  }, [onClear, onChangeText]);

  const showClear = useMemo(
    () => value.length > 0 && showClearButton,
    [value.length, showClearButton]
  );

  const isPill = variant === 'pill';
  return (
    <View style={[styles.wrapper, isPill && styles.wrapperPill]} testID={testID}>
      <View style={[styles.searchCard, isPill && styles.searchCardPill]}>
        {isPill ? (
          <View style={styles.pillRow}>
            <View style={styles.pillIconWrap} pointerEvents="none">
              <Ionicons name="search" size={20} color={colors.light.textSecondary} />
            </View>
            <TextInput
              style={[styles.input, styles.inputPill]}
              placeholder={placeholder}
              placeholderTextColor={colors.light.textTertiary}
              value={value}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              autoFocus={autoFocus}
              maxLength={maxLength}
              returnKeyType="search"
              accessibilityLabel="Search"
            />
            {showClear ? (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton} accessibilityLabel="Clear search" accessibilityRole="button">
                <Text variant="footnote" color={colors.light.accent}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
        <View style={styles.searchRow}>
          <Ionicons
            name="search"
            size={20}
            color={colors.light.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.light.textTertiary}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            autoFocus={autoFocus}
            maxLength={maxLength}
            returnKeyType="search"
            accessibilityLabel="Search"
          />
          {showClear ? (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Text variant="footnote" color={colors.light.accent}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  wrapperPill: {
    paddingVertical: spacing.xl,
    borderBottomWidth: 0,
    backgroundColor: colors.light.background,
  },
  searchCard: {
    backgroundColor: colors.light.background,
    borderRadius: radius.lg,
    ...shadows.xs,
  },
  searchCardPill: {
    backgroundColor: colors.light.surfaceSecondary,
    borderRadius: radius.full,
    ...shadows.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
  },
  pillIconWrap: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  searchRowPill: {
    paddingVertical: 16,
    paddingLeft: 56,
    paddingRight: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
    paddingVertical: 0,
  },
  inputPill: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 40,
    paddingVertical: 0,
  },
  clearButton: {
    paddingLeft: spacing.sm,
  },
});

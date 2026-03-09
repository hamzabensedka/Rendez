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

  return (
    <View style={styles.wrapper} testID={testID}>
      <View style={styles.searchCard}>
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
  searchCard: {
    backgroundColor: colors.light.background,
    borderRadius: radius.lg,
    ...shadows.xs,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
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
  clearButton: {
    paddingLeft: spacing.sm,
  },
});

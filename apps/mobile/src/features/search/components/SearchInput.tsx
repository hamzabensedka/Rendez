import React, { useCallback, useMemo } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onClear?: () => void;
  showClearButton?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  testID?: string;
  onSubmitEditing?: () => void;
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
      <View style={styles.row}>
        <Ionicons name="search" size={18} color={T.colors.muted} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={T.colors.muted}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
          maxLength={maxLength}
          returnKeyType="search"
          accessibilityLabel="Search"
        />
        {showClear ? (
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: T.colors.paper,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.ink,
    paddingVertical: 0,
  },
  clearButton: {
    paddingLeft: 8,
  },
  clearText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    textDecorationLine: 'underline',
  },
});

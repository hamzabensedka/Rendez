import React, { useCallback, useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.shadowWrapper} testID={testID}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="rgba(60, 60, 67, 0.3)"
            value={value}
            onChangeText={onChangeText}
            autoFocus={autoFocus}
            maxLength={maxLength}
            accessibilityLabel="Champ de recherche"
            accessibilityHint="Tapez pour rechercher"
            returnKeyType="search"
          />
          {showClear ? (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              accessibilityLabel="Effacer la recherche"
              accessibilityRole="button"
            >
              <Text style={styles.clearButtonText}>Effacer</Text>
            </TouchableOpacity>
          ) : (
            <Ionicons
              name="search"
              size={20}
              color="rgba(60, 60, 67, 0.3)"
              style={styles.searchIcon}
              accessibilityLabel="Icône de recherche"
            />
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  shadowWrapper: {
    // Wrapper to ensure shadow is not clipped
    backgroundColor: 'transparent',
    zIndex: 1,
    elevation: 4,
    marginBottom: 2, // Space for shadow to be visible
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    // Bottom-only shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 4, // Higher elevation to appear above lists
    borderBottomWidth: 0,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    paddingVertical: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});

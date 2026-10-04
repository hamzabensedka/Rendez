import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface SearchResultsHeaderProps {
  onBack?: () => void;
}

export const SearchResultsHeader = React.memo<SearchResultsHeaderProps>(
  function SearchResultsHeader({ onBack }) {
    const router = useRouter();

    const handleBack = useCallback(() => {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    }, [onBack, router]);

    return (
      <View style={styles.header}>
        <Pressable
          style={styles.button}
          onPress={handleBack}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
        </Pressable>
        <Text style={styles.title}>Results</Text>
        <View style={styles.button} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: T.colors.paper,
  },
  button: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: T.font.display,
    fontSize: 20,
    color: T.colors.ink,
  },
});

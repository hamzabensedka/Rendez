import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { ProfileButton } from './ProfileButton';
import { AppLogo } from './AppLogo';

interface SearchResultsHeaderProps {
  onBack?: () => void;
}

export const SearchResultsHeader = React.memo<SearchResultsHeaderProps>(function SearchResultsHeader({ 
  onBack 
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
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleBack}
        accessibilityLabel="Back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color={colors.light.text} />
      </TouchableOpacity>
      
      <AppLogo />
      
      <ProfileButton />
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
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  button: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

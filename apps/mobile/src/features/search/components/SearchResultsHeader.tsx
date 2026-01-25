import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProfileButton } from './ProfileButton';
import { PlanityLogo } from './PlanityLogo';

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
        accessibilityLabel="Retour"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <PlanityLogo />
      
      <ProfileButton />
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

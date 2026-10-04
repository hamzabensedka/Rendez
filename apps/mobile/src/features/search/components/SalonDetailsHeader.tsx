import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { AppLogo } from './AppLogo';

interface SalonDetailsHeaderProps {
  onBack?: () => void;
}

export const SalonDetailsHeader = React.memo<SalonDetailsHeaderProps>(function SalonDetailsHeader({
  onBack,
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
      <Pressable
        style={styles.button}
        onPress={handleBack}
        accessibilityLabel="Back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
      </Pressable>
      <AppLogo />
      <View style={styles.button} />
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
    backgroundColor: T.colors.paper,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
});

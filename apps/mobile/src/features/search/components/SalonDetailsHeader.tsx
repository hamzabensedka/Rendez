import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { ProfileButton } from './ProfileButton';
import { AppLogo } from './AppLogo';

interface SalonDetailsHeaderProps {
  onBack?: () => void;
}

export const SalonDetailsHeader = React.memo<SalonDetailsHeaderProps>(function SalonDetailsHeader({ 
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
    height: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

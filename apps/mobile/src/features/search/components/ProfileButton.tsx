import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
}

export const ProfileButton = React.memo<ProfileButtonProps>(function ProfileButton({
  onPress,
  style,
  ...props
}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel="Profil"
      accessibilityRole="button"
      {...props}
    >
      <Ionicons name="person-outline" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '@planity/ui';

interface ProfileButtonProps extends TouchableOpacityProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export const ProfileButton = React.memo<ProfileButtonProps>(function ProfileButton({
  onPress,
  style,
  ...props
}) {
  const router = useRouter();

  const handlePress = (e: GestureResponderEvent) => {
    if (onPress) {
      onPress(e);
    } else {
      router.push('/profile');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel="Profile"
      accessibilityRole="button"
      {...props}
    >
      <Ionicons name="person-outline" size={20} color={colors.light.surface} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    width: 48,
    height: 44,
    backgroundColor: colors.light.text, // Black/Dark
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '@planity/ui';
import { useAuth } from '../../../application/providers';

interface ProfileButtonProps extends TouchableOpacityProps {
  onPress?: (event: GestureResponderEvent) => void;
  /** Use dark style (for light backgrounds) or light style (for dark backgrounds) */
  variant?: 'dark' | 'light';
}

export const ProfileButton = React.memo<ProfileButtonProps>(function ProfileButton({
  onPress,
  style,
  variant = 'dark',
  ...props
}) {
  const router = useRouter();
  const { user } = useAuth();

  const handlePress = (e: GestureResponderEvent) => {
    if (onPress) {
      onPress(e);
    } else if (!user) {
      // Not logged in - redirect to login
      router.push('/login');
    } else {
      // Logged in - go to profile
      router.push('/(main)/profile');
    }
  };

  const isDark = variant === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDark ? styles.darkContainer : styles.lightContainer,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={user ? "Profile" : "Login"}
      accessibilityRole="button"
      {...props}
    >
      <Ionicons
        name={user ? "person" : "person-outline"}
        size={20}
        color={isDark ? colors.light.surface : colors.light.text}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    width: 48,
    height: 44,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: colors.light.text, // Black/Dark
  },
  lightContainer: {
    backgroundColor: 'transparent',
  },
});

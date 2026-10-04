import React from 'react';
import { View, StyleSheet, Pressable, StatusBar, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { isProviderRole } from '../../../shared/lib/auth';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const bottomInset = useBottomNavInset();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={T.colors.ink} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ paddingHorizontal: 16, paddingBottom: bottomInset + 24 }}>
          <Text style={styles.name}>{user?.name ?? 'Account'}</Text>
          {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}

          {user ? (
            <>
              {isProviderRole(user.role) ? (
                <Pressable
                  style={styles.row}
                  onPress={() => router.push('/(main)/provider-portal')}
                >
                  <Text style={styles.rowText}>Floor</Text>
                </Pressable>
              ) : null}
              <Pressable style={styles.row} onPress={() => router.push('/(main)/bookings')}>
                <Text style={styles.rowText}>Appointments</Text>
              </Pressable>
              <Pressable style={styles.row} onPress={() => router.push('/(main)/favorites')}>
                <Text style={styles.rowText}>Saved</Text>
              </Pressable>
              <Pressable style={styles.row} onPress={handleLogout}>
                <Text style={styles.rowText}>Sign out</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={styles.inkBtn} onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.inkBtnText}>Sign in</Text>
              </Pressable>
              <Pressable style={styles.textLink} onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.quiet}>Create account</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  safe: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  name: {
    fontFamily: T.font.display,
    fontSize: T.type.display.fontSize,
    lineHeight: T.type.display.lineHeight,
    letterSpacing: T.type.display.letterSpacing,
    color: T.colors.ink,
    marginTop: 12,
  },
  email: {
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.muted,
    marginTop: 6,
    marginBottom: 28,
  },
  row: {
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  rowText: { fontFamily: T.font.body, fontSize: 16, color: T.colors.ink },
  inkBtn: {
    height: 52,
    backgroundColor: T.colors.ink,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  inkBtnText: { fontFamily: T.font.medium, fontSize: 15, color: T.colors.bookedText },
  textLink: { paddingVertical: 16 },
  quiet: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted },
});

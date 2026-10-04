import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../application/providers';
import { AtelierField } from '../../../shared/ui/atelier/AtelierField';
import { AtelierButton } from '../../../shared/ui/atelier/AtelierButton';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const { setPendingRegistration } = useAuth();
  const [name, setName] = useState(params.name ?? '');
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');

  function handleCreate() {
    const trimmedEmail = email.trim();
    if (!name.trim() || !trimmedEmail || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setPendingRegistration({ email: trimmedEmail, password, name: name.trim() });
    router.push({ pathname: '/(auth)/verification', params: { phone: trimmedEmail } });
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.sub}>Join Atelier Floor</Text>
          <AtelierField label="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
          <AtelierField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AtelierField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <AtelierButton label="Create account" onPress={handleCreate} />
          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            style={styles.footer}
            accessibilityRole="button"
          >
            <Text style={styles.footerText}>Already have an account? Sign in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 48,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: T.font.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    fontWeight: '700',
    color: T.colors.ink,
  },
  sub: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.muted,
    marginTop: 8,
    marginBottom: 48,
  },
  footer: { paddingVertical: 32, alignItems: 'center' },
  footerText: { fontFamily: T.font.body, fontSize: 14, lineHeight: 20, color: T.colors.muted },
});

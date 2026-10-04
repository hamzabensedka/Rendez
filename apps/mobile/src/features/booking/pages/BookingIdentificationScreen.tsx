import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { login } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';
import { useKeyboardHeight } from '../../../application/hooks/useKeyboardHeight';
import { AtelierField } from '../../../shared/ui/atelier/AtelierField';
import { AtelierButton } from '../../../shared/ui/atelier/AtelierButton';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export default function BookingIdentificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login: setAuthUser } = useAuth();
  const { selectedSlot, existingServices, businessId, businessName, staffName } =
    useLocalSearchParams<{
      selectedSlot: string;
      existingServices: string;
      businessId: string;
      businessName?: string;
      staffName?: string;
    }>();

  const keyboardHeight = useKeyboardHeight();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const bookingParams = {
    selectedSlot,
    existingServices,
    businessId,
    businessName,
    staffName,
  };

  function handleContinue() {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in name, email, and phone');
      return;
    }
    router.push({
      pathname: '/(main)/booking/register',
      params: {
        ...bookingParams,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
    });
  }

  async function handleLoginSubmit() {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoginLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      setAuthUser(response.user);
      router.back();
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert('Login Failed', message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 32 + keyboardHeight,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Identify</Text>

          <AtelierField
            label="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />
          <AtelierField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <AtelierField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <AtelierButton label="Continue" onPress={handleContinue} />

          <Pressable
            onPress={() => setShowLogin((v) => !v)}
            style={styles.signInLink}
            accessibilityRole="button"
          >
            <Text style={styles.signInText}>Already have an account? Sign in</Text>
          </Pressable>

          {showLogin ? (
            <View style={styles.loginBlock}>
              <AtelierField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <AtelierButton
                label="Sign in"
                onPress={handleLoginSubmit}
                loading={loginLoading}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  flex: { flex: 1 },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: 8 },
  title: {
    fontFamily: T.font.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: T.colors.ink,
    marginBottom: 28,
    marginTop: 8,
  },
  signInLink: { paddingVertical: 20 },
  signInText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    textDecorationLine: 'underline',
  },
  loginBlock: { marginTop: 4 },
});

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, radius } from '@planity/ui';

const HERO_IMAGE = require('../../../../assets/u1759489536_Create_a_916_vertical_image_for_a_mobile_salon_bo_a3a9c926-12e6-48dd-a1f3-2185d18a697d_3.png');

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleReserverUnSoin() {
    router.push('/search-results');
  }

  function handleEspacePro() {
    router.push('/(tabs)/profile');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={HERO_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>

      <KeyboardAvoidingView
        style={[styles.content, { paddingTop: insets.top + 72, paddingBottom: insets.bottom + 24 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.topSection}>
          <Text style={styles.logo}>PLANITY</Text>
          <Text style={styles.tagline}>Premium Beauty Experience</Text>
        </View>

        <View style={styles.interactionSection}>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleReserverUnSoin}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Réserver un soin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleEspacePro}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryButtonText}>Espace Professionnel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 8,
    color: '#fff',
    textAlign: 'center',
  },
  tagline: {
    marginTop: 16,
    fontSize: 10,
    fontWeight: '300',
    letterSpacing: 6,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  interactionSection: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 32,
  },
  buttons: {
    gap: 12,
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#000',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#fff',
    textTransform: 'uppercase',
  },
});

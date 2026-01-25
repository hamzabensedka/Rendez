import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { PlanityLogo, ProfileButton } from '../../search/components';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();

  function handleProfilePress() {
    if (user) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/(auth)/login');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.regionButton} activeOpacity={0.7}>
              <Ionicons name="globe-outline" size={20} color="black" />
              <Text style={styles.regionText} numberOfLines={1}>
                BE (FR)
              </Text>
              <Ionicons name="chevron-down" size={14} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <PlanityLogo style={styles.logo} />
          </View>

          <View style={styles.headerRight}>
            <ProfileButton onPress={handleProfilePress} />
          </View>
        </View>
      </SafeAreaView>

      {/* Main Content Area */}
      <View style={styles.content}>
        <ImageBackground
          source={require('../../../../assets/1000_F_95434145_8Pe8nMQkCZlNAJfLAKd2HLGC9WEKV54U.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay}>
            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                <Text 
                  style={styles.heroTitle} 
                  numberOfLines={1} 
                  adjustsFontSizeToFit
                >
                  Réservez en beauté
                </Text>
                <Text style={styles.heroSubtitle}>Simple • Immédiat • 24h/24</Text>
              </View>

              <TouchableOpacity 
                style={styles.searchBarContainer}
                activeOpacity={0.9}
                onPress={() => router.push('/search')}
              >
                <View style={styles.searchBar}>
                  <Text style={styles.searchPlaceholder}>
                    Nom du salon, prestations (coupe...)
                  </Text>
                  <View style={styles.searchButton}>
                    <Ionicons name="search" size={20} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.professionalButton}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.professionalButtonText}>
                  Je suis un professionnel de beauté
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSafeArea: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  regionText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  logo: {
    fontSize: 22,
    letterSpacing: 4,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  heroTextContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 40,
    lineHeight: 45,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter-Regular', // Adjusted to match typical "Réservez en beauté" style
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  searchBarContainer: {
    width: '100%',
    marginBottom: 24,
    ...shadows.lg,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 55, // Slightly taller
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
  },
  searchButton: {
    width: 36,
    height: 36,
    backgroundColor: '#000000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  professionalButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  professionalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../application/providers';
import { homeHrefForRole, isProviderRole } from '../../../shared/lib/auth';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { useBusinessesSearchQuery } from '../../../application/query/hooks';
import { salonImageForId } from '../../search/constants';
import {
  EXPLORE_TABS,
  ExploreCategoryTabs,
  type ExploreTabId,
} from '../components/ExploreCategoryTabs';
import { ExploreSalonCard } from '../components/ExploreSalonCard';

const HERO_IMAGE = require('../../../../assets/welcome-atelier.png');

function neighborhoodOf(b: { locations?: { city?: string }[] }): string {
  return b.locations?.[0]?.city ?? '';
}

function ClientExplore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomNavInset();
  const [query, setQuery] = useState('');
  const [tabId, setTabId] = useState<ExploreTabId>('hair');
  const slugs = useMemo(
    () => EXPLORE_TABS.find((t) => t.id === tabId)?.slugs ?? [],
    [tabId],
  );
  const { data, isLoading } = useBusinessesSearchQuery({
    query: query.trim() || undefined,
    categories: slugs.length ? [...slugs] : undefined,
  });
  const businesses = data ?? [];

  return (
    <View style={styles.paper}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 16,
          paddingBottom: bottomInset + 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.near}>Near you</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Service or salon"
          placeholderTextColor={T.colors.muted}
          returnKeyType="search"
          accessibilityLabel="Service or salon"
          style={styles.search}
        />
        <View style={styles.tabs}>
          <ExploreCategoryTabs activeId={tabId} onChange={setTabId} />
        </View>
        {isLoading ? <ActivityIndicator color={T.colors.ink} style={{ marginTop: 32 }} /> : null}
        {businesses.map((b) => (
          <ExploreSalonCard
            key={b.id}
            name={b.name}
            neighborhood={neighborhoodOf(b)}
            ratingAvg={b.ratingAvg}
            ratingCount={b.ratingCount}
            imageUri={salonImageForId(b.id)}
            onPress={() => router.push(`/(main)/business/${b.id}`)}
          />
        ))}
        {!isLoading && businesses.length === 0 ? (
          <Text style={styles.empty}>Nothing nearby for this service.</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

function WelcomeLanding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.heroWrap}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={HERO_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover">
        <View style={styles.heroDim} />
      </ImageBackground>
      <View style={[styles.heroInner, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.mark}>ATELIER</Text>
        <View style={styles.heroActions}>
          <Pressable
            style={({ pressed }) => [styles.findBtn, pressed && styles.pressed]}
            onPress={() => router.push('/(main)/search-results')}
            accessibilityRole="button"
            accessibilityLabel="Find a chair"
          >
            <Text style={styles.findText}>Find a chair</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.salonBtn, pressed && styles.pressed]}
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="I run a salon"
          >
            <Text style={styles.salonText}>I run a salon</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function ExploreScreen() {
  const { user } = useAuth();
  if (user && isProviderRole(user.role)) {
    return <Redirect href={homeHrefForRole(user.role)} />;
  }
  if (user) {
    return <ClientExplore />;
  }
  return <WelcomeLanding />;
}

const styles = StyleSheet.create({
  paper: { flex: 1, backgroundColor: T.colors.paper },
  near: {
    fontFamily: T.font.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    color: T.colors.ink,
    marginBottom: 20,
  },
  search: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.ink,
    paddingVertical: 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.rule,
    marginBottom: 20,
  },
  tabs: { marginBottom: 20 },
  empty: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    marginTop: 16,
  },
  heroWrap: { flex: 1, backgroundColor: T.colors.ink },
  heroDim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.30)' },
  heroInner: { flex: 1, paddingHorizontal: 16, justifyContent: 'space-between' },
  mark: {
    fontFamily: T.font.headline,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: T.colors.bookedText,
    paddingLeft: 8,
  },
  heroActions: { gap: 12 },
  findBtn: {
    height: 52,
    backgroundColor: T.colors.ink,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findText: { fontFamily: T.font.body, fontSize: 16, lineHeight: 24, color: T.colors.bookedText },
  salonBtn: {
    height: 52,
    borderRadius: T.radius.card,
    borderWidth: 1,
    borderColor: T.colors.bookedText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonText: { fontFamily: T.font.body, fontSize: 16, lineHeight: 24, color: T.colors.bookedText },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
});

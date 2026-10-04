import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, useFavorites } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { SalonRow } from '../../../shared/ui/atelier/SalonRow';
import { salonImageForId } from '../../search/constants';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { favoriteItems, loading } = useFavorites();
  const bottomInset = useBottomNavInset();

  React.useEffect(() => {
    if (!user) router.replace('/(auth)/login');
  }, [user, router]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset + 24 }}
        >
          <Text style={styles.title}>Saved</Text>
          {loading ? <ActivityIndicator color={T.colors.ink} style={{ marginTop: 24 }} /> : null}
          {favoriteItems.map((item) => (
            <SalonRow
              key={item.businessId}
              name={item.businessName ?? 'Salon'}
              imageUri={salonImageForId(item.businessId)}
              onPress={() => router.push(`/(main)/business/${item.businessId}`)}
            />
          ))}
          {!loading && favoriteItems.length === 0 ? (
            <Text style={styles.empty}>Nothing saved yet.</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  safe: { flex: 1 },
  title: {
    fontFamily: T.font.display,
    fontSize: T.type.display.fontSize,
    lineHeight: T.type.display.lineHeight,
    letterSpacing: T.type.display.letterSpacing,
    color: T.colors.ink,
    marginTop: 8,
    marginBottom: 8,
  },
  empty: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, marginTop: 16 },
});

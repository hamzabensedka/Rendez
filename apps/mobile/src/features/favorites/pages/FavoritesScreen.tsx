import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { useAuth, useFavorites } from '../../../application/providers';
import { ProfileButton } from '../../search/components/ProfileButton';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { favoriteItems, loading } = useFavorites();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="body" color={colors.light.accent}>Back</Text>
        </TouchableOpacity>
        <Text variant="title2" style={styles.headerTitle}>Favorites</Text>
        <ProfileButton />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.light.accent} />
          </View>
        ) : favoriteItems.length === 0 ? (
          <View style={styles.center}>
            <Text variant="body" color={colors.light.textSecondary} style={styles.emptyText}>
              No favorites yet. Add some from a business page.
            </Text>
          </View>
        ) : (
          favoriteItems.map((item) => (
            <TouchableOpacity
              key={item.businessId}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/business/${item.businessId}`)}
            >
              <Text variant="headline" style={styles.cardTitle}>
                {item.businessName ?? item.businessId}
              </Text>
              <Text variant="footnote" color={colors.light.textSecondary}>View details</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backBtn: { marginRight: spacing.md },
  headerTitle: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'] },
  center: { flex: 1, padding: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center' },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardTitle: { marginBottom: spacing.xs },
});

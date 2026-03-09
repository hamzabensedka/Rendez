import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { useFavorites } from '../../../application/providers';
import api from '../../../shared/lib/api';

interface FavoriteBusiness {
  id: string;
  name: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [businesses, setBusinesses] = useState<FavoriteBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setBusinesses([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          favorites.map(async (id) => {
            const res = await api.get<{ id: string; name: string }>(`/businesses/${id}`);
            return { id: res.data.id, name: res.data.name };
          })
        );
        if (!cancelled) setBusinesses(results);
      } catch {
        if (!cancelled) setBusinesses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [favorites.join(',')]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="body" color={colors.light.accent}>Back</Text>
        </TouchableOpacity>
        <Text variant="title2" style={styles.headerTitle}>Favorites</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.light.accent} />
          </View>
        ) : businesses.length === 0 ? (
          <View style={styles.center}>
            <Text variant="body" color={colors.light.textSecondary} style={styles.emptyText}>
              No favorites yet. Add some from a business page.
            </Text>
          </View>
        ) : (
          businesses.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/business/${b.id}`)}
            >
              <Text variant="headline" style={styles.cardTitle}>{b.name}</Text>
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

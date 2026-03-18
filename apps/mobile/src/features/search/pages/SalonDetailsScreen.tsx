import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Legacy screen: redirects to canonical business detail (API-backed).
 * Use (tabs)/business/[id] instead.
 */
export default function SalonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <Redirect href={`/(tabs)/business/${id}`} />;
}

import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Legacy route: redirects to the canonical business detail (API-backed).
 */
export default function SalonRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <Redirect href={`/(main)/business/${id}`} />;
}

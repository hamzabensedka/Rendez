import { Redirect } from 'expo-router';

/**
 * Legacy screen: redirects to canonical booking tab.
 * Use (tabs)/booking with businessId and serviceVariantId from BusinessDetailScreen.
 */
export default function SearchBookingScreen() {
  return <Redirect href="/(tabs)/booking" />;
}

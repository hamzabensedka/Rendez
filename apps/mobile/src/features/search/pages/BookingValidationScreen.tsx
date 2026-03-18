import { Redirect } from 'expo-router';

/**
 * Legacy screen: redirects to canonical booking tab.
 * Use (tabs)/booking with businessId and serviceVariantId from BusinessDetailScreen.
 */
export default function BookingValidationScreen() {
  return <Redirect href="/(tabs)/booking" />;
}

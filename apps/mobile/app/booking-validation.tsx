import { Redirect } from 'expo-router';

/**
 * Legacy route: redirects to the canonical booking tab.
 * The real booking flow is (main)/booking with businessId and serviceVariantId from BusinessDetailScreen.
 */
export default function BookingValidationRedirect() {
  return <Redirect href="/(main)/booking" />;
}

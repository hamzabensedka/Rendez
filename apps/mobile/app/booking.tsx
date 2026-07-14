import { Redirect } from 'expo-router';

/**
 * Legacy route: redirects to the canonical booking tab.
 * The live booking flow lives at (main)/booking → features/booking/pages/BookingScreen.
 */
export default function BookingRedirect() {
  return <Redirect href="/(main)/booking" />;
}

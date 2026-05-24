import { Redirect } from 'expo-router';

/**
 * Legacy route: redirects to the canonical profile tab.
 * The live profile flow lives at (main)/profile → features/profile/pages/ProfileScreen.
 */
export default function ProfileRedirect() {
  return <Redirect href="/(main)/profile" />;
}

import { Redirect } from 'expo-router';
import { useAuth } from '../../src/application/providers';
import { homeHrefForRole } from '../../src/shared/lib/auth';

/** `/(main)` has no leaf screen; send each role to a real route. */
export default function MainIndex() {
  const { user } = useAuth();
  return <Redirect href={homeHrefForRole(user?.role)} />;
}

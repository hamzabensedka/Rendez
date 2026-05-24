import { Redirect } from 'expo-router';

// Default route: Open directly to tabs (Explore) for guest browsing
// Users can browse without authentication
export default function Index() {
  return <Redirect href="/(main)/explore" />;
}


import * as SecureStore from 'expo-secure-store';

// `document` exists only in browser builds. We deliberately avoid importing
// react-native here: this module is also loaded by node-environment Jest
// specs where react-native is untranspiled ESM and cannot be parsed.
const web = typeof document !== 'undefined';

export async function getToken(key: string): Promise<string | null> {
  try {
    if (web) {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setToken(key: string, value: string): Promise<void> {
  try {
    if (web) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Native SecureStore is unavailable on web; ignore storage failures.
  }
}

export async function deleteToken(key: string): Promise<void> {
  try {
    if (web) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Clearing a missing or unsupported store must not crash bootstrap.
  }
}

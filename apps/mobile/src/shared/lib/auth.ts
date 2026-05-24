import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  const { accessToken, refreshToken } = response.data;

  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);

  return response.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  const { accessToken, refreshToken } = response.data;

  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch {
    // Still clear local session if revoke fails (e.g. offline)
  } finally {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  // Canonical GET /auth/me returns the user profile object (same shape as former GET /users/me).
  return response.data;
}



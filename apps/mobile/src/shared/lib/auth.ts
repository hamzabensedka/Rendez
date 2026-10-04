import api from './api';
import { deleteToken, getToken, setToken } from './tokenStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
  createdAt?: string;
  providerProfile?: {
    id: string;
    businessId: string | null;
    isOwner: boolean;
    displayName: string | null;
  } | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function isProviderRole(role: string | undefined): boolean {
  return role === 'providerOwner' || role === 'providerStaff';
}

export function homeHrefForRole(
  role: string | undefined
): '/(main)/provider-portal' | '/(main)/explore' {
  if (isProviderRole(role)) {
    return '/(main)/provider-portal';
  }
  return '/(main)/explore';
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  const { accessToken, refreshToken } = response.data;

  await setToken('accessToken', accessToken);
  await setToken('refreshToken', refreshToken);

  try {
    const user = await getCurrentUser();
    return { ...response.data, user };
  } catch {
    return response.data;
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  const { accessToken, refreshToken } = response.data;

  await setToken('accessToken', accessToken);
  await setToken('refreshToken', refreshToken);

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = await getToken('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch {
    // Still clear local session if revoke fails (e.g. offline)
  } finally {
    await deleteToken('accessToken');
    await deleteToken('refreshToken');
  }
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  // Canonical GET /auth/me returns the user profile object (same shape as former GET /users/me).
  return response.data;
}

import axios from 'axios';
import { deleteToken, getToken, setToken } from './tokenStore';

// Browser detection without importing react-native (see tokenStore.ts).
const isWeb = typeof document !== 'undefined';

function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  // Expo web on this machine must not use the LAN IP: the browser origin is
  // localhost:8081, and CORS + mixed-host requests fail. Native / devices keep
  // EXPO_PUBLIC_API_URL (e.g. http://192.168.x.x:3000/v1).
  if (isWeb) {
    return process.env.EXPO_PUBLIC_WEB_API_URL || 'http://localhost:3000/v1';
  }
  return fromEnv || 'http://localhost:3000/v1';
}

const API_URL = resolveApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await getToken('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single-flight refresh: concurrent 401s share one /auth/refresh call so the
// rotating server-side session is never invalidated by our own parallelism.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getToken('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      await setToken('accessToken', accessToken);
      if (newRefreshToken) {
        await setToken('refreshToken', newRefreshToken);
      }
      return accessToken as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await deleteToken('accessToken');
        await deleteToken('refreshToken');
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

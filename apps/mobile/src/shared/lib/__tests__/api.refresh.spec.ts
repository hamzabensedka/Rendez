import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import api from '../api';

function rejectWith401(config: InternalAxiosRequestConfig) {
  return Promise.reject({
    config,
    response: {
      status: 401,
      statusText: 'Unauthorized',
      data: {},
      headers: {},
      config,
    },
  });
}

describe('api client refresh on 401', () => {
  let probeAttempts = 0;

  beforeEach(() => {
    probeAttempts = 0;
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
      if (key === 'accessToken') return Promise.resolve('access-old');
      if (key === 'refreshToken') return Promise.resolve('refresh-1');
      return Promise.resolve(null);
    });
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    api.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const url = config.url ?? '';
      if (url.includes('/probe')) {
        probeAttempts += 1;
        if (probeAttempts === 1) {
          return rejectWith401(config);
        }
        const res: AxiosResponse = {
          data: { ok: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
        return res;
      }
      throw new Error(`Unexpected request URL in test adapter: ${url}`);
    };
  });

  afterEach(() => {
    delete api.defaults.adapter;
    jest.restoreAllMocks();
  });

  it('calls /auth/refresh and retries the original request with the new access token', async () => {
    const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { accessToken: 'access-new', refreshToken: 'refresh-2' },
    } as AxiosResponse);

    const res = await api.get('/probe');

    expect(res.data).toEqual({ ok: true });
    expect(postSpy).toHaveBeenCalledWith(expect.stringMatching(/\/v1\/auth\/refresh$/), {
      refreshToken: 'refresh-1',
    });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'access-new');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'refresh-2');
  });

  it('clears stored tokens when refresh fails', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('refresh failed'));

    await expect(api.get('/probe')).rejects.toThrow();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
  });

  it('shares a single refresh call across concurrent 401s (single-flight)', async () => {
    // Two different endpoints both 401 on first attempt, then succeed.
    let probeAttempts = 0;
    let secondAttempts = 0;
    api.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const url = config.url ?? '';
      if (url.includes('/probe')) {
        probeAttempts += 1;
        return probeAttempts === 1 ? rejectWith401(config) : ok(config);
      }
      if (url.includes('/second')) {
        secondAttempts += 1;
        return secondAttempts === 1 ? rejectWith401(config) : ok(config);
      }
      throw new Error(`Unexpected request URL in test adapter: ${url}`);
    };

    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
      data: { accessToken: 'access-new', refreshToken: 'refresh-2' },
    } as AxiosResponse);

    const [a, b] = await Promise.all([api.get('/probe'), api.get('/second')]);

    expect(a.data).toEqual({ ok: true });
    expect(b.data).toEqual({ ok: true });
    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  function ok(config: InternalAxiosRequestConfig): AxiosResponse {
    return {
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }
});

// src/utils/api.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/redux/store';
import {
  selectAccessToken,
  selectRefreshToken,
  setTokens,
  clearAuth
} from '@/redux/features/auth/auth';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Define public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/init-admin',
  '/health',
];

// Helper function to check if endpoint is public
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Process failed requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const refreshTokens = async (): Promise<string | null> => {
  const state = store.getState();
  const refreshToken = selectRefreshToken(state);

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    // Call your refresh token endpoint
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });

    const { access_token, refresh_token, token_type, expires_in } = response.data;

    // Update tokens in Redux store
    store.dispatch(setTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenType: token_type || 'Bearer',
      expiresIn: expires_in,
    }));

    return access_token;
  } catch (error) {
    // Clear auth if refresh fails
    store.dispatch(clearAuth());
    throw error;
  }
};

const configureInterceptors = (api: AxiosInstance) => {
  // Request interceptor to add bearer token and handle Content-Type
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const state = store.getState();
      const accessToken = selectAccessToken(state);

      // Skip adding token for public endpoints
      if (!isPublicEndpoint(config.url || '')) {
        // Add bearer token to protected requests
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      if (config.data instanceof FormData) {
        // Delete Content-Type to let browser set it with boundary
        delete config.headers['Content-Type'];
        
        for (const [key, value] of config.data.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}:`, value.name, `(${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}:`, value);
          }
        }
      } else {
        // Set JSON Content-Type for non-FormData requests
        config.headers['Content-Type'] = 'application/json';
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;

      // Skip token refresh for public endpoints
      if (isPublicEndpoint(originalRequest.url || '')) {
        return Promise.reject(error);
      }

      // Check if error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshTokens();
          processQueue(null, newToken);

          // Retry original request with new token
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Redirect to login page if refresh fails
          window.location.href = '/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other types of errors
      if (error.response?.status === 403) {
        // Handle forbidden access
        console.warn('Access forbidden:', error.response.data?.message);
      }

      return Promise.reject(error);
    }
  );
};

configureInterceptors(api);

export default api;
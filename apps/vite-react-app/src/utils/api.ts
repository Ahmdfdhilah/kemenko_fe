// src/utils/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/redux/store';
import { logout, checkTokenExpiry } from '@/redux/features/auth/slice';
import { toast } from '@workspace/ui/components/sonner';
import { getAuthToken, isTokenExpired, isTokenExpiring } from './jwt';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Configure interceptors for API instance
const configureInterceptors = (api: AxiosInstance) => {
  // Request interceptor - Add Authorization header and check token expiry
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Check token expiry before making request
      store.dispatch(checkTokenExpiry());
      
      // Get current token
      const token = getAuthToken();
      
      // Add Authorization header if token exists
      if (token && !isTokenExpired()) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add headers to prevent caching
      config.headers['X-No-Cache'] = '1';
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      
      // Warn if token is about to expire
      if (token && isTokenExpiring() && !isTokenExpired()) {
        const state = store.getState();
        const timeLeft = state.auth.tokenExpiry ? (state.auth.tokenExpiry - Date.now() / 1000) : 0;
        const minutesLeft = Math.floor(timeLeft / 60);
        
        toast.info('Sesi akan segera berakhir', {
          description: `Sesi Anda akan berakhir dalam ${minutesLeft} menit`,
        });
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle 401 responses and token expiry
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized responses
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Check if we have a token but it's expired
        const token = getAuthToken();
        
        if (token && isTokenExpired()) {
          // Token is expired, logout user
          store.dispatch(logout());
          toast.error('Sesi kedaluwarsa', {
            description: 'Silakan login kembali untuk melanjutkan',
          });
          
          // Redirect to login page if we're not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else if (token) {
          // Token exists but server says unauthorized
          store.dispatch(logout());
          toast.error('Autentikasi gagal', {
            description: 'Silakan login kembali',
          });
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }

      // Handle other specific error codes
      if (error.response?.status === 403) {
        toast.error('Akses ditolak', {
          description: 'Anda tidak memiliki izin untuk mengakses resource ini',
        });
      } else if (error.response?.status === 500) {
        toast.error('Kesalahan server', {
          description: 'Terjadi masalah pada server. Silakan coba lagi nanti.',
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Kesalahan jaringan', {
          description: 'Periksa koneksi internet Anda',
        });
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to API instance
configureInterceptors(api);

export default api;
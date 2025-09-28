// src/utils/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/config';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

const configureInterceptors = (api: AxiosInstance) => {
  // Request interceptor - Add Authorization header and check token expiry
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
    
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      
      return Promise.reject(error);
    }
  );
};

configureInterceptors(api);

export default api;
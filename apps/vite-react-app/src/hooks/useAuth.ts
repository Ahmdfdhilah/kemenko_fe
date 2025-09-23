// src/hooks/useAuth.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  logout, 
  clearError, 
  setCredentials, 
  checkTokenExpiry 
} from '@/redux/features/auth/slice';
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  updateProfileImage
} from '@/redux/features/auth/thunks';
import {
  selectAuth,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError
} from '@/redux/features/auth/selectors';
import type {
  LoginRequest,
  RegistrationRequest,
  UpdateProfileRequest,
  UserProfile
} from '@/services/membership';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Selectors
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  // Check token expiry on mount and periodically
  useEffect(() => {
    // Check immediately
    dispatch(checkTokenExpiry());

    // Set up periodic check every 60 seconds
    const interval = setInterval(() => {
      dispatch(checkTokenExpiry());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Fetch user profile if authenticated but no user data
  useEffect(() => {
    if (isAuthenticated && token && !user && !isLoading) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, token, user, isLoading, dispatch]);

  // Actions
  const login = useCallback(async (credentials: LoginRequest) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      // After successful login, fetch user profile
      dispatch(getProfile());
      return { success: true, data: result.payload };
    } else {
      return { success: false, error: result.payload as string };
    }
  }, [dispatch]);

  const register = useCallback(async (userData: RegistrationRequest) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      return { success: false, error: result.payload as string };
    }
  }, [dispatch]);

  const updateUserProfile = useCallback(async (profileData: UpdateProfileRequest) => {
    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      return { success: false, error: result.payload as string };
    }
  }, [dispatch]);

  const updateUserProfileImage = useCallback(async (file: File) => {
    const result = await dispatch(updateProfileImage(file));
    if (updateProfileImage.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    } else {
      return { success: false, error: result.payload as string };
    }
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());

    //clear cache react query:
    queryClient.clear();
  }, [dispatch, queryClient]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setUserCredentials = useCallback((credentials: { token: string; user?: UserProfile }) => {
    dispatch(setCredentials(credentials));
  }, [dispatch]);

  const refreshProfile = useCallback(async () => {
    if (isAuthenticated && token) {
      const result = await dispatch(getProfile());
      if (getProfile.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload as string };
      }
    }
    return { success: false, error: 'Not authenticated' };
  }, [dispatch, isAuthenticated, token]);

  // Check if token is about to expire (within 5 minutes)
  const isTokenExpiring = useCallback(() => {
    if (!auth.tokenExpiry) return false;
    const now = Date.now() / 1000;
    const fiveMinutes = 5 * 60; // 5 minutes in seconds
    return (auth.tokenExpiry - now) <= fiveMinutes;
  }, [auth.tokenExpiry]);

  // Get time until token expires
  const getTimeUntilExpiry = useCallback(() => {
    if (!auth.tokenExpiry) return null;
    const now = Date.now() / 1000;
    const timeLeft = auth.tokenExpiry - now;
    return timeLeft > 0 ? timeLeft : 0;
  }, [auth.tokenExpiry]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    auth,
    
    // Actions
    login,
    register,
    logout: logoutUser,
    updateProfile: updateUserProfile,
    updateProfileImage: updateUserProfileImage,
    clearError: clearAuthError,
    setCredentials: setUserCredentials,
    refreshProfile,
    
    // Utility functions
    isTokenExpiring,
    getTimeUntilExpiry,
  };
};
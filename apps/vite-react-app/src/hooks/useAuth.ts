import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  loginAsync,
  logoutAsync,
  refreshTokenAsync,
  getProfileAsync,
  clearError,
  clearAuth,
  setTokens,
  updateUser,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken,
  selectRefreshToken,
} from '@/redux/features/auth/auth';
import { LoginRequest, RefreshTokenRequest } from '@/services/auth';
import { UserBase } from '@/services/users';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector(selectRefreshToken);

  // Actions
  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginAsync(credentials));
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutAsync());
    return result;
  }, [dispatch]);

  const refreshTokens = useCallback(
    async (refreshTokenData: RefreshTokenRequest) => {
      const result = await dispatch(refreshTokenAsync(refreshTokenData));
      return result;
    },
    [dispatch]
  );

  const getProfile = useCallback(async () => {
    const result = await dispatch(getProfileAsync());
    return result;
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearAuth = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  const handleSetTokens = useCallback(
    (tokens: {
      accessToken: string;
      refreshToken?: string;
      tokenType?: string;
      expiresIn?: number;
    }) => {
      dispatch(setTokens(tokens));
    },
    [dispatch]
  );

  const handleUpdateUser = useCallback(
    (userData: UserBase) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  return {
    // State
    auth,
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    refreshToken,
    
    // Actions
    login,
    logout,
    refreshTokens,
    getProfile,
    clearError: handleClearError,
    clearAuth: handleClearAuth,
    setTokens: handleSetTokens,
    updateUser: handleUpdateUser,
  };
};
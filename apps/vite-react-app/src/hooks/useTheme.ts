// src/hooks/useTheme.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectThemeMode,
  selectCurrentTheme,
  selectSystemPreference,
  selectIsLightTheme,
  selectIsDarkTheme,
  selectIsSystemMode,
  toggleTheme,
  initializeTheme,
  setupSystemThemeListener,
  changeTheme,
} from '@/redux/features/theme/theme';
import { ThemeMode } from '@/redux/features/theme/types';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const mode = useAppSelector(selectThemeMode);
  const currentTheme = useAppSelector(selectCurrentTheme);
  const systemPreference = useAppSelector(selectSystemPreference);
  const isLight = useAppSelector(selectIsLightTheme);
  const isDark = useAppSelector(selectIsDarkTheme);
  const isSystemMode = useAppSelector(selectIsSystemMode);

  // Actions
  const setMode = (newMode: ThemeMode) => {
    dispatch(changeTheme(newMode));
  };

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const setLight = () => setMode('light');
  const setDark = () => setMode('dark');
  const setSystem = () => setMode('system');

  // Initialize theme on mount
  useEffect(() => {
    dispatch(initializeTheme());
    dispatch(setupSystemThemeListener());
  }, [dispatch]);

  return {
    // Current state
    mode,
    currentTheme,
    systemPreference,
    isLight,
    isDark,
    isSystemMode,
    
    // Actions
    setMode,
    toggle,
    setLight,
    setDark,
    setSystem,
  };
};
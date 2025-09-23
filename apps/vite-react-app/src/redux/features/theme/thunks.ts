// src/redux/features/theme/thunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateSystemPreference, setThemeMode } from './slice';
import { ThemeMode } from './types';

// Async thunk untuk setup system theme listener
export const setupSystemThemeListener = createAsyncThunk(
  'theme/setupSystemThemeListener',
  async (_, { dispatch }) => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Initial check
      const isDark = mediaQuery.matches;
      dispatch(updateSystemPreference(isDark ? 'dark' : 'light'));
      
      // Setup listener
      const handleChange = (e: MediaQueryListEvent) => {
        dispatch(updateSystemPreference(e.matches ? 'dark' : 'light'));
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Return cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
    
    return null;
  }
);

// Async thunk untuk change theme dengan optional persistence
export const changeTheme = createAsyncThunk(
  'theme/changeTheme',
  async (mode: ThemeMode, { dispatch }) => {
    dispatch(setThemeMode(mode));
    
    // Optional: Save to localStorage for non-Redux persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', mode);
    }
    
    return mode;
  }
);

// Async thunk untuk load saved theme
export const loadSavedTheme = createAsyncThunk(
  'theme/loadSavedTheme',
  async (_, { dispatch }) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode') as ThemeMode;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        dispatch(setThemeMode(saved));
        return saved;
      }
    }
    return null;
  }
);
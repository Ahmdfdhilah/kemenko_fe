// src/redux/features/theme/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState, ThemeMode } from './types';
import { getSystemTheme, resolveCurrentTheme } from '@/utils/theme';

const initialState: ThemeState = {
  mode: 'system',
  systemPreference: getSystemTheme(),
  currentTheme: resolveCurrentTheme('system', getSystemTheme()),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.currentTheme = resolveCurrentTheme(action.payload, state.systemPreference);
      
      // Apply theme to document
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(state.currentTheme);
        
        // Update data attribute for Tailwind
        root.setAttribute('data-theme', state.currentTheme);
      }
    },
    
    updateSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
      
      // If current mode is system, update current theme
      if (state.mode === 'system') {
        state.currentTheme = action.payload;
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(state.currentTheme);
          root.setAttribute('data-theme', state.currentTheme);
        }
      }
    },
    
    initializeTheme: (state) => {
      // Initialize theme on app start
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(state.currentTheme);
        root.setAttribute('data-theme', state.currentTheme);
      }
    },
    
    toggleTheme: (state) => {
      // Toggle between light and dark (ignores system)
      if (state.mode === 'light' || (state.mode === 'system' && state.currentTheme === 'light')) {
        state.mode = 'dark';
      } else {
        state.mode = 'light';
      }
      
      state.currentTheme = resolveCurrentTheme(state.mode, state.systemPreference);
      
      // Apply theme to document
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(state.currentTheme);
        root.setAttribute('data-theme', state.currentTheme);
      }
    }
  }
});

export const { 
  setThemeMode, 
  updateSystemPreference, 
  initializeTheme, 
  toggleTheme 
} = themeSlice.actions;

export default themeSlice.reducer;
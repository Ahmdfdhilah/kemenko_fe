// src/redux/features/theme/types.ts
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  systemPreference: 'light' | 'dark';
  currentTheme: 'light' | 'dark';
}
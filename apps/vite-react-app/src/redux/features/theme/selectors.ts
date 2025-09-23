// src/redux/features/theme/selectors.ts
import { RootState } from '@/redux/store';

export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectSystemPreference = (state: RootState) => state.theme.systemPreference;
export const selectCurrentTheme = (state: RootState) => state.theme.currentTheme;
export const selectIsLightTheme = (state: RootState) => state.theme.currentTheme === 'light';
export const selectIsDarkTheme = (state: RootState) => state.theme.currentTheme === 'dark';
export const selectIsSystemMode = (state: RootState) => state.theme.mode === 'system';

// Selector untuk mendapatkan semua theme state sekaligus
export const selectThemeState = (state: RootState) => state.theme;
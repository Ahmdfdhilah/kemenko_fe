import { ThemeMode } from "@/redux/features/theme/types";

// Helper function to detect system theme preference
export const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

// Helper function to resolve current theme
export const resolveCurrentTheme = (mode: ThemeMode, systemPreference: 'light' | 'dark'): 'light' | 'dark' => {
    if (mode === 'system') {
        return systemPreference;
    }
    return mode;
};
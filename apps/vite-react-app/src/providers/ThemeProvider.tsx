// src/providers/ThemeProvider.tsx
import React, { useEffect, ReactNode } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { initializeTheme, setupSystemThemeListener } from '@/redux/features/theme/theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeTheme());
        dispatch(setupSystemThemeListener());
    }, [dispatch]);

    return <>{children}</>;
};
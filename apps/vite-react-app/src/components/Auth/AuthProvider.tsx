import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { isAuthenticated, accessToken, logout } = useAuth();
    const [warningShown, setWarningShown] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            setWarningShown(false);
            return;
        }

    }, [isAuthenticated, accessToken, logout, warningShown]);

    // Reset warning flag when user logs in again
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            setWarningShown(false);
        }
    }, [isAuthenticated, accessToken]);

    return <>{children}</>;
};
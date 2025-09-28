// src/components/Auth/AuthGuard.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, accessToken, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicPaths = ['/login', '/unauthorized'];
        const isPublicPath = publicPaths.includes(location.pathname);

        if (!isLoading && (!isAuthenticated || !accessToken)) {
            if (!isPublicPath) {
                navigate('/login', {
                    replace: true,
                    state: { from: location }
                });
            }
        }
    }, [isAuthenticated, accessToken, isLoading, navigate, location]);

    return <>{children}</>;
};
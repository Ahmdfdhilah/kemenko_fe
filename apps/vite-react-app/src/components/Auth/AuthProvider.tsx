// src/components/providers/AuthProvider.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@workspace/ui/components/sonner';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { isAuthenticated, token, getTimeUntilExpiry, logout } = useAuth();
    const [warningShown, setWarningShown] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setWarningShown(false);
            return;
        }

        // Set up interval to check token expiry every 30 seconds
        const interval = setInterval(() => {
            const timeLeft = getTimeUntilExpiry();

            if (timeLeft === null) return;

            // Show warning when 5 minutes left (only once)
            if (timeLeft <= 300 && timeLeft > 60 && !warningShown) {
                const minutesLeft = Math.floor(timeLeft / 60);
                toast.info('Sesi akan segera berakhir', {
                    description: `Sesi Anda akan berakhir dalam ${minutesLeft} menit. Simpan pekerjaan Anda.`,
                });
                setWarningShown(true);
            }

            // Show final warning when 1 minute left
            if (timeLeft <= 60 && timeLeft > 0) {
                toast.info('Sesi akan berakhir dalam 1 menit', {
                    description: 'Anda akan logout secara otomatis',
                });
            }

            // Auto-logout when expired
            if (timeLeft <= 0) {
                logout();
            }
        }, 60000); // Check every 60 seconds

        return () => clearInterval(interval);
    }, [isAuthenticated, token, getTimeUntilExpiry, logout, warningShown]);

    // Reset warning flag when user logs in again
    useEffect(() => {
        if (isAuthenticated && token) {
            setWarningShown(false);
        }
    }, [isAuthenticated, token]);

    return <>{children}</>;
};
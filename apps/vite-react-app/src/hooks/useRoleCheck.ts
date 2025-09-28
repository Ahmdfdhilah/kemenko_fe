// src/hooks/useRoleCheck.ts
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/services/users';
import { useMemo } from 'react';

export const useRoleCheck = () => {
    const { user, isAuthenticated } = useAuth();

    const hasRole = useMemo(() => {
        return (requiredRoles: UserRole | UserRole[]): boolean => {
            if (!isAuthenticated || !user) return false;

            const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            return roles.includes(user.role);
        };
    }, [isAuthenticated, user]);

    const isAdmin = useMemo(() => {
        return hasRole('admin');
    }, [hasRole]);

    const isUser = useMemo(() => {
        return hasRole('user');
    }, [hasRole]);

    const canAccess = useMemo(() => {
        return (requiredRoles: UserRole | UserRole[]): boolean => {
            return hasRole(requiredRoles);
        };
    }, [hasRole]);

    return {
        hasRole,
        isAdmin,
        isUser,
        canAccess,
        currentRole: user?.role || null,
    };
};
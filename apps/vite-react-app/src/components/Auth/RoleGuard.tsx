// src/components/Auth/RoleGuard.tsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/services/users';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
    hideIfNoAccess?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    allowedRoles,
    fallback = null,
    hideIfNoAccess = false,
}) => {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, don't show anything or show fallback
    if (!isAuthenticated || !user) {
        return hideIfNoAccess ? null : <>{fallback}</>;
    }

    // Check if user has required role
    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
        return hideIfNoAccess ? null : <>{fallback}</>;
    }

    return <>{children}</>;
};

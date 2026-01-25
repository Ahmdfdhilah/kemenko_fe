import { UserRole } from "@/services/users";
import {
    Activity,
    FolderCheck,
    Home,
    Settings,
    Users,
} from "lucide-react";


export interface SidebarItem {
    title: string;
    href?: string;
    icon: any;
    children?: SidebarItem[];
    isPlaceholder?: boolean;
    allowedRoles: UserRole[];
    badge?: string;
}


export const appMenuItems: SidebarItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
        allowedRoles: ['admin', 'user'],
    },
    {
        title: 'Folders',
        href: '/folders',
        icon: FolderCheck,
        allowedRoles: ['admin', 'user'],
    },

    // Management System - Admin only
    {
        title: 'Manajemen Sistem',
        icon: Settings,
        allowedRoles: ['admin'],
        children: [
            {
                title: 'Pengguna',
                href: '/management/users',
                icon: Users,
                allowedRoles: ['admin'],
            }
        ],
    },


];

// Helper function to get appropriate menu items based on user role
export const getMenuItemsForUser = (userRole?: UserRole): SidebarItem[] => {
    // Filter items based on user's single role
    const items = filterMenuByRole(appMenuItems, userRole!!);
    return [...items];
};

// Helper function to filter menu items based on user role
export const filterMenuByRole = (
    menuItems: SidebarItem[],
    userRole: UserRole
): SidebarItem[] => {
    return menuItems
        .filter(item => {
            // If allowedRoles is empty, allow access to all authenticated users
            if (item.allowedRoles.length === 0) {
                return true;
            }
            // Check if user's role is in the allowed roles for this menu item
            const hasAccess = item.allowedRoles.includes(userRole);
            return hasAccess;
        })
        .map(item => {
            // If item has children, filter them too
            if (item.children) {
                const filteredChildren = filterMenuByRole(item.children, userRole);
                return {
                    ...item,
                    children: filteredChildren,
                };
            }
            return item;
        })
        .filter(item => {
            // Remove parent items that have no visible children
            if (item.children) {
                return item.children.length > 0;
            }
            return true;
        });
};

// Helper function to filter menu items based on user roles (legacy)
export const filterMenuByRoles = (
    menuItems: SidebarItem[],
    userRoles: string[]
): SidebarItem[] => {
    return menuItems
        .filter(item => {
            // If allowedRoles is empty, allow access to all authenticated users
            if (item.allowedRoles.length === 0) {
                return true;
            }
            // Check if user has any of the allowed roles for this menu item
            const hasAccess = item.allowedRoles.some(role => userRoles.includes(role));
            return hasAccess;
        })
        .map(item => {
            // If item has children, filter them too
            if (item.children) {
                const filteredChildren = filterMenuByRoles(item.children, userRoles);
                return {
                    ...item,
                    children: filteredChildren,
                };
            }
            return item;
        })
        .filter(item => {
            // Remove parent items that have no accessible children
            if (item.isPlaceholder && item.children) {
                return item.children.length > 0;
            }
            return true;
        });
};

// Helper function to check if user has access to specific route
export const hasRouteAccess = (
    path: string,
    userRole: UserRole,
    menuItems: SidebarItem[] = appMenuItems
): boolean => {
    for (const item of menuItems) {
        // Check direct match
        if (item.href === path) {
            // If allowedRoles is empty, allow access to all authenticated users
            if (item.allowedRoles.length === 0) {
                return true;
            }
            return item.allowedRoles.includes(userRole);
        }

        // Check children
        if (item.children) {
            const childAccess = hasRouteAccess(path, userRole, item.children);
            if (childAccess !== null) return childAccess;
        }
    }
    return false;
};

// Default export for backward compatibility
export default appMenuItems;
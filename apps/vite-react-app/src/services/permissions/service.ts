// fe/apps/vite-react-app/src/services/permissions/service.ts
import { BaseService } from "../base";
import {
    PermissionGrant,
    PermissionListResponse,
} from "./types";

export class PermissionService extends BaseService {
    constructor() {
        super('/folders');
    }

    /**
     * Grant CRUD permission to user for a folder (Admin only)
     * Allows user to create, update, delete folders/files in this folder and its descendants
     */
    async permissionGrant(folderId: string, data: PermissionGrant): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/${folderId}/permissions`, data);
    }

    /**
     * List all users with CRUD access to a folder (Admin only)
     */
    async permissionList(folderId: string): Promise<PermissionListResponse> {
        return this.get<PermissionListResponse>(`/${folderId}/permissions`);
    }

    /**
     * Revoke user's CRUD permission from folder (Admin only)
     */
    async permissionRevoke(folderId: string, userId: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${folderId}/permissions/${userId}`);
    }

    /**
     * Get current user's permissions
     * Returns list of folders where current user has CRUD access
     */
    async permissionGetMine(): Promise<PermissionListResponse> {
        // This endpoint is under /auth, not /folders
        return this.get<PermissionListResponse>(`/../auth/me/permissions`);
    }
}

export const permissionService = new PermissionService();

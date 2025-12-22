// fe/apps/vite-react-app/src/services/folders/service.ts
import { BaseService } from "../base";
import {
    FolderWithChildren,
    FolderCreate,
    FolderUpdate,
    FolderMove,
    FolderPaginatedParams,
    FolderResponsePaginated,
} from "./types";

export class FolderService extends BaseService {
    constructor() {
        super('/folders')
    }

    /**
     * Get all folders with optional filtering
     * Supports pagination, search, sorting, and parent_id filter
     */
    async folderGetAll(params: FolderPaginatedParams): Promise<FolderResponsePaginated> {
        return this.get<FolderResponsePaginated>(`${this.buildQuery(params)}`);
    }

    /**
     * Get root folders only (folders with no parent)
     */
    async folderGetRoot(params: Omit<FolderPaginatedParams, 'parent_id'>): Promise<FolderResponsePaginated> {
        return this.get<FolderResponsePaginated>(`/root${this.buildQuery(params)}`);
    }

    /**
     * Get folder by ID with children folders and files
     */
    async folderGetById(id: string): Promise<FolderWithChildren> {
        return this.get<FolderWithChildren>(`/${id}`);
    }

    /**
     * Get child folders of a parent folder
     */
    async folderGetChildren(id: string, params: { page: number; limit: number }): Promise<FolderResponsePaginated> {
        return this.get<FolderResponsePaginated>(`/${id}/children${this.buildQuery(params)}`);
    }

    /**
     * Create new folder (root or nested)
     * If parent_id is null/undefined, creates a root folder
     * Admin or user with permissions
     * 
     * NOTE: Backend expects multipart/form-data, not JSON
     */
    async folderCreate(data: FolderCreate): Promise<{ message: string }> {
        // Always use FormData since backend expects multipart/form-data
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) {
            formData.append('description', data.description);
        }
        if (data.parent_id) {
            formData.append('parent_id', data.parent_id);
        }
        if (data.image) {
            formData.append('image', data.image);
        }

        return this.post<{ message: string }>('', formData);
    }

    /**
     * Update folder
     * Can also move folder by changing parent_id
     * Admin or user with permissions
     * 
     * NOTE: Backend expects multipart/form-data, not JSON
     */
    async folderUpdate(data: FolderUpdate & { delete_image?: boolean }, id: string): Promise<{ message: string }> {
        // Always use FormData since backend expects multipart/form-data
        const formData = new FormData();

        if (data.title !== undefined) {
            formData.append('title', data.title);
        }
        if (data.description !== undefined) {
            formData.append('description', data.description);
        }
        if (data.parent_id !== undefined) {
            formData.append('parent_id', data.parent_id || '');
        }
        if (data.image) {
            formData.append('image', data.image);
        }
        if (data.delete_image) {
            formData.append('delete_image', 'true');
        }

        return this.put<{ message: string }>(`/${id}`, formData);
    }

    /**
     * Move folder to another parent
     * Set new_parent_id to null to move to root
     * Admin or user with permissions
     */
    async folderMove(data: FolderMove, id: string): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/${id}/move`, data);
    }

    /**
     * Delete folder (cascade delete: deletes all children and files)
     * Admin or user with permissions
     */
    async folderDelete(id: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${id}`);
    }
}

export const folderService = new FolderService();
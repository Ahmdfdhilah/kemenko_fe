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
     * Admin only
     */
    async folderCreate(data: FolderCreate): Promise<{ message: string }> {
        return this.post<{ message: string }>('', data);
    }

    /**
     * Update folder
     * Can also move folder by changing parent_id
     * Admin only
     */
    async folderUpdate(data: FolderUpdate, id: string): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/${id}`, data);
    }

    /**
     * Move folder to another parent
     * Set new_parent_id to null to move to root
     * Admin only
     */
    async folderMove(data: FolderMove, id: string): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/${id}/move`, data);
    }

    /**
     * Delete folder (cascade delete: deletes all children and files)
     * Admin only
     */
    async folderDelete(id: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${id}`);
    }
}

export const folderService = new FolderService();
// fe/apps/vite-react-app/src/services/files/service.ts
import { BaseService } from "../base";
import {
    FileBase,
    FileResponsePaginated,
    FileCreateLink,
    FileUpdateLink,
    FileUpload,
    FileUpdateUpload,
    FileMove,
    FileQueryParams,
} from "./types";

export class FileService extends BaseService {
    constructor() {
        super('/folders');
    }

    /**
     * Get files in a specific folder
     * Supports pagination, search, sorting, and file_type filter
     */
    async fileGetInFolder(folderId: string, params: FileQueryParams): Promise<FileResponsePaginated> {
        return this.get<FileResponsePaginated>(`/${folderId}/files${this.buildQuery(params)}`);
    }

    /**
     * Get file by ID
     */
    async fileGetById(fileId: string): Promise<FileBase> {
        // Note: single file endpoint is /files/:id, not under /folders
        return this.get<FileBase>(`/../files/${fileId}`);
    }

    /**
     * Create file as external link
     * Admin only
     */
    async fileCreateLink(folderId: string, data: FileCreateLink): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/${folderId}/files/link`, data);
    }

    /**
     * Upload physical file
     * Admin only
     */
    async fileUpload(folderId: string, data: FileUpload): Promise<{ message: string }> {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('file', data.file);

        if (data.description) {
            formData.append('description', data.description);
        }

        return this.post<{ message: string }>(`/${folderId}/files/upload`, formData);
    }

    /**
     * Update file metadata (for link type files)
     * Admin only
     */
    async fileUpdateLink(data: FileUpdateLink, fileId: string): Promise<{ message: string }> {
        // Note: file update endpoint is /files/:id, not under /folders
        return this.put<{ message: string }>(`/../files/${fileId}`, data);
    }

    /**
     * Update file or replace upload (for upload type files)
     * Admin only
     */
    async fileUpdateUpload(data: FileUpdateUpload, fileId: string): Promise<{ message: string }> {
        const formData = new FormData();

        if (data.name !== undefined) {
            formData.append('name', data.name);
        }

        if (data.description !== undefined) {
            formData.append('description', data.description);
        }

        if (data.file) {
            formData.append('file', data.file);
        }

        // Note: file update endpoint is /files/:id, not under /folders
        return this.put<{ message: string }>(`/../files/${fileId}`, formData);
    }

    /**
     * Move file to another folder
     * Admin only
     */
    async fileMove(data: FileMove, fileId: string): Promise<{ message: string }> {
        // Note: file move endpoint is /files/:id/move, not under /folders
        return this.put<{ message: string }>(`/../files/${fileId}/move`, data);
    }

    /**
     * Delete file (deletes physical file if upload type)
     * Admin only
     */
    async fileDelete(fileId: string): Promise<{ message: string }> {
        // Note: file delete endpoint is /files/:id, not under /folders
        return this.delete<{ message: string }>(`/../files/${fileId}`);
    }
}

export const fileService = new FileService();

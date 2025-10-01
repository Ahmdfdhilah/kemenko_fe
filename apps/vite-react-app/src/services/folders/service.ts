// fe/apps/vite-react-app/src/services/folders/service.ts
import { BaseService } from "../base";
import {
    FolderBase,
    FolderCreate,
    FolderUpdate,
    FolderPaginatedParams,
    FolderResponsePaginated,
} from "./types";

export class FolderService extends BaseService {
    constructor() {
        super('/folders')
    }

    async folderCreate(data: FolderCreate): Promise<{ message: string }> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('link', data.link);

        if (data.description) {
            formData.append('description', data.description);
        }

        if (data.image) {
            formData.append('image', data.image);
        }

        return this.post<{ message: string }>('', formData);
    }

    async folderUpdate(data: FolderUpdate, id: string): Promise<{ message: string }> {
        const formData = new FormData();

        if (data.title !== undefined) {
            formData.append('title', data.title);
        }

        if (data.description !== undefined) {
            formData.append('description', data.description);
        }

        if (data.link !== undefined) {
            formData.append('link', data.link);
        }

        if (data.remove_image !== undefined) {
            formData.append('remove_image', data.remove_image.toString());
        }

        if (data.image) {
            formData.append('image', data.image);
        }

        return this.put<{ message: string }>(`/${id}`, formData);
    }

    async folderDelete(id: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${id}`)
    }

    async folderGetAll(params: FolderPaginatedParams): Promise<FolderResponsePaginated> {
        return this.get<FolderResponsePaginated>(`${this.buildQuery(params)}`)
    }


    async folderGetById(id: string): Promise<FolderBase> {
        return this.get<FolderBase>(`/${id}`)
    }

    // Helper method to get folder image URL
    getFolderImageUrl(imagePath: string, baseUrl?: string): string {
        const base = baseUrl || window.location.origin;
        return imagePath ? `${base}${imagePath}` : '';
    }

    // Helper method to format folder title for display
    getShortTitle(title: string, maxLength: number = 50): string {
        return title.length <= maxLength ? title : `${title.slice(0, maxLength)}...`;
    }

    // Helper method to format folder description for display
    getShortDescription(description: string, maxLength: number = 100): string {
        return description.length <= maxLength ? description : `${description.slice(0, maxLength)}...`;
    }

    // Helper method to validate image file
    validateImageFile(file: File): { isValid: boolean; error?: string } {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (file.size > maxSize) {
            return { isValid: false, error: 'Image file size exceeds 5MB' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: 'Invalid image file type. Allowed: JPEG, PNG, GIF, WebP' };
        }

        return { isValid: true };
    }
}

export const folderService = new FolderService()
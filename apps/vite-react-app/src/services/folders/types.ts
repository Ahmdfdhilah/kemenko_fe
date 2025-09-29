// fe/apps/vite-react-app/src/services/folders/types.ts
import { Base, PaginatedResponse, Sort } from "@/services/base";

// BASE
export interface FolderBase extends Base {
    title: string;
    description: string;
    image_path: string;
    image_url: string;
    link: string;
    has_image: boolean;
}

// RESPONSE
export interface FolderResponsePaginated extends PaginatedResponse<FolderBase> { }


// REQUEST
export interface FolderCreate {
    title: string;
    description?: string;
    link: string;
    image?: File;
}

export interface FolderUpdate {
    title?: string;
    description?: string;
    link?: string;
    image?: File;
    remove_image?: boolean;
}

// QUERY PARAMETERS
export interface FolderPaginatedParams {
    page: number;
    limit: number;
    search?: string | null;
    sort_by?: 'title' | 'created_at' | 'updated_at' | null;
    sort_type?: Sort | null;
}
// fe/apps/vite-react-app/src/services/folders/types.ts
import { Base, PaginatedResponse, Sort } from "@/services/base";
import { UserSummary } from "@/services/permissions/types";

// FOLDER SUMMARY (for relations)
export interface FolderSummary {
    id: string;
    title: string;
}

// BASE FOLDER
export interface FolderBase extends Base {
    title: string;
    description: string;
    image_path?: string | null;
    image_url?: string | null;
    parent_id?: string | null;
    is_root: boolean;
    has_children: boolean;
    files_count: number;
    created_by?: UserSummary;
    updated_by?: UserSummary;
    can_crud: boolean;  // Permission indicator - true if user can CRUD this folder
}

// FOLDER WITH CHILDREN (for hierarchy display)
export interface FolderWithChildren extends FolderBase {
    path?: string;
    children?: FolderBase[];
    files?: Array<{
        id: string;
        name: string;
        file_type: 'link' | 'upload';
        file_url?: string;
        file_size?: number;
        mime_type?: string;
        updated_at?: string | null;
    }>;
}

// RESPONSE
export interface FolderResponsePaginated extends PaginatedResponse<FolderBase> { }

// REQUEST
export interface FolderCreate {
    title: string;
    description?: string;
    parent_id?: string | null;  // null or undefined = root folder
    image?: File;  // Optional image upload
}

export interface FolderUpdate {
    title?: string;
    description?: string;
    parent_id?: string | null;  // can move folder by changing parent
    image?: File;  // Optional: replace or add image
}

export interface FolderMove {
    new_parent_id: string | null;  // null = move to root
}

// QUERY PARAMETERS
export interface FolderPaginatedParams {
    page: number;
    limit: number;
    search?: string | null;
    sort_by?: 'title' | 'created_at' | 'updated_at' | null;
    sort_type?: Sort | null;
    parent_id?: string | null;  // filter by parent folder
}
// fe/apps/vite-react-app/src/services/folders/types.ts
import { Base, PaginatedResponse, Sort } from "@/services/base";

// BASE FOLDER
export interface FolderBase extends Base {
    title: string;
    description: string;
    parent_id: string | null;
    depth: number;
    path: string;
}

// FOLDER WITH CHILDREN (for hierarchy display)
export interface FolderWithChildren extends FolderBase {
    children?: FolderBase[];
    files?: Array<{
        id: string;
        name: string;
        file_type: 'link' | 'upload';
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
}

export interface FolderUpdate {
    title?: string;
    description?: string;
    parent_id?: string | null;  // can move folder by changing parent
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
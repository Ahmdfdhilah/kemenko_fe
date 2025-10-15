// fe/apps/vite-react-app/src/services/files/types.ts
import { Base, PaginatedResponse, Sort } from "@/services/base";

// FILE TYPE
export type FileType = 'link' | 'upload';

// BASE FILE
export interface FileBase extends Base {
    name: string;
    description: string;
    file_type: FileType;
    folder_id: string;

    // For link type
    external_link?: string;

    // For upload type
    file_path?: string;
    file_url?: string;
    file_size?: number;
    mime_type?: string;
}

// RESPONSE
export interface FileResponsePaginated extends PaginatedResponse<FileBase> { }

// REQUEST - Create Link
export interface FileCreateLink {
    name: string;
    description?: string;
    external_link: string;
}

// REQUEST - Update Link
export interface FileUpdateLink {
    name?: string;
    description?: string;
    external_link?: string;
}

// REQUEST - Upload File
export interface FileUpload {
    name: string;
    description?: string;
    file: File;
}

// REQUEST - Update Upload
export interface FileUpdateUpload {
    name?: string;
    description?: string;
    file?: File;  // Optional: if provided, replaces existing file
}

// REQUEST - Move File
export interface FileMove {
    new_folder_id: string;
}

// QUERY PARAMETERS
export interface FileQueryParams {
    page: number;
    limit: number;
    search?: string | null;
    sort_by?: 'name' | 'file_type' | 'file_size' | 'created_at' | 'updated_at' | null;
    sort_type?: Sort | null;
    file_type?: FileType | null;  // filter by file type
}

// fe/apps/vite-react-app/src/services/permissions/types.ts
import { UserSummary } from "@/services/base";
import { FolderSummary } from "@/services/folders/types";


// Re-export UserSummary for convenience
export type { UserSummary };

// PERMISSION BASE
export interface PermissionBase {
    id: string;
    folder_id: string;
    user_id: string;
    created_at: string;
    created_by?: string;
    user?: UserSummary;
    folder?: FolderSummary;
}

// REQUEST
export interface PermissionGrant {
    user_id: string;
}

export interface PermissionRevoke {
    user_id: string;
}

// RESPONSE
export interface PermissionListResponse {
    message: string;
    data: PermissionBase[];
}

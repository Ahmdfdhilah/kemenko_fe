// fe/apps/vite-react-app/src/services/activities/types.ts
import { Base, PaginatedResponse, Sort } from "@/services/base";

export type ActivityResourceType = 'folder' | 'file';
export type ActivityActionType = 'created' | 'updated' | 'deleted' | 'moved';

export interface Activity extends Base {
    resource_id: string;
    resource_type: ActivityResourceType;
    resource_name: string;
    action_type: ActivityActionType;
    description: string;
    performed_by: string;
    performed_by_name: string;
}

export interface ActivityPaginatedParams {
    page?: number;
    limit?: number;
    search?: string;
    resource_type?: ActivityResourceType;
    resource_id?: string;
    action_type?: ActivityActionType;
    performed_by?: string;
    sort_by?: string;
    sort_type?: Sort;
}

export type ActivityResponsePaginated = PaginatedResponse<Activity>;

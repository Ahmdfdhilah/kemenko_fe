// fe/apps/vite-react-app/src/services/activities/service.ts
import { BaseService } from "@/services/base";
import { ActivityPaginatedParams, ActivityResponsePaginated } from "./types";

export class ActivityService extends BaseService {
    constructor() {
        super("");
    }

    /**
     * Get all activities with optional filters
     */
    async getAllActivities(params?: ActivityPaginatedParams): Promise<ActivityResponsePaginated> {
        const query = params ? this.buildQuery(params as any) : "";
        return this.get<ActivityResponsePaginated>(`/activities${query}`);
    }

    /**
     * Get activities for a specific folder
     */
    async getFolderActivities(folderId: string, page = 1, limit = 20): Promise<ActivityResponsePaginated> {
        const query = this.buildQuery({ page, limit });
        return this.get<ActivityResponsePaginated>(`/folders/${folderId}/activities${query}`);
    }

    /**
     * Get activities for a specific file
     */
    async getFileActivities(fileId: string, page = 1, limit = 20): Promise<ActivityResponsePaginated> {
        const query = this.buildQuery({ page, limit });
        return this.get<ActivityResponsePaginated>(`/files/${fileId}/activities${query}`);
    }
}

export const activityService = new ActivityService();

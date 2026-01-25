// hooks/useActivities.ts
import { useQuery } from '@tanstack/react-query'
import { activityService } from '@/services/activities'
import { ActivityPaginatedParams } from '@/services/activities/types'

export const useActivities = (params?: ActivityPaginatedParams) => {
    return useQuery({
        queryKey: ['activities', params],
        queryFn: () => activityService.getAllActivities(params),
    })
}

export const useFolderActivities = (folderId: string, page = 1, limit = 20, enabled = true) => {
    return useQuery({
        queryKey: ['folder-activities', folderId, page, limit],
        queryFn: () => activityService.getFolderActivities(folderId, page, limit),
        enabled: !!folderId && enabled,
    })
}

export const useFileActivities = (fileId: string, page = 1, limit = 20, enabled = true) => {
    return useQuery({
        queryKey: ['file-activities', fileId, page, limit],
        queryFn: () => activityService.getFileActivities(fileId, page, limit),
        enabled: !!fileId && enabled,
    })
}

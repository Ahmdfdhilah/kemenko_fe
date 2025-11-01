// hooks/useFolderPermissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PermissionGrant } from '@/services/permissions/types'
import { toast } from "@workspace/ui/components/sonner"
import { permissionService } from '@/services/permissions/service'

/**
 * Get all users with CRUD access to a specific folder
 */
export const useFolderPermissions = (folderId: string, enabled = true) => {
    return useQuery({
        queryKey: ['folderPermissions', folderId],
        queryFn: () => permissionService.permissionList(folderId),
        enabled: !!folderId && enabled,
    })
}

/**
 * Get current user's permissions (folders where they have CRUD access)
 */
export const useMyPermissions = () => {
    return useQuery({
        queryKey: ['myPermissions'],
        queryFn: () => permissionService.permissionGetMine(),
    })
}

/**
 * Grant CRUD permission to user for a folder
 */
export const useGrantPermission = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ folderId, data }: { folderId: string; data: PermissionGrant }) =>
            permissionService.permissionGrant(folderId, data),
        onSuccess: (response, variables) => {
            toast.success('Success', {
                description: response.message || 'Hak akses berhasil diberikan'
            })
            // Invalidate folder permissions for the specific folder
            queryClient.invalidateQueries({ queryKey: ['folderPermissions', variables.folderId] })
            queryClient.invalidateQueries({ queryKey: ['myPermissions'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal memberikan hak akses'
            })
        }
    })
}

/**
 * Revoke user's CRUD permission from folder
 */
export const useRevokePermission = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ folderId, userId }: { folderId: string; userId: string }) =>
            permissionService.permissionRevoke(folderId, userId),
        onSuccess: (response, variables) => {
            toast.success('Success', {
                description: response.message || 'Hak akses berhasil dicabut'
            })
            // Invalidate folder permissions for the specific folder
            queryClient.invalidateQueries({ queryKey: ['folderPermissions', variables.folderId] })
            queryClient.invalidateQueries({ queryKey: ['myPermissions'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal mencabut hak akses'
            })
        }
    })
}

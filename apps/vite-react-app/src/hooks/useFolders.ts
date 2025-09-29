// hooks/useFolders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { folderService } from '@/services/folders'
import { FolderCreate, FolderUpdate, FolderPaginatedParams } from '@/services/folders/types'
import { toast } from "@workspace/ui/components/sonner"

export const useFolders = (params: FolderPaginatedParams) => {
    return useQuery({
        queryKey: ['folders', params],
        queryFn: () => folderService.folderGetAll(params),
    })
}

export const useFolder = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['folder', id],
        queryFn: () => folderService.folderGetById(id),
        enabled: !!id && enabled,
    })
}

export const useCreateFolder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: FolderCreate) => folderService.folderCreate(data),
        onSuccess: (message) => {
            toast.success('Success', {
                description: message || 'Folder berhasil dibuat'
            })
            queryClient.invalidateQueries({ queryKey: ['folders'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal membuat folder'
            })
        }
    })
}

export const useUpdateFolder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, id }: { data: FolderUpdate; id: string }) =>
            folderService.folderUpdate(data, id),
        onSuccess: (message) => {
            toast.success('Success', {
                description: message || 'Folder berhasil diperbarui'
            })
            queryClient.invalidateQueries({ queryKey: ['folders'] })
            queryClient.invalidateQueries({ queryKey: ['folder'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal memperbarui folder'
            })
        }
    })
}

export const useDeleteFolder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => folderService.folderDelete(id),
        onSuccess: (message) => {
            toast.success('Success', {
                description: message || 'Folder berhasil dihapus'
            })
            queryClient.invalidateQueries({ queryKey: ['folders'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal menghapus folder'
            })
        }
    })
}
// hooks/useFiles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fileService } from '@/services/files'
import { FileCreateLink, FileUpdateLink, FileUpload, FileUpdateUpload, FileQueryParams } from '@/services/files/types'
import { toast } from "@workspace/ui/components/sonner"

export const useFiles = (folderId: string, params: FileQueryParams) => {
    return useQuery({
        queryKey: ['files', folderId, params],
        queryFn: () => fileService.fileGetInFolder(folderId, params),
        enabled: !!folderId,
    })
}

export const useFile = (fileId: string, enabled = true) => {
    return useQuery({
        queryKey: ['file', fileId],
        queryFn: () => fileService.fileGetById(fileId),
        enabled: !!fileId && enabled,
    })
}

export const useCreateFileLink = (folderId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: FileCreateLink) => fileService.fileCreateLink(folderId, data),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'Link berhasil dibuat'
            })
            queryClient.invalidateQueries({ queryKey: ['files', folderId] })
            queryClient.invalidateQueries({ queryKey: ['folder', folderId] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal membuat link'
            })
        }
    })
}

export const useUploadFile = (folderId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: FileUpload) => fileService.fileUpload(folderId, data),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'File berhasil diupload'
            })
            queryClient.invalidateQueries({ queryKey: ['files', folderId] })
            queryClient.invalidateQueries({ queryKey: ['folder', folderId] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal mengupload file'
            })
        }
    })
}

export const useUpdateFileLink = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, fileId }: { data: FileUpdateLink; fileId: string }) =>
            fileService.fileUpdateLink(data, fileId),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'Link berhasil diperbarui'
            })
            queryClient.invalidateQueries({ queryKey: ['files'] })
            queryClient.invalidateQueries({ queryKey: ['file'] })
            queryClient.invalidateQueries({ queryKey: ['folder'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal memperbarui link'
            })
        }
    })
}

export const useUpdateFileUpload = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, fileId }: { data: FileUpdateUpload; fileId: string }) =>
            fileService.fileUpdateUpload(data, fileId),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'File berhasil diperbarui'
            })
            queryClient.invalidateQueries({ queryKey: ['files'] })
            queryClient.invalidateQueries({ queryKey: ['file'] })
            queryClient.invalidateQueries({ queryKey: ['folder'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal memperbarui file'
            })
        }
    })
}

export const useDeleteFile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (fileId: string) => fileService.fileDelete(fileId),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'File berhasil dihapus'
            })
            queryClient.invalidateQueries({ queryKey: ['files'] })
            queryClient.invalidateQueries({ queryKey: ['folder'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal menghapus file'
            })
        }
    })
}

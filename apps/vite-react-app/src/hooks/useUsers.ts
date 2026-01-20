// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserCreate, UserUpdate, UserPaginatedParams } from '@/services/users/types'
import { toast } from "@workspace/ui/components/sonner"
import { userService } from '@/services/users/service'

export const useUsers = (params: UserPaginatedParams, enabled = true) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => userService.userGetAll(params),
        enabled,
    })
}

export const useUser = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.userGetById(id),
        enabled: !!id && enabled,
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UserCreate) => userService.userCreate(data),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'User berhasil dibuat'
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal membuat user'
            })
        }
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, id }: { data: UserUpdate; id: string }) =>
            userService.userUpdate(data, id),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'User berhasil diperbarui'
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal memperbarui user'
            })
        }
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => userService.userDelete(id),
        onSuccess: (response) => {
            toast.success('Success', {
                description: response.message || 'User berhasil dihapus'
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: Error) => {
            toast.error('Error', {
                description: error.message || 'Gagal menghapus user'
            })
        }
    })
}
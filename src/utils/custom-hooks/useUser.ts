import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    apiGetUserList,
    apiGetUserDetail,
    apiSoftDeleteUser,
    apiReactivateUser,
} from '@/services/UserService'

export const useUserListQuery = (params: any) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => apiGetUserList(params),
    })
}

export const useUserDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => apiGetUserDetail(id),
        enabled: !!id,
    })
}

export const useSoftDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => apiSoftDeleteUser(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })
}

export const useReactivateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => apiReactivateUser(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        },
    })
}

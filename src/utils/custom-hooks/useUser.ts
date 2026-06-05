import { useQuery } from '@tanstack/react-query'
import { apiGetUserList, apiGetUserDetail } from '@/services/UserService'

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

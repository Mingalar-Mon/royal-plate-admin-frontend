import { useQuery } from '@tanstack/react-query'
import { apiGetOwnerList, apiGetOwnerDetail } from '@/services/OwnerService'

export const useOwnerListQuery = (params: any) => {
    return useQuery({
        queryKey: ['owners', params],
        queryFn: () => apiGetOwnerList(params),
    })
}

export const useOwnerDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['owner', id],
        queryFn: () => apiGetOwnerDetail(id),
        enabled: !!id,
    })
}

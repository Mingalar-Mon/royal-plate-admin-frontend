import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    apiGetBannerList,
    apiGetBannerDetail,
    apiCreateBanner,
    apiUpdateBanner,
    apiDeleteBanner,
} from '@/services/BannerService'

export const useBannerListQuery = (params: any) => {
    return useQuery({
        queryKey: ['banners', params],
        queryFn: () => apiGetBannerList(params),
    })
}

export const useBannerDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['banner', id],
        queryFn: () => apiGetBannerDetail(id),
        enabled: !!id,
    })
}

export const useCreateBannerMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] })
        },
    })
}

export const useUpdateBannerMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            apiUpdateBanner(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['banners'] })
            queryClient.invalidateQueries({
                queryKey: ['banner', variables.id],
            })
        },
    })
}

export const useDeleteBannerMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] })
        },
    })
}

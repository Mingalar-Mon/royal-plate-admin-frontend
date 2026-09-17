import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    apiGetOwnerList,
    apiGetOwnerDetail,
    UpdateOwnerPayload,
    apiUpdateOwnerDetail,
    CreateOwnerPayload,
    apiCreateOwner,
    apiSoftDeleteOwner,
    apiReactivateOwner,
} from '@/services/OwnerService'

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

export const useUpdateOwner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: UpdateOwnerPayload) =>
            apiUpdateOwnerDetail(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['owners'] })
            queryClient.invalidateQueries({ queryKey: ['owner', variables.id] })
        },
    })
}

export const useCreateOwner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateOwnerPayload) => apiCreateOwner(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['owners'] })
        },
    })
}

export const useSoftDeleteOwner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ownerId: string) => apiSoftDeleteOwner(ownerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['owners'] })
        },
    })
}

export const useReactivateOwner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ownerId: string) => apiReactivateOwner(ownerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['owners'] })
        },
    })
}

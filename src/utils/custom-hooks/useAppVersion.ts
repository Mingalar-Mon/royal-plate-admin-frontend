import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    apiGetAppVersions,
    apiGetAppVersionDetail,
    apiCreateAppVersion,
    apiUpdateAppVersion,
    apiDeleteAppVersion,
} from '@/services/AppVersionService'

export const useGetAppVersions = () => {
    return useQuery({
        queryKey: ['app-versions'],
        queryFn: apiGetAppVersions,
    })
}

export const useAppVersionDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['app-version', id],
        queryFn: () => apiGetAppVersionDetail(id),
        enabled: !!id,
    })
}

export const useCreateAppVersionMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateAppVersion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app-versions'] })
        },
    })
}

export const useUpdateAppVersionMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            apiUpdateAppVersion(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['app-versions'] })
            queryClient.invalidateQueries({
                queryKey: ['app-version', variables.id],
            })
        },
    })
}

export const useDeleteAppVersionMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteAppVersion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app-versions'] })
        },
    })
}

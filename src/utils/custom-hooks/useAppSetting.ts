import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    apiGetAppSettings,
    apiGetAppSettingDetail,
    apiCreateAppSetting,
    apiUpdateAppSetting,
    apiUpdateAppSettingStatus,
    apiDeleteAppSetting,
} from '@/services/AppSettingService'
import type { AppSettingUpdateData } from '@/@types/appSetting'

export const useGetAppSettings = () => {
    return useQuery({
        queryKey: ['app-settings'],
        queryFn: apiGetAppSettings,
    })
}

export const useAppSettingDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['app-setting', id],
        queryFn: () => apiGetAppSettingDetail(id),
        enabled: !!id,
    })
}

export const useCreateAppSettingMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateAppSetting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app-settings'] })
        },
    })
}

export const useUpdateAppSettingMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: AppSettingUpdateData
        }) => apiUpdateAppSetting(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['app-settings'] })
            queryClient.invalidateQueries({
                queryKey: ['app-setting', variables.id],
            })
        },
    })
}

export const useUpdateAppSettingStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateAppSettingStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['app-settings'] })
            queryClient.invalidateQueries({
                queryKey: ['app-setting', variables.id],
            })
        },
    })
}

export const useDeleteAppSettingMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteAppSetting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['app-settings'] })
        },
    })
}

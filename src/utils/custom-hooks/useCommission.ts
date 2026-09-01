import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    apiCreateCommission,
    apiGetCommissions,
    apiUpdateCommissionPercentage,
    apiUpdateCommissionStatus,
} from '@/services/CommissionService'
import type { CommissionQuery } from '@/@types/commission'

export const useGetCommissions = (params: CommissionQuery) =>
    useQuery({
        queryKey: ['commissions', params],
        queryFn: () => apiGetCommissions(params),
    })

export const useCreateCommissionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiCreateCommission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commissions'] })
        },
    })
}

export const useUpdateCommissionStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiUpdateCommissionStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commissions'] })
        },
    })
}

export const useUpdateCommissionPercentage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiUpdateCommissionPercentage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commissions'] })
        },
    })
}

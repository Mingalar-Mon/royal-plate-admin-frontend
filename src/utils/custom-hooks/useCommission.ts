import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    apiCreateCommission,
    apiGetAllActiveCommissions,
    apiGetCommissions,
    apiUpdateCommissionStatus,
} from '@/services/CommissionService'
import type { CommissionQuery } from '@/@types/commission'

const commissionQueryKey = 'commissions'

export const useGetCommissions = (params: CommissionQuery) =>
    useQuery({
        queryKey: [commissionQueryKey, 'list', params],
        queryFn: () => apiGetCommissions(params),
    })

/**
 * Distinct restaurant ids that currently have an active batch, used to spot
 * restaurants trading at 0% commission.
 */
export const useActiveCommissionRestaurantIds = () =>
    useQuery({
        queryKey: [commissionQueryKey, 'active-restaurant-ids'],
        queryFn: async () => {
            const batches = await apiGetAllActiveCommissions()
            return Array.from(
                new Set(
                    batches
                        .map((batch) => batch.restaurant?.id)
                        .filter((id): id is string => Boolean(id)),
                ),
            )
        },
    })

export const useCreateCommissionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiCreateCommission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [commissionQueryKey] })
        },
    })
}

export const useUpdateCommissionStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiUpdateCommissionStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [commissionQueryKey] })
        },
    })
}

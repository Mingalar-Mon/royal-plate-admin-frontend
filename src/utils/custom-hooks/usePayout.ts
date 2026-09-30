import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    apiGetPayoutPreview,
    apiGetPayouts,
    apiPostPayout,
} from '@/services/TransactionService'
import type { PayoutQueries } from '@/@types/payout'
import type { PayoutPreviewParams } from '@/services/TransactionService'

const payoutQueryKey = 'payouts'

export const useGetPayouts = (params: PayoutQueries) =>
    useQuery({
        queryKey: [payoutQueryKey, 'list', params],
        queryFn: () =>
            apiGetPayouts({
                page: params.page,
                limit: params.limit,
                ...(params.restaurantId
                    ? { restaurantId: params.restaurantId }
                    : {}),
            }),
    })

/**
 * All three params are required, so the request only fires once the form is
 * actually complete.
 */
export const useGetPayoutPreview = (params: PayoutPreviewParams) =>
    useQuery({
        queryKey: [payoutQueryKey, 'preview', params],
        queryFn: () => apiGetPayoutPreview(params),
        enabled: Boolean(
            params.restaurantId && params.fromDate && params.toDate,
        ),
    })

export const useCreatePayout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiPostPayout,
        onSuccess: () => {
            // The new batch has to show up in the history list immediately.
            queryClient.invalidateQueries({ queryKey: [payoutQueryKey] })
        },
    })
}

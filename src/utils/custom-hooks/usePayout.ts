import { useQuery } from '@tanstack/react-query'
import { apiGetPayouts } from '@/services/TransactionService'
import type { PayoutQueries } from '@/@types/payout'

export const useGetPayouts = (params: PayoutQueries) =>
    useQuery({
        queryKey: ['payouts', params],
        queryFn: () =>
            apiGetPayouts({
                page: params.page,
                limit: params.limit,
                ...(params.restaurantId
                    ? { restaurantId: params.restaurantId }
                    : {}),
            }),
    })
import { useQuery } from '@tanstack/react-query'
import { apiGetTransactions } from '@/services/TransactionService'
import type { TransactionQueries } from '@/@types/transaction'

export const useGetTransactions = (
    restaurantId: string,
    params: TransactionQueries,
) =>
    useQuery({
        queryKey: ['transactions', restaurantId, params],
        queryFn: () => {
            return apiGetTransactions({
                restaurantId,
                page: params.page,
                limit: params.limit,
                ...(params.fromDate ? { fromDate: params.fromDate } : {}),
                ...(params.toDate ? { toDate: params.toDate } : {}),
            })
        },
        enabled: !!restaurantId,
    })
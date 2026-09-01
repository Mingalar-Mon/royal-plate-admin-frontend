import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { apiGetTransactions } from '@/services/TransactionService'
import type { TransactionQueries } from '@/@types/transaction'

export const useGetTransactions = (
    restaurantId: string,
    params: TransactionQueries,
) =>
    useQuery({
        queryKey: ['transactions', restaurantId, params],
        queryFn: () => {
            // The selected month is passed to the API as a date range:
            // fromDate = first day of month, toDate = last day of month.
            const { fromDate, toDate } = params.month
                ? {
                      fromDate: dayjs(params.month).startOf('month').format('YYYY-MM-DD'),
                      toDate: dayjs(params.month).endOf('month').format('YYYY-MM-DD'),
                  }
                : {}

            return apiGetTransactions({
                restaurantId,
                page: params.page,
                limit: params.limit,
                fromDate,
                toDate,
            })
        },
        enabled: !!restaurantId,
    })
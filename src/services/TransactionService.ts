import ApiService from './ApiService'
import type { GetTransactionsResponse } from '@/@types/transaction'

export type GetTransactionsParams = {
    restaurantId: string
    fromDate?: string // YYYY-MM-DD
    toDate?: string // YYYY-MM-DD
    page?: number
    limit?: number
}

export async function apiGetTransactions(params: GetTransactionsParams) {
    return ApiService.fetchDataWithAxios<GetTransactionsResponse>({
        url: '/transaction',
        method: 'get',
        params: { page: 1, limit: 10, ...params },
    })
}
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

export async function apiGetAllTransactions(
    params: GetTransactionsParams,
) {
    // The API caps limit at 100, so walk every page to get the full
    // filtered dataset (restaurantId + date range) for the CSV export.
    const items = []
    const firstPage = await apiGetTransactions({ ...params, limit: 100 })

    items.push(...firstPage.data)

    const totalPages = firstPage.paginator.totalPages
    for (let page = 2; page <= totalPages; page++) {
        const response = await apiGetTransactions({
            ...params,
            page,
            limit: 100,
        })
        items.push(...response.data)
    }

    return items
}
import ApiService from './ApiService'
import type { AxiosError } from 'axios'
import type { GetTransactionsResponse } from '@/@types/transaction'
import type {
    PayoutBatchesResponse,
    PayoutPreviewResponse,
    PostPayoutResponse,
} from '@/@types/payout'

type TransactionApiErrorBody = {
    message?: string
    errors?: string[]
}

export type GetTransactionsParams = {
    restaurantId: string
    fromDate?: string // YYYY-MM-DD
    toDate?: string // YYYY-MM-DD
    page?: number
    limit?: number
}

export type PayoutPreviewParams = {
    restaurantId: string
    fromDate: string
    toDate: string
}

export type PostPayoutParams = {
    restaurantId: string
    fromDate: string
    toDate: string
    // The four figures are persisted exactly as sent, so they must be numbers.
    totalPrice: number
    subTotal: number
    commission_fee: number
    netAmount: number
}

export async function apiGetTransactions(params: GetTransactionsParams) {
    return ApiService.fetchDataWithAxios<GetTransactionsResponse>({
        url: '/transaction',
        method: 'get',
        params: { page: 1, limit: 10, ...params },
    })
}

export async function apiGetAllTransactions(params: GetTransactionsParams) {
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

/**
 * The exact figures a payout would persist. Sends only the three documented
 * params — this endpoint is not paginated and takes no page/limit.
 */
export async function apiGetPayoutPreview(params: PayoutPreviewParams) {
    return ApiService.fetchDataWithAxios<PayoutPreviewResponse>({
        url: '/transaction/payout-preview',
        method: 'get',
        params: {
            restaurantId: params.restaurantId,
            fromDate: params.fromDate,
            toDate: params.toDate,
        },
    })
}

export async function apiGetPayouts(params: {
    page?: number
    limit?: number
    restaurantId?: string
}) {
    return ApiService.fetchDataWithAxios<PayoutBatchesResponse>({
        url: '/transaction/payout',
        method: 'get',
        params: { page: 1, limit: 10, ...params },
    })
}

export async function apiPostPayout(data: PostPayoutParams) {
    return ApiService.fetchDataWithAxios<PostPayoutResponse>({
        url: '/transaction/payout',
        method: 'post',
        data,
    })
}

const NO_UNSETTLED_ROWS = /no unsettled/i

/**
 * 400 covers both a malformed request and "this range has nothing left to
 * settle". The latter is the double-settle protection working, so it gets
 * its own wording rather than reading like a failure.
 */
export function getTransactionErrorMessage(
    error: unknown,
    fallback = 'Something went wrong. Please try again.',
): string {
    const status = (error as AxiosError | undefined)?.response?.status
    const body = (error as AxiosError<TransactionApiErrorBody> | undefined)
        ?.response?.data
    const message = body?.errors?.[0] ?? body?.message

    if (status === 401) return 'Your session has expired. Please sign in again.'
    if (status === 403) return 'Owner or superadmin access is required.'
    if (status === 404) return 'Restaurant not found.'
    if (status === 400 && message && NO_UNSETTLED_ROWS.test(message)) {
        return 'Everything in this range is already settled. Pick a different date range.'
    }

    return message ?? fallback
}

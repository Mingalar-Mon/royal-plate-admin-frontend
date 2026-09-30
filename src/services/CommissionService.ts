import ApiService from './ApiService'
import type { AxiosError } from 'axios'
import type {
    Commission,
    CommissionCreateResponse,
    CommissionFormData,
    CommissionListResponse,
    CommissionQuery,
} from '@/@types/commission'

type CommissionApiErrorBody = {
    message?: string
    errors?: string[]
}

export async function apiGetCommissions(params: CommissionQuery) {
    return ApiService.fetchDataWithAxios<CommissionListResponse>({
        url: '/commission-batch',
        method: 'get',
        params: {
            status: params.status,
            restaurantId: params.restaurantId || undefined,
            page: params.page,
            limit: params.limit,
            sortKey: params.sortKey,
            sortOrder: params.sortOrder,
            search: params.search,
            fromDate: params.fromDate?.toISOString(),
            toDate: params.toDate?.toISOString(),
        },
    })
}

/**
 * Walks every page of active batches. The API caps `limit` at 100, so a single
 * request silently truncates once a platform runs more than 100 restaurants.
 */
export async function apiGetAllActiveCommissions() {
    const items: Commission[] = []
    const firstPage = await apiGetCommissions({
        page: 1,
        limit: 100,
        sortKey: 'created_at',
        sortOrder: 'DESC',
        search: '',
        status: true,
    })

    items.push(...firstPage.data)

    const totalPages = firstPage.paginator.totalPages
    for (let page = 2; page <= totalPages; page++) {
        const response = await apiGetCommissions({
            page,
            limit: 100,
            sortKey: 'created_at',
            sortOrder: 'DESC',
            search: '',
            status: true,
        })
        items.push(...response.data)
    }

    return items
}

export async function apiCreateCommission(data: CommissionFormData) {
    return ApiService.fetchDataWithAxios<
        CommissionCreateResponse,
        CommissionFormData
    >({
        url: '/commission-batch',
        method: 'post',
        data,
    })
}

/**
 * The only mutable operation on a batch. Activating retires the restaurant's
 * current active batch first; re-sending the current value is a 400, not a
 * no-op.
 */
export async function apiUpdateCommissionStatus({
    id,
    status,
}: {
    id: string
    status: boolean
}) {
    return ApiService.fetchDataWithAxios<CommissionCreateResponse>({
        url: `/commission-batch/${id}/status`,
        method: 'patch',
        data: { status },
    })
}

/**
 * 400 is a business rule and 422 is Joi, but both are user-correctable and
 * both carry their detail in `errors[]`, so they read the same here.
 */
export function getCommissionErrorMessage(
    error: unknown,
    fallback = 'Something went wrong. Please try again.',
): string {
    const status = (error as AxiosError | undefined)?.response?.status
    const body = (error as AxiosError<CommissionApiErrorBody> | undefined)
        ?.response?.data

    if (status === 401) return 'Your session has expired. Please sign in again.'
    if (status === 403) return 'Superadmin access is required for this action.'

    if (status === 400 || status === 422) {
        return body?.errors?.[0] ?? body?.message ?? fallback
    }

    if (status === 404) return 'Restaurant not found.'

    return body?.message ?? body?.errors?.[0] ?? fallback
}

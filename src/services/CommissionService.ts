import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import type {
    CommissionCreateResponse,
    CommissionFormData,
    CommissionListResponse,
    CommissionQuery,
} from '@/@types/commission'

export async function apiGetCommissions(params: CommissionQuery) {
    return ApiService.fetchDataWithAxios<CommissionListResponse>({
        url: '/commission-batch',
        method: 'get',
        params: {
            status: params.status,
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

export async function apiUpdateCommissionPercentage({
    id,
    percentage,
}: {
    id: string
    percentage: number
}) {
    return ApiService.fetchDataWithAxios<CommissionCreateResponse>({
        url: `/commission-batch/${id}/percentage`,
        method: 'patch',
        data: { percentage },
    })
}

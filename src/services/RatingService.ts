import type { Paginator } from '@/@types/common_type'
import type { OnSortParam } from '@/components/shared/DataTable'
import ApiService from './ApiService'

export type Rating = {
    id: string
    score: number | string
    review: string
    ownerResponse: string | null
    ownerRespondedAt: string | null
    created_at: string
    updated_at: string
    user?: {
        id: string
        name?: string
        email?: string
        phone?: string
        profile?: { key?: string; url?: string }
    }
}

type RatingListResponse = {
    status: string
    data: Rating[]
    paginator: Paginator
}

type RatingMutationResponse = {
    status: string
    message: string
    data: Rating
}

type RatingParams = {
    restaurantId: string
    pageIndex: number
    pageSize: number
    response?: 'pending' | 'replied'
    search?: string
    sort?: OnSortParam
}

export async function apiGetRatings(params: RatingParams) {
    return ApiService.fetchDataWithAxios<RatingListResponse>({
        url: `/rating/get-ratings/${params.restaurantId}`,
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.search || undefined,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
        },
    })
}

export async function apiSaveRatingOwnerResponse({
    ratingId,
    ownerResponse,
}: {
    ratingId: string
    ownerResponse: string
}) {
    return ApiService.fetchDataWithAxios<RatingMutationResponse>({
        url: `/rating/owner-response/${ratingId}`,
        method: 'patch',
        data: { ownerResponse },
    })
}

export async function apiDeleteRatingOwnerResponse(ratingId: string) {
    return ApiService.fetchDataWithAxios<RatingMutationResponse>({
        url: `/rating/owner-response/${ratingId}`,
        method: 'delete',
    })
}

import ApiService from './ApiService'

export async function apiGetOwnerList(params: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: '/owner/get-owners', // Matches your active production backend routing configuration prefix
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            sortOrder: params.sort?.order,
            sortKey: params.sort?.key,
        },
    })
}

export async function apiGetOwnerDetail(ownerId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/owner/get-owner/${ownerId}`,
        method: 'get',
    })
}

export interface UpdateOwnerPayload {
    id: string
    data: {
        name?: string
        email?: string
        phone?: string
        password?: string
    }
}

export async function apiUpdateOwnerDetail({ id, data }: UpdateOwnerPayload) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/owner/update-owner/${id}`,
        method: 'patch',
        data,
    })
}

export interface CreateOwnerPayload {
    data: {
        name: string
        email: string
        phone: string
        password: string
        code?: string
    }
}

export async function apiCreateOwner({ data }: CreateOwnerPayload) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/owner/create-owner`,
        method: 'post',
        data,
    })
}

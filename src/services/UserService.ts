import ApiService from './ApiService'

export async function apiGetUserList(params: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: '/user/get-users', // Adjust to match your backend user management route path
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            isVerified:
                params.isVerified !== '' ? params.isVerified : undefined,
            gender: params.gender !== '' ? params.gender : undefined,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
        },
    })
}

export async function apiGetUserDetail(userId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/user/get-user/${userId}`,
        method: 'get',
    })
}

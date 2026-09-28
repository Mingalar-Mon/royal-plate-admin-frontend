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

// ✅ Reversibly deactivates any user: sets `status = inactive` and stamps
// `deletedAt`, leaving the profile and avatar intact so reactivate can restore
// it. Super admin only. NOTE: this endpoint is DELETE, unlike the owner
// equivalent which is PATCH.
export async function apiSoftDeleteUser(userId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/user/soft-delete-user/${userId}`,
        method: 'delete',
    })
}

// ✅ Restores a soft-deleted user: clears deletedAt and flips status back to
// `active`. Super admin only — there is no self-service path for users.
export async function apiReactivateUser(userId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/user/reactivate-user/${userId}`,
        method: 'patch',
    })
}

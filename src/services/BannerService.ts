import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import ApiService from './ApiService'

export async function apiGetBannerList(params: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: '/banner/get-banners',
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            type: params.type !== '' ? params.type : undefined,
        },
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiGetBannerDetail(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/banner/get-banner/${id}`,
        method: 'get',
    })
}

export async function apiCreateBanner(formData: FormData) {
    return ApiService.fetchDataWithAxios<any>({
        url: '/banner/create-banner',
        method: 'post',
        data: formData, // Auto-binds binary boundary layouts
    })
}

export async function apiUpdateBanner(id: string, formData: FormData) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/banner/update-banner/${id}`,
        method: 'patch',
        data: formData,
    })
}

export async function apiDeleteBanner(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/banners/delete/${id}`,
        method: 'delete',
    })
}

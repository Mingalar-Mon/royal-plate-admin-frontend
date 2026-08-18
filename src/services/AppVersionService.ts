import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import type {
    AppVersionFormData,
    GetAppVersionDetailResponse,
    GetAppVersionResponse,
} from '@/@types/appVersion'

// Base URL already includes the /api prefix (see configs/app.config.ts),
// so the resource path is just /app-version.

export async function apiGetAppVersions() {
    return ApiService.fetchDataWithAxios<GetAppVersionResponse>({
        url: '/app-version',
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiGetAppVersionDetail(id: string) {
    return ApiService.fetchDataWithAxios<GetAppVersionDetailResponse>({
        url: `/app-version/${id}`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiCreateAppVersion(data: AppVersionFormData) {
    return ApiService.fetchDataWithAxios<
        GetAppVersionDetailResponse,
        AppVersionFormData
    >({
        url: '/app-version',
        method: 'post',
        data,
    })
}

export async function apiUpdateAppVersion(
    id: string,
    data: AppVersionFormData,
) {
    return ApiService.fetchDataWithAxios<
        GetAppVersionDetailResponse,
        AppVersionFormData
    >({
        url: `/app-version/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteAppVersion(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/app-version/${id}`,
        method: 'delete',
    })
}

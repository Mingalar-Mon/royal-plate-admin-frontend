import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import type {
    AppSettingFormData,
    AppSettingUpdateData,
    GetAppSettingDetailResponse,
    GetAppSettingResponse,
} from '@/@types/appSetting'

// Base URL already includes the /api prefix (see configs/app.config.ts),
// so the resource path is just /settings.
//
// Reads (list / by id) use Basic auth; writes (create / update / delete)
// use the admin JWT, which the axios interceptor attaches automatically.

export async function apiGetAppSettings() {
    return ApiService.fetchDataWithAxios<GetAppSettingResponse>({
        url: '/settings',
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiGetAppSettingDetail(id: string) {
    return ApiService.fetchDataWithAxios<GetAppSettingDetailResponse>({
        url: `/settings/${id}`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiCreateAppSetting(data: AppSettingFormData) {
    return ApiService.fetchDataWithAxios<
        GetAppSettingDetailResponse,
        AppSettingFormData
    >({
        url: '/settings',
        method: 'post',
        data,
    })
}

export async function apiUpdateAppSetting(
    id: string,
    data: AppSettingUpdateData,
) {
    return ApiService.fetchDataWithAxios<
        GetAppSettingDetailResponse,
        AppSettingUpdateData
    >({
        url: `/settings/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiUpdateAppSettingStatus({
    id,
    isActive,
}: {
    id: string
    isActive: boolean
}) {
    return ApiService.fetchDataWithAxios<GetAppSettingDetailResponse>({
        url: `/settings/${id}`,
        method: 'patch',
        data: { isActive },
    })
}

export async function apiDeleteAppSetting(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/settings/${id}`,
        method: 'delete',
    })
}

import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import type {
    GetUnreadCountResponse,
    GetNotificationListResponse,
    MarkReadResponse,
} from '@/@types/notification'

const PREFIX = '/notification'

export async function apiGetNotificationCount(restaurantId: string) {
    return ApiService.fetchDataWithAxios<GetUnreadCountResponse>({
        url: `${PREFIX}/count`,
        method: 'get',
        params: { restaurantId },
    })
}

export async function apiGetNotificationList(
    restaurantId: string,
    params?: {
        page?: number
        limit?: number
        category?: 'order' | 'reservation' | 'blog'
        isRead?: boolean
    },
) {
    return ApiService.fetchDataWithAxios<GetNotificationListResponse>({
        url: `${PREFIX}/list`,
        method: 'get',
        params: { restaurantId, page: 1, limit: 20, ...params },
    })
}

export async function apiMarkNotificationRead(id: string) {
    return ApiService.fetchDataWithAxios<MarkReadResponse>({
        url: `${PREFIX}/${id}/read`,
        method: 'patch',
    })
}

export async function apiMarkAllNotificationsRead(restaurantId: string) {
    return ApiService.fetchDataWithAxios<MarkReadResponse>({
        url: `${PREFIX}/read-all`,
        method: 'patch',
        data: { restaurantId },
    })
}

export async function apiRegisterDeviceToken(
    token: string,
    platform: 'web' | 'android' | 'ios' = 'web',
) {
    return ApiService.fetchDataWithAxios<MarkReadResponse>({
        url: `${PREFIX}/device-token`,
        method: 'post',
        data: { token, platform },
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}
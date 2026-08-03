import ApiService from './ApiService'
import type {
    GetDashboardEDADataResponse,
    GetTopSaleDishesResponse,
    GetTopCustomersResponse,
} from '@/@types/dashboard'

export async function apiGetDashboardEDA(restaurantId: string) {
    return ApiService.fetchDataWithAxios<GetDashboardEDADataResponse>({
        url: 'dashboard/get',
        method: 'get',
        params: { restaurantId },
    })
}

export async function apiGetTopSaleDishes(restaurantId: string, limit = 10) {
    return ApiService.fetchDataWithAxios<GetTopSaleDishesResponse>({
        url: 'dashboard/top-sale-dishes',
        method: 'get',
        params: { restaurantId, limit },
    })
}

export async function apiGetTopCustomers(restaurantId: string, limit = 10) {
    return ApiService.fetchDataWithAxios<GetTopCustomersResponse>({
        url: 'dashboard/top-customers',
        method: 'get',
        params: { restaurantId, limit },
    })
}

import ApiService from '@/services/ApiService'
import { Restaurant } from '../ScrumBoard/types'

export async function apiGetRestaurants<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/restaurant/get-restaurants', // Adjust to your actual endpoint
        method: 'get',
    })
}
export async function apiGetRestaurant<T, U>(id: string) {
    return ApiService.fetchDataWithAxios<T, U>({
        url: `/restaurant/get-restaurant/${id}`, // Adjust to your actual endpoint
        method: 'get',
    })
}

export async function apiCreateRestaurant<T>(data: Partial<Restaurant>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/restaurants',
        method: 'post',
        data,
    })
}

export async function apiUpdateRestaurant<T>(
    id: string,
    data: Partial<Restaurant>,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/restaurants/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteRestaurant<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/restaurants/${id}`,
        method: 'delete',
    })
}

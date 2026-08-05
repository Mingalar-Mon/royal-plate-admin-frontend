import {
    GetRestaurantResponse,
    GetRestaurantListResponse,
    Restaurant,
    DeleteRestaurantResponse,
    UpdateRestaurantResponse,
    CreateRestaurantResponse,
} from '@/@types/restaurant'
import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'

export async function apiGetRestaurants() {
    return ApiService.fetchDataWithAxios<GetRestaurantListResponse>({
        url: `restaurant/owner/get-restaurants`,
        method: 'get',
    })
}

export async function apiGetRestaurantList() {
    return ApiService.fetchDataWithAxios<GetRestaurantListResponse>({
        url: `restaurant/get-restaurants`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiGetRestaurant(id: string) {
    console.log('Restaurant id in api', id)
    return ApiService.fetchDataWithAxios<GetRestaurantResponse>({
        url: `restaurant/get-restaurant/${id}`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

// after excluding owner and staff, remove partial
// data: Partial<Restaurant>
export async function apiCreateRestaurant(data: any) {
    return ApiService.fetchDataWithAxios<CreateRestaurantResponse>({
        url: `restaurant/create-restaurant`,
        method: 'post',
        data,
    })
}

export async function apiUpdateRestaurant({
    id,
    data,
}: {
    id: string
    data: Partial<Restaurant>
}) {
    return ApiService.fetchDataWithAxios<UpdateRestaurantResponse>({
        url: `restaurant/update-restaurant/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteRestaurant(id: string) {
    return ApiService.fetchDataWithAxios<DeleteRestaurantResponse>({
        url: `restaurant/delete-restaurant/${id}`,
        method: 'delete',
    })
}

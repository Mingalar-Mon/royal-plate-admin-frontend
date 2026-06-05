import {
    CreateRestaurantProfile,
    RestaurantProfile,
} from './../@types/restaurant'
import {
    CreateRestaurantProfileResponse,
    GetRestaurantProfileResponse,
    UpdateRestaurantProfileResponse,
} from '@/@types/restaurantProfile'
import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export async function apiGetRestaurantProfile(profileId: string) {
    return ApiService.fetchDataWithAxios<GetRestaurantProfileResponse>({
        url: `/restaurant/profile/get-profile/${profileId}`,
        method: 'get',
        auth: {
            username: 'royal-plate-mobile-app',
            password: 'royal-plate',
        },
    })
}

export async function apiUpdateRestaurantProfile({
    profileId,
    data,
}: {
    profileId: string
    data: Partial<RestaurantProfile>
}) {
    return ApiService.fetchDataWithAxios<UpdateRestaurantProfileResponse>({
        url: `/restaurant/profile/update-profile/${profileId}`,
        method: `patch`,
        data,
    })
}

export async function apiCreateRestaurantProfile({
    restaurantId,
    data,
}: {
    restaurantId: string
    data: CreateRestaurantProfile
}) {
    return ApiService.fetchDataWithAxios<CreateRestaurantProfileResponse>({
        url: `/restaurant/profile/create-profile/${restaurantId}`,
        method: 'post',
        data,
    })
}

export async function apiDeleteRestaurantProfile(profileId: string) {
    return ApiService.fetchDataWithAxios<RestaurantProfile>({
        url: `/restaurant/profile/delete-restaurant/${profileId}`,
        method: 'delete',
    })
}

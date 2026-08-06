// import { GetDishListResponse } from '@/@types/restaurant'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import ApiService from './ApiService'
import type {
    CreateDishResponse,
    Dish,
    GetDishListResponse,
    GetDishResponse,
} from '@/@types/dish'

import type { GetDishesParams } from '@/utils/custom-hooks/useDish'
import { DishQueries } from '@/store/dishStore'
import { TableQueries } from '@/views/dishes/types/dish.type'

export async function apiGetDishes({
    restaurantId,
    params,
}: {
    restaurantId: string
    params: DishQueries
}) {
    console.log('Params: ', params)
    const { pageIndex, pageSize, query } = params
    return ApiService.fetchDataWithAxios<GetDishListResponse>({
        url: `dish/${restaurantId}/get-dishes`,
        method: `get`,
        params: {
            page: pageIndex,
            limit: pageSize,
            search: query,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            status: params.status,
            category: params.category,
        },
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiCreateDish({
    restaurantId,
    cuisineId,
    data,
}: {
    restaurantId: string
    cuisineId: string
    data: Dish | any
}) {
    return ApiService.fetchDataWithAxios<CreateDishResponse>({
        url: `/dish/create-dish/${restaurantId}/${cuisineId}`,
        method: 'post',
        data,
    })
}

export async function apiUpdateDish({
    dishId,
    data,
}: {
    dishId: string
    data: Partial<Dish> | any
}) {
    console.log(data)
    return ApiService.fetchDataWithAxios({
        url: `/dish/update-dish/${dishId}`,
        method: 'patch',
        data,
    })
}

export async function apiGetDish(dishId: string) {
    return ApiService.fetchDataWithAxios<GetDishResponse>({
        url: `/dish/get-dish/${dishId}`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiDeleteDish(dishId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/dish/delete-dish/${dishId}`,
        method: 'DELETE',
    })
}

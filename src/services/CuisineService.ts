import { Cuisine } from '@/@types/restaurant'
import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import { GetCuisineResponse } from '@/@types/cuisine'
import { CuisineQueries } from '@/store/cuisineStore'

export async function apiGetCuisines(params: CuisineQueries) {
    return ApiService.fetchDataWithAxios<GetCuisineResponse>({
        url: `cuisines/get-cuisines`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            sortOrder: params.sort?.order,
            sortKey: params.sort?.key,
        },
    })
}

export async function apiGetCuisineDetail(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/cuisines/get-cuisine/${id}`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiCreateCuisine(data: FormData) {
    console.log('Data to create cuisine: ', data)
    return ApiService.fetchDataWithAxios<any>({
        url: '/cuisines/create-cuisine',
        method: 'post',
        data, // Binds multipart/form-data boundaries automatically
    })
}

export async function apiUpdateCuisine(id: string, data: FormData) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/cuisines/update-cuisine/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteCuisine(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/cuisines/delete-cuisine/${id}`,
        method: 'delete',
    })
}

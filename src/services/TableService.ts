import { sortBy } from 'lodash'
import { USER } from '@/constants/roles.constant'
import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'

export async function apiGetTableList(restaurantId: string, params: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/table/get-tables/${restaurantId}`,
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            type: params.type !== '' ? params.type : undefined,
            status: params.status !== '' ? params.status : undefined,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
        },
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiGetTableDetail(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/table/get-table/${id}`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}

export async function apiCreateTable(restaurantId: string, data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/table/create-table/${restaurantId}`,
        method: 'post',
        data,
    })
}

export async function apiUpdateTable(id: string, data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/table/update-table/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeleteTable(id: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/table/delete-table/${id}`,
        method: 'delete',
    })
}

import { mapTheme } from './../utils/hooks/useThemeSchema'
// import { Staff } from '@/@types/restaurant'
import { StaffRole } from '@/views/staff/types/staff.type'
import ApiService from './ApiService'
import { Paginator } from '@/@types/common_type'
import { sortBy } from 'lodash'

export interface Staff {
    id: string
    name: string
    email: string
    password: string
    role: StaffRole
    created_at: string
    updated_at: string
}
interface CreateStaffResponse {
    success: true
    data: [Staff]
    message: string
}
export interface CreateStaffPayload {
    restaurantId: string
    data: {
        name: string
        email: string
        role: string
        password?: string
    }
}

export async function apiCreateStaff({
    restaurantId,
    data,
}: CreateStaffPayload) {
    return ApiService.fetchDataWithAxios<CreateStaffResponse>({
        url: `restaurant/staff/create-staff/${restaurantId}`,
        method: `post`,
        data,
    })
}

export interface UpdateStaffPayload {
    id: string
    data: {
        name?: string
        email?: string
        role?: string
        password?: string
    }
}

interface GetStaffDetailResponse {
    success: true
    data: Staff
    message: string
}

export async function apiGetStaffDetail(staffId: string) {
    return ApiService.fetchDataWithAxios<GetStaffDetailResponse>({
        url: `/restaurant/staff/get-staff/${staffId}`,
        method: 'get',
    })
}

interface UpdateStaffResponse {
    success: boolean
    data: Staff
    message: string
}
export async function apiUpdateStaff({ id, data }: UpdateStaffPayload) {
    return ApiService.fetchDataWithAxios<UpdateStaffResponse>({
        url: `/restaurant/staff/update-staff/${id}`,
        method: 'patch', // Matches your TypeORM save controller action
        data,
    })
}

export async function apiDeleteStaff(staffId: string) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/restaurant/staff/delete-staff/${staffId}`,
        method: 'delete',
    })
}

interface GetStaffListResponse {
    success: boolean
    paginator: Paginator
    data: Staff[]
    message: string
}

export async function apiGetStaffList({
    restaurantId,
    params,
}: {
    restaurantId: string
    params: any
}) {
    // console.log('Fetching staff list with params:', params) // Debug log to check params
    return ApiService.fetchDataWithAxios<GetStaffListResponse>({
        url: `/restaurant/staff/get-staffs/${restaurantId}`,
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query,
            role: params.role,
            sortKey: params.sort?.key || 'created_at',
            sortOrder: params.sort?.order || 'DESC',
        },
    })
}

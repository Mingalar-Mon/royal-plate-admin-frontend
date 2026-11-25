import ApiService from './ApiService'
import type {
    AdminCreatePayload,
    AdminCreateResponse,
    AdminDeleteResponse,
    AdminDetailResponse,
    AdminListParams,
    AdminListResponse,
    AdminUpdatePayload,
    AdminUpdateResponse,
} from '@/@types/admin'

const BASE = 'v1/admin'

/** The API stores an absent phone/code as null, and rejects empty PATCH bodies. */
const normalizeOptional = (value?: string | null): string | null => {
    const trimmed = (value ?? '').trim()
    return trimmed ? trimmed : null
}

export function apiCreateAdmin(payload: AdminCreatePayload) {
    const data = {
        name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password,
        phone: normalizeOptional(payload.phone),
        code: normalizeOptional(payload.code),
        roleId: payload.roleId ?? null,
    }

    return ApiService.fetchDataWithAxios<AdminCreateResponse>({
        url: BASE,
        method: 'post',
        data,
    })
}

export function apiGetAdmins(params: AdminListParams) {
    return ApiService.fetchDataWithAxios<AdminListResponse>({
        url: BASE,
        method: 'get',
        params: {
            page: params.page,
            limit: params.limit,
            search: params.search,
        },
    })
}

export function apiGetAdmin(id: string) {
    return ApiService.fetchDataWithAxios<AdminDetailResponse>({
        url: `${BASE}/${id}`,
        method: 'get',
    })
}

export function apiUpdateAdmin({
    id,
    data,
}: {
    id: string
    data: AdminUpdatePayload
}) {
    const payload: Record<string, unknown> = {}

    if (data.name !== undefined) payload.name = data.name.trim()
    if (data.email !== undefined) payload.email = data.email.trim()
    if (data.password) payload.password = data.password
    if (data.phone !== undefined) payload.phone = normalizeOptional(data.phone)
    if (data.code !== undefined) payload.code = normalizeOptional(data.code)
    if (data.roleId !== undefined) payload.roleId = data.roleId

    return ApiService.fetchDataWithAxios<AdminUpdateResponse>({
        url: `${BASE}/${id}`,
        method: 'patch',
        data: payload,
    })
}

export function apiDeleteAdmin(id: string) {
    return ApiService.fetchDataWithAxios<AdminDeleteResponse>({
        url: `${BASE}/${id}`,
        method: 'delete',
    })
}

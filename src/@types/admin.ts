import type { Paginator } from './common_type'

export interface AdminRole {
    id: string
    name: string
    description: string
}

/** Password is never returned by any admin endpoint. */
export interface AdminDTO {
    id: string
    name: string
    email: string
    phone: string | null
    code: string | null
    role: AdminRole | null
}

export interface AdminCreatePayload {
    name: string
    email: string
    password: string
    phone?: string | null
    code?: string | null
    roleId?: string | null
}

export type AdminUpdatePayload = Partial<AdminCreatePayload>

export interface AdminListParams {
    page: number
    limit: number
    search: string
}

interface SuccessResponse<T> {
    success: boolean
    data: T
    message: string
}

export type AdminCreateResponse = SuccessResponse<AdminDTO>
export type AdminDetailResponse = SuccessResponse<AdminDTO>
export type AdminUpdateResponse = SuccessResponse<AdminDTO>

export interface AdminListResponse {
    success: boolean
    paginator: Paginator
    data: AdminDTO[]
    message: string
}

export interface AdminDeleteResponse {
    success: boolean
    message: string
}

/** Validation (422) and business (400/404) errors share this shape. */
export interface AdminApiError {
    status: 'error'
    errorCode: number
    message: string
    errors: string[]
}

export type AdminFormData = {
    name: string
    email: string
    password: string
    phone: string
    code: string
    roleId: string
    manualRoleId: string
}

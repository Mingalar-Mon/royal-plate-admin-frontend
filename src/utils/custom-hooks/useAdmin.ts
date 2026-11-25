import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import {
    apiCreateAdmin,
    apiDeleteAdmin,
    apiGetAdmin,
    apiGetAdmins,
    apiUpdateAdmin,
} from '@/services/AdminService'
import type {
    AdminDTO,
    AdminDetailResponse,
    AdminListParams,
    AdminListResponse,
    AdminRole,
} from '@/@types/admin'

export const adminKeys = {
    all: ['admins'] as const,
    list: (params: AdminListParams) => ['admins', 'list', params] as const,
    detail: (id: string) => ['admins', 'detail', id] as const,
}

export const useAdminList = (params: AdminListParams) => {
    return useQuery({
        queryKey: adminKeys.list(params),
        queryFn: () => apiGetAdmins(params),
    })
}

export const useAdmin = (
    id: string,
    options?: Partial<UseQueryOptions<AdminDetailResponse>>,
) => {
    return useQuery({
        queryKey: adminKeys.detail(id),
        queryFn: () => apiGetAdmin(id),
        enabled: !!id,
        ...options,
    })
}

export const useCreateAdmin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.all })
        },
    })
}

export const useUpdateAdmin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateAdmin,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminKeys.all })
            queryClient.invalidateQueries({
                queryKey: adminKeys.detail(variables.id),
            })
        },
    })
}

export const useDeleteAdmin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.all })
        },
    })
}

/**
 * The new module has no role-listing endpoint that the admin token can call,
 * so the distinct roles attached to existing admins are used as dropdown
 * options. `AdminForm` also offers a manual UUID entry as a fallback.
 */
export const useAdminRoleOptions = () => {
    return useQuery({
        queryKey: ['admins', 'roles'],
        queryFn: () => apiGetAdmins({ page: 1, limit: 100, search: '' }),
        select: (data: AdminListResponse): AdminRole[] => {
            const roles = new Map<string, AdminRole>()
            data.data.forEach((admin: AdminDTO) => {
                if (admin.role) roles.set(admin.role.id, admin.role)
            })
            return Array.from(roles.values()).sort((a, b) =>
                a.name.localeCompare(b.name),
            )
        },
        staleTime: 60_000,
    })
}

export const getAdminApiErrorMessage = (
    error: unknown,
    fallback: string,
): string => {
    const data = (error as { response?: { data?: Record<string, unknown> } })
        ?.response?.data
    if (!data) return fallback

    if (typeof data.message === 'string' && data.message) return data.message
    if (Array.isArray(data.errors) && typeof data.errors[0] === 'string') {
        return data.errors[0]
    }
    return fallback
}

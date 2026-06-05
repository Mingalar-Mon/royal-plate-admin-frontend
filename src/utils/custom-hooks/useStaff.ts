import { Variables } from './../../configs/preset-theme-schema.config'
import { useState } from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'
import { mockStaff } from '../mock/staffData'
import type {
    RestaurantStaff,
    StaffFormData,
    // TableQueries,
} from '@/views/staff/types/staff.type'
import {
    apiCreateStaff,
    apiDeleteStaff,
    apiGetStaffDetail,
    apiGetStaffList,
    apiUpdateStaff,
} from '@/services/RestaurantStaffService'
import { TableQueries, useStaffStore } from '@/store/staffStore'
import { useRestaurantStore } from '@/store/restaurantStore'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let staffData = [...mockStaff]

// Simulated API functions
const fetchStaff = async (restaurantId: string, params: TableQueries) => {
    // 🔁 Replace with: apiClient.get(`/staff/restaurant/${restaurantId}`, { params })
    await delay(500)
    let filtered = staffData.filter((s) => s.restaurantId === restaurantId)
    if (params.query) {
        const q = params.query.toLowerCase()
        filtered = filtered.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q),
        )
    }
    if (params.role && params.role !== 'all') {
        filtered = filtered.filter((s) => s.role === params.role)
    }
    if (params.sort?.key) {
        filtered.sort((a, b) => {
            const aVal = a[params.sort!.key as keyof RestaurantStaff] as string
            const bVal = b[params.sort!.key as keyof RestaurantStaff] as string
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return params.sort!.order === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal)
            }
            return 0
        })
    }
    const start = (params.pageIndex - 1) * params.pageSize
    const paginated = filtered.slice(start, start + params.pageSize)
    return { list: paginated, total: filtered.length }
}

const fetchStaffById = async (id: string) => {
    await delay(300)
    const staff = staffData.find((s) => s.id === id)
    if (!staff) throw new Error('Staff not found')
    return staff
}

const createStaff = async (data: StaffFormData & { restaurantId: string }) => {
    await delay(600)
    const newStaff: RestaurantStaff = {
        id: String(Date.now()),
        name: data.name,
        email: data.email,
        role: data.role,
        restaurantId: data.restaurantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    staffData.push(newStaff)
    return newStaff
}

const updateStaff = async ({
    id,
    data,
}: {
    id: string
    data: Partial<StaffFormData>
}) => {
    await delay(600)
    const index = staffData.findIndex((s) => s.id === id)
    if (index === -1) throw new Error('Staff not found')
    staffData[index] = {
        ...staffData[index],
        ...data,
        updatedAt: new Date().toISOString(),
    }
    return staffData[index]
}

const deleteStaff = async (id: string) => {
    await delay(500)
    staffData = staffData.filter((s) => s.id !== id)
    return { success: true }
}

export const useStaffList = ({
    restaurantId,
    params,
}: {
    restaurantId: string
    params: TableQueries
}) => {
    // const [tableData, setTableData] = useState<TableQueries>({
    //     pageIndex: 1,
    //     pageSize: 10,
    //     query: '',
    //     role: '',
    //     sort: { key: 'name', order: 'asc' },
    // })

    // console.log(
    //     'useStaffList called with restaurantId:',
    //     restaurantId,
    //     'and tableData:',
    //     tableData,
    // ) // Debug log to check parameters
    const tableData = useStaffStore((state) => state.tableData)
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['staff', restaurantId, tableData],
        queryFn: () =>
            apiGetStaffList({
                restaurantId,
                params,
                // params: {
                //     pageIndex: tableData.pageIndex,
                //     pageSize: tableData.pageSize,
                //     query: tableData.query,
                //     role: tableData.role,
                //     sort: tableData.sort, // Uncomment if sorting is implemented in the API
                // },
            }), //sort: tableData.sort
        // queryFn: () => fetchStaff(restaurantId, tableData),
        enabled: !!restaurantId,
    })

    const staffList = data?.data || []
    const total = data?.paginator.totalItems || 0

    return {
        staffList: staffList,
        total: total,
        // tableData,
        // setTableData,
        isLoading,
        refetch,
    }
}

export const useStaff = (
    id: string,
    options?: Partial<UseQueryOptions<any, any, any, any>>,
) => {
    // const isEnabled = enabled ? true : false
    return useQuery({
        queryKey: ['staff', id],
        queryFn: () => apiGetStaffDetail(id),
        ...options,
        enabled: options?.enabled !== undefined ? options.enabled : !!id,
    })
}

export const useCreateStaff = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateStaff,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['staff', variables.restaurantId],
            })
        },
        // TODO: handle notification on frontend page
        onError: (error: any) => {
            console.error('Error creating staff member account:', error)
            // toast.push(
            //     <Notification type="danger" title="Error">
            //         {error?.response?.data?.message || 'Failed to create staff account'}
            //     </Notification>
            // )
        },
    })
}

export const useUpdateStaff = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateStaff,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['staff'] })
            queryClient.invalidateQueries({ queryKey: ['staff', variables.id] })
        },
        onError: (error: any) => {
            console.error('Error updating staff data: ', error)
        },
    })
}

export const useDeleteStaff = () => {
    const queryClient = useQueryClient()
    // const tableData = useStaffStore((state) => state.tableData)
    return useMutation({
        mutationFn: apiDeleteStaff,
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['staff'],
                exact: false,
            })
        },
    })
}

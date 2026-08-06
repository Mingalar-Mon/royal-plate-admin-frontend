import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    apiGetTableList,
    apiGetTableDetail,
    apiCreateTable,
    apiUpdateTable,
    apiDeleteTable,
} from '@/services/TableService'
import { Notification, toast } from '@/components/ui'

export const useTableListQuery = (restaurantId: string, params: any) => {
    return useQuery({
        queryKey: ['tables', restaurantId, params],
        queryFn: () => apiGetTableList(restaurantId, params),
        enabled: !!restaurantId,
    })
}

export const useTableDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['table', id],
        queryFn: () => apiGetTableDetail(id),
        enabled: !!id,
    })
}

export const useCreateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            restaurantId,
            data,
        }: {
            restaurantId: string
            data: any
        }) => apiCreateTable(restaurantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] })
            // toast.push(<Notification type="success" title="Table built successfully!" />)
        },
    })
}

export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            apiUpdateTable(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tables'] })
            queryClient.invalidateQueries({ queryKey: ['table', variables.id] })
            // toast.push(<Notification type="success" title="Table updated successfully!" />)
        },
    })
}

export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] })
            // toast.push(<Notification type="success" title="Table removed successfully!" />)
        },
    })
}

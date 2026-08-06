import { OrderQueries } from '@/store/orderStore'
// import { apiCreateOrder } from '@/services/OrderService'
import { Order, OrderFormSchema } from '@/views/order/types/order.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay } from '../helpers/mock.helper'

import { mockOrders } from '../mock/orderData'
import { useParams } from 'react-router'
import {
    apiGetOrder,
    apiGetOrders,
    apiUpdateOrderStatus,
} from '@/services/OrderService'
import { useOrderStore } from '@/store/orderStore'

// ========= MOCK HELPERS ===============
const mockOrderData = [...mockOrders]

// export const useCreateOrder = () => {
//     const queryClient = useQueryClient()

//     return useMutation({
//         mutationFn: ({
//             restaurantId,
//             data,
//         }: {
//             restaurantId: string
//             data: Partial<Order>
//         }) => apiCreateOrder(restaurantId, data),

//         onSuccess: async (response) => {
//             console.log('Response from create order hook: ', response)
//             await queryClient.invalidateQueries({ queryKey: ['orders'] })
//         },
//         onError: (error: unknown) => {
//             console.log('Error creating restaurant: ', error)
//         },
//     })
// }

// ================ GET ORDER  =====================

export const useGetOrder = (orderId: string) => {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            // Call API
            const response = await apiGetOrder(orderId)
            return response.data
            // // mock
            // await delay(800)
            // const filtered = mockOrderData.filter(
            //     (order) => order.id === orderId,
            // )[0]
            // return {
            //     success: true,
            //     data: filtered,
            // }
        },
        enabled: !!orderId,
    })
}

export const useGetOrders = (restaurantId: string, params: OrderQueries) => {
    console.log('Params in useGetOrders: ', params)
    return useQuery({
        // queryKey: ['orders', page, limit, search, status],
        queryKey: ['orders', restaurantId, params], // can comment restaurantId later
        queryFn: async () => {
            const response = await apiGetOrders({ restaurantId, params })
            return {
                orders: response.data,
                total: response.paginator.totalItems,
                success: response.success,
            }
        },
        // Call API

        // mock
        /*
            await delay(500) // simulate network
            console.log('Mock order data: ', mockOrderData)
            let filtered = mockOrderData.filter(
                (order) => order.restaurantId === restaurantId,
            )

            // ==== start filtering ======

            if (search) {
                const lower = search.toLowerCase()
                filtered = filtered.filter(
                    (order) =>
                        order.customerName.toLowerCase().includes(lower) ||
                        order.orderNumber.includes(search),
                )
            }

            if (status && status !== 'all') {
                filtered = filtered.filter((order) => order.status === status)
            }

            const start = (page - 1) * limit

            const paginated = filtered.slice(start, start + limit)

            return {
                success: true,
                orders: paginated,
                total: filtered.length,
                page: page,
                limit: limit,
            }
            */

        enabled: !!restaurantId,
    })
}

// ================ DELETE ORDER  =====================
export const deleteOrder = async (id: string) => {
    // await apiClient.delete(`/orders/${id}`)
    await delay(300)
    return { success: true }
}

// ================ CREATE ORDER  =====================
export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: OrderFormSchema) => {
            // CALL API

            await delay(800)
            const newOrder: Order = {
                ...data,
                id: `ORD-${Math.floor(Math.random() * 10000)}`,
                orderNumber: String(mockOrderData.length + 1001),
                status: 'pending',
                date: Date.now() / 1000,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            mockOrderData.unshift(newOrder)
            return newOrder
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['orders', variables.restaurantId],
            })
        },
    })
}
// ================ GET ORDER LIST =====================
// hooks/useOrderlist.ts

// export interface Order {
//     id: string
//     orderNumber: string
//     date: number // unix timestamp
//     customer: string
//     status:
//         | 'pending'
//         | 'confirmed'
//         | 'preparing'
//         | 'ready'
//         | 'completed'
//         | 'cancelled'
//     paymentMethod: string
//     paymentIdentifier: string
//     totalAmount: number
//     items: any[]
// }

// export interface OrderTableData {
//     pageIndex: number
//     pageSize: number
//     sort?: {
//         order: 'asc' | 'desc'
//         key: string
//     } //string initially
//     query?: string
//     orderStatus?: string
// }

export const useOrderList = () => {
    const { restaurantId } = useParams()
    console.log('restaurantId in useOrderList: ', restaurantId)
    const tableData = useOrderStore((state) => state.tableData)
    // const [tableData, setTableData] = useState<OrderTableData>({
    //     pageIndex: 1,
    //     pageSize: 10,
    //     query: '',
    //     orderStatus: 'all',
    // })

    // const { data, isLoading, refetch } = useQuery({
    //     queryKey: ['orders', tableData],
    //     queryFn: async () => {
    //         const params = new URLSearchParams({
    //             page: String(tableData.pageIndex),
    //             limit: String(tableData.pageSize),
    //             search: tableData.query || '',
    //             status: tableData.orderStatus !== 'all' ? tableData.orderStatus : '',
    //         })
    //         const res = await apiClient.get(`/orders?${params.toString()}`)
    //         return res.data // { orders: Order[], total: number }
    //     },
    // })

    const { data, isLoading } = useGetOrders({
        restaurantId: restaurantId!,
        // tableData
        pageIndex: tableData.pageIndex,
        pageSize: tableData.pageSize,
        query: tableData.query,
        orderStatus: tableData.status,
    })
    console.log('data: ', data)

    const orderList = data?.orders || []
    const orderListTotal = data?.total || 0

    return {
        orderList,
        orderListTotal,
        // tableData,
        // setTableData,
        isLoading,
        // refetch,
    }
}

// ================  =====================
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateOrderStatus,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({
                queryKey: ['order', variables.orderId],
            })
        },
    })
}
// ================  =====================
// ================  =====================
// ================  =====================

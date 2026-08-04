import { Order } from '@/views/order/types/order.type'
import ApiService from './ApiService'
import {
    GetOrderListResponse,
    GetOrderResponse,
    OrderStatus,
} from '@/@types/order'
// import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import { OrderQueries } from '@/store/orderStore'

export async function apiCreateOrder(
    restaurantId: string,
    data: Partial<Order>,
) {
    return ApiService.fetchDataWithAxios<Order>({
        url: `/order/create-order/${restaurantId}`,
        method: `post`,
        data,
    })
}

export async function apiGetOrder(orderId: string) {
    return ApiService.fetchDataWithAxios<GetOrderResponse>({
        url: `/order/get-order/${orderId}`,
        method: 'get',
    })
}

export async function apiGetOrders({
    restaurantId,
    params,
}: {
    restaurantId: string
    params: OrderQueries
}) {
    return ApiService.fetchDataWithAxios<GetOrderListResponse>({
        url: `/order/get-orders/${restaurantId}?`,
        method: `get`,
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            status: params.status !== 'all' ? params.status : undefined,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
            pickUpDate: params.pickUpDate || undefined,
            fromDate: params.fromDate
                ? new Date(params.fromDate).toISOString()
                : undefined,
            toDate: params.toDate
                ? new Date(params.toDate).toISOString()
                : undefined,
        },
    })
}

export async function apiUpdateOrderStatus({
    orderId,
    status,
}: {
    orderId: string
    status: OrderStatus
}) {
    return ApiService.fetchDataWithAxios({
        url: `/order/update-status/${orderId}`,
        method: `patch`,
        data: { status },
    })
}

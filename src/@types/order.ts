import { OrderQueries } from './../store/orderStore'
import { Paginator } from './common_type'
import { Dish } from './dish'

export interface GetOrdersParams extends OrderQueries {
    restaurantId: string
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    READY = 'ready',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
    NO_SHOW = 'no_show',
    CANCELED = 'canceled',
}

const legacyOrderStatusMap: Record<string, OrderStatus> = {
    accepted: OrderStatus.CONFIRMED,
    ready_for_pickup: OrderStatus.READY,
    ready_to_pickup: OrderStatus.READY,
}

const currentOrderStatuses = new Set<string>(Object.values(OrderStatus))

export const normalizeOrderStatus = (status: string): OrderStatus => {
    const normalizedStatus = legacyOrderStatusMap[status] ?? status

    return currentOrderStatuses.has(normalizedStatus)
        ? (normalizedStatus as OrderStatus)
        : OrderStatus.PENDING
}
export type OrderItem = {
    id: string
    quantity: number
    unitPrice: number
    note?: string
    dish: Dish
}

export type User = {
    id: string
    email: string
    phone: string
    name: string
    profileImage: string
    gender: string
    isVerified: boolean
    createdAt: string
    updatedAt: string
}

export type Order = {
    id: string
    scheduledDate: string
    orderNumber: string
    tax: number
    totalPrice: number
    remark?: string
    cancelledByType: 'user' | 'staff' | 'owner'
    cancelledById: string
    cancellationReason: string
    status: OrderStatus
    created_at: string
    updated_at: string

    confirmed_at?: string
    preparing_at?: string
    ready_at?: string
    completed_at?: string
    terminated_at?: string
    user: User
    items: OrderItem[]
    message: string
}

export type GetOrderListResponse = {
    success: boolean
    paginator: Paginator
    data: Order[]
    message: string
}

export type GetOrderResponse = {
    success: boolean
    data: Order
    message: string
}

/*
 <DataTable
                columns={columns}
                data={orderList}
                loading={isLoading}
                pagingData={{
                    total: orderListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Order"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={confirmDelete}
            >
                <p>
                    Are you sure you want to delete this order? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default OrderListTable
*/

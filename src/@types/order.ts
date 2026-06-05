import { OrderQueries } from './../store/orderStore'
import { Paginator } from './common_type'
import { Dish } from './dish'

export interface GetOrdersParams extends OrderQueries {
    restaurantId: string
}

export enum OrderStatus {
    CONFIRMED = 'confirmed',
    PENDING = 'pending',
    CANCELED = 'canceled',
    ACCEPTED = 'accepted',
    PREPARING = 'preparing',
    READY_FOR_PICKUP = 'ready_for_pickup',
    REJECTED = 'rejected',
    NO_SHOW = 'no_show',
    COMPLETED = 'completed',
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

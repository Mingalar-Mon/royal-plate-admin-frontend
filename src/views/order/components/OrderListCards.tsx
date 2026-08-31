import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import { useState } from 'react'
import { TbCalendarEvent, TbChevronRight } from 'react-icons/tb'
import { useUpdateOrderStatus } from '@/utils/custom-hooks/useOrder'
import { useOrderStore } from '@/store/orderStore'
import type { Order, OrderStatus } from '@/@types/order'
import OrderStatusBadge from './OrderStatusBadge'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'

interface Props {
    orderList: Order[]
    orderListTotal: number
    isLoading: boolean
}

const OrderListCards = ({ orderList, orderListTotal, isLoading }: Props) => {
    const navigate = useNavigate()
    const setTableData = useOrderStore((state) => state.setTableData)
    const tableData = useOrderStore((state) => state.tableData)
    const { mutate: updateStatus } = useUpdateOrderStatus()
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
    const [statusChangePreview, setStatusChangePreview] = useState<{
        order: Order
        newStatus: OrderStatus
    } | null>(null)

    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        setStatusChangePreview({ order, newStatus })
    }

    const confirmStatusChange = () => {
        if (!statusChangePreview) return

        const { order, newStatus } = statusChangePreview
        setStatusChangePreview(null)
        setStatusUpdatingId(order.id)
        updateStatus(
            { orderId: order.id, status: newStatus },
            { onSettled: () => setStatusUpdatingId(null) },
        )
    }

    if (isLoading) {
        return <div className="py-12 text-center text-gray-500">Loading orders...</div>
    }

    if (orderList.length === 0) {
        return <div className="py-12 text-center text-gray-500">No orders found.</div>
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {orderList.map((order) => (
                    <div
                        key={order.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <button
                                type="button"
                                className="text-left"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Order
                                </p>
                                <h5 className="text-lg font-bold text-primary hover:underline">
                                    #{order.orderNumber}
                                </h5>
                            </button>
                            <OrderStatusBadge
                                status={order.status}
                                isLoading={statusUpdatingId === order.id}
                                onChange={(status) => handleStatusChange(order, status)}
                            />
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-500">Customer</span>
                                <span className="font-semibold text-right">
                                    {order.user?.name || '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-500">Placed</span>
                                <span className="font-medium">
                                    {dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1 text-gray-500">
                                    <TbCalendarEvent /> Pick up
                                </span>
                                <span className="font-medium text-right">
                                    {dayjs(order.scheduledDate).format('DD/MM/YYYY HH:mm')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Items ({order.items?.length || 0})
                            </p>
                            <div className="space-y-1.5">
                                {(order.items || []).slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 text-sm"
                                    >
                                        <span className="min-w-0 truncate">
                                            {item.dish?.name || 'Item'}
                                        </span>
                                        <span className="shrink-0 font-semibold text-gray-500">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                ))}
                                {(order.items?.length || 0) > 3 && (
                                    <p className="text-xs text-gray-500">
                                        +{order.items.length - 3} more item(s)
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                            <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-bold text-primary">
                                    {Number(order.totalPrice || 0).toLocaleString()} MMK
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="plain"
                                icon={<TbChevronRight />}
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                View details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={orderListTotal}
                    onChange={(page) => setTableData((prev) => ({ ...prev, pageIndex: page }))}
                />
            </div>

            <Dialog
                isOpen={Boolean(statusChangePreview)}
                onClose={() => setStatusChangePreview(null)}
                onRequestClose={() => setStatusChangePreview(null)}
                width={480}
                height="min(90vh, 760px)"
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Preview Order Status Change"
            >
                {statusChangePreview && (
                    <div className="flex flex-col gap-5 p-4">
                        <div className="shrink-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Order
                            </p>
                            <h5 className="mt-1 text-xl font-bold text-primary">
                                #{statusChangePreview.order.orderNumber}
                            </h5>
                        </div>

                        <div className="shrink-0 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-gray-500">Current status</span>
                                <OrderStatusBadge
                                    status={statusChangePreview.order.status}
                                    onChange={() => undefined}
                                />
                            </div>
                            <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-gray-500">New status</span>
                                <OrderStatusBadge
                                    status={statusChangePreview.newStatus}
                                    onChange={() => undefined}
                                />
                            </div>
                        </div>

                        {statusChangePreview.order.remark && (
                            <div className="shrink-0 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                <p className="mb-1 font-semibold">Order note</p>
                                <p className="whitespace-pre-wrap break-words">
                                    {statusChangePreview.order.remark}
                                </p>
                            </div>
                        )}

                        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                            <p className="mb-3 shrink-0 text-amber-800 text-sm font-semibold">
                                Order items ({statusChangePreview.order.items?.length || 0})
                            </p>
                            <div className="max-h-[35vh] space-y-3 overflow-y-auto pb-2">
                                {(statusChangePreview.order.items || []).length > 0 ? (
                                    statusChangePreview.order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 text-sm last:border-b-0 dark:border-gray-700"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-amber-800 truncate font-medium">
                                                    {item.dish?.name || 'Item'}
                                                </p>
                                                {item.note && (
                                                    <p className="truncate text-xs text-gray-500">
                                                        {item.note}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="font-semibold">x{item.quantity}</p>
                                                <p className="text-xs font-semibold text-green-500">
                                                    {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()} MMK
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No items found.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="default"
                                onClick={() => setStatusChangePreview(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="solid"
                                onClick={confirmStatusChange}
                            >
                                Change status
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default OrderListCards

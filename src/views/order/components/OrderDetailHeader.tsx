import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import dayjs from 'dayjs'
import { TbCalendar, TbClock } from 'react-icons/tb'
import { Order, OrderStatus } from '@/@types/order'
import { useUpdateOrderStatus } from '@/utils/custom-hooks/useOrder'
import OrderStatusBadge from './OrderStatusBadge'

interface OrderDetailHeaderProps {
    order: Order
}

const OrderDetailHeader = ({ order }: OrderDetailHeaderProps) => {
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

    const handleStatusChange = (newStatus: string) => {
        updateStatus(
            { orderId: order.id, status: newStatus as OrderStatus },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Status updated">
                            Order status has been updated successfully.
                        </Notification>,
                    )
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger" title="Update failed">
                            Could not update order status. Please try again.
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="mb-0">
                            Order #{order.orderNumber || order.id.slice(0, 8)}
                        </h3>
                        <OrderStatusBadge
                            status={order.status}
                            onChange={handleStatusChange}
                            isLoading={isPending}
                        />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {order.created_at && (
                            <span className="inline-flex items-center gap-1.5">
                                <TbClock className="text-base" />
                                Created{' '}
                                {dayjs(order.created_at).format(
                                    'DD/MM/YYYY HH:mm',
                                )}
                            </span>
                        )}
                        {order.updated_at && (
                            <span className="inline-flex items-center gap-1.5">
                                Updated{' '}
                                {dayjs(order.updated_at).format(
                                    'DD/MM/YYYY HH:mm',
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {order.scheduledDate && (
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-700/60 px-4 py-3 sm:text-right">
                        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                            Scheduled pickup
                        </div>
                        <div className="inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                            <TbCalendar className="text-base" />
                            {dayjs(order.scheduledDate).format(
                                'DD/MM/YYYY HH:mm',
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default OrderDetailHeader

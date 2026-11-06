import { useNavigate, useParams } from 'react-router'
import Loading from '@/components/shared/Loading'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import OrderDetailProducts from '../components/OrderDetailProducts'
import OrderDetailPayment from '../components/OrderDetailPayment'
import OrderDetailCustomer from '../components/OrderDetailCustomer'
import OrderDetailNote from '../components/OrderDetailNote'
import OrderDetailMeta from '../components/OrderDetailMeta'
import OrderDetailsActivities from '../components/OrderDetailsActivity'
import { useGetOrder } from '@/utils/custom-hooks/useOrder'
import { Container } from '@/components/shared'
import { Button } from '@/components/ui'
import { TbArrowNarrowLeft, TbCalendarEvent, TbClock, TbHash } from 'react-icons/tb'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { useUpdateOrderStatus } from '@/utils/custom-hooks/useOrder'
import { OrderStatus } from '@/@types/order'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { toRestaurantTime } from '@/utils/orderDate'
import dayjs from 'dayjs'

const OrderDetails = () => {
    const { orderId, restaurantId } = useParams()
    const navigate = useNavigate()
    const { data: order, isLoading, refetch } = useGetOrder(orderId!)
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

    const handleStatusChange = (newStatus: string) => {
        updateStatus(
            { orderId: order!.id, status: newStatus as OrderStatus },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Status updated">
                            Order status has been updated successfully.
                        </Notification>,
                    )
                    refetch()
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

    if (isLoading) {
        return (
            <Container>
                <div className="py-6 space-y-6">
                    <Skeleton width={180} height={36} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton width="100%" height={200} />
                            <Skeleton width="100%" height={300} />
                        </div>
                        <div className="space-y-6">
                            <Skeleton width="100%" height={150} />
                            <Skeleton width="100%" height={150} />
                            <Skeleton width="100%" height={200} />
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    if (!order) {
        return (
            <Container>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Card bodyClass="p-8">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                No order found
                            </p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                This order may have been removed or the link is invalid.
                            </p>
                            <Button
                                className="mt-4"
                                variant="solid"
                                icon={<TbArrowNarrowLeft />}
                                onClick={() => navigate(`/restaurants/${restaurantId}/orders`)}
                            >
                                Back to Orders
                            </Button>
                        </div>
                    </Card>
                </div>
            </Container>
        )
    }

    const items = order.items ?? []
    const lineSubtotal = items.reduce(
        (sum, item) =>
            sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
        0,
    )
    const tax = Number(order.tax) || 0
    const total = Number(order.totalPrice) || 0
    const subtotal = lineSubtotal > 0 ? lineSubtotal : Math.max(total - tax, 0)

    const normalisedOrder = {
        status: order.status,
        created_at: order.created_at,
        confirmed_at: order.confirmed_at,
        preparing_at: order.preparing_at,
        ready_at: order.ready_at,
        completed_at: order.completed_at,
        terminated_at: order.terminated_at,
    }

    return (
        <Container>
            <div className="py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center">
                    <Button
                        variant="plain"
                        size="sm"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/orders`)
                        }
                    >
                        Back to Orders
                    </Button>
                </div>

                {/* Title Card */}
                <Card
                    className="border-none bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                    bodyClass="p-5"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                <TbCalendarEvent className="text-sm" />
                                Order Details
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                #{order.orderNumber || order.id.slice(0, 8)}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <TbClock className="text-base" />
                                    {toRestaurantTime(order.created_at)?.format('DD/MM/YYYY HH:mm')}
                                </span>
                                {order.scheduledDate && (
                                    <span className="flex items-center gap-1.5">
                                        <TbHash className="text-base" />
                                        Pickup: {toRestaurantTime(order.scheduledDate)?.format('DD/MM/YYYY HH:mm')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <OrderStatusBadge
                            status={order.status}
                            onChange={handleStatusChange}
                            isLoading={isPending}
                        />
                    </div>
                </Card>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column */}
                    <div className="flex-1 space-y-6">
                        <OrderDetailProducts items={items} />
                        <OrderDetailsActivities
                            order={normalisedOrder}
                            status={order.status}
                            createdAt={order.created_at}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-[380px] space-y-6">
                        <OrderDetailCustomer user={order.user} />
                        <OrderDetailPayment
                            subtotal={subtotal}
                            tax={tax}
                            total={total}
                        />
                        <OrderDetailNote notes={order.message} />
                        <OrderDetailMeta order={order} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default OrderDetails

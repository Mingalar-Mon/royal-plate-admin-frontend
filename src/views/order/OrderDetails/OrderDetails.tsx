import { useNavigate, useParams } from 'react-router'
import Loading from '@/components/shared/Loading'
import OrderDetailProducts from '../components/OrderDetailProducts'
import OrderDetailPayment from '../components/OrderDetailPayment'
import OrderDetailCustomer from '../components/OrderDetailCustomer'
import OrderDetailNote from '../components/OrderDetailNote'
import OrderDetailMeta from '../components/OrderDetailMeta'
import OrderDetailHeader from '../components/OrderDetailHeader'
import OrderDetailsActivities from '../components/OrderDetailsActivity'
import { useGetOrder } from '@/utils/custom-hooks/useOrder'
import { Container } from '@/components/shared'
import { Button } from '@/components/ui'
import { TbArrowNarrowLeft } from 'react-icons/tb'

const OrderDetails = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { data: order, isLoading } = useGetOrder(orderId!)

    if (isLoading) return <Loading loading={true} />

    if (!order) {
        return (
            <Container>
                <div className="py-16 text-center space-y-4">
                    <h4>No order found</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                        This order may have been removed or the link is invalid.
                    </p>
                    <Button
                        variant="solid"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate(-1)}
                    >
                        Back to Orders
                    </Button>
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
    const subtotal =
        lineSubtotal > 0 ? lineSubtotal : Math.max(total - tax, 0)

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
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate(-1)}
                    >
                        Back to Orders
                    </Button>
                </div>

                <div className="space-y-6">
                    <OrderDetailHeader order={order} />

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-6">
                            <OrderDetailProducts items={items} />
                            <OrderDetailPayment
                                subtotal={subtotal}
                                tax={tax}
                                total={total}
                            />
                            <OrderDetailsActivities
                                order={normalisedOrder}
                                status={order.status}
                                createdAt={order.created_at}
                            />
                        </div>
                        <div className="lg:w-[360px] space-y-6">
                            <OrderDetailCustomer user={order.user} />
                            <OrderDetailNote notes={order.message} />
                            <OrderDetailMeta order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default OrderDetails

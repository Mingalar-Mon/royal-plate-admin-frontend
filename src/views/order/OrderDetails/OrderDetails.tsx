// OrderDetails.tsx
import { useNavigate, useParams } from 'react-router'
import Loading from '@/components/shared/Loading'
import OrderDetailProducts from '../components/OrderDetailProducts'
import OrderDetailPayment from '../components/OrderDetailPayment'
import OrderDetailCustomer from '../components/OrderDetailCustomer'
import OrderDetailNote from '../components/OrderDetailNote'
import OrderDetailsActivities from '../components/OrderDetailsActivity'
import { useGetOrder } from '@/utils/custom-hooks/useOrder'
import { Container } from '@/components/shared'
import { Button } from '@/components/ui'
import { TbArrowLeft } from 'react-icons/tb'

const OrderDetails = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { data: order, isLoading } = useGetOrder(orderId!)

    if (isLoading) return <Loading loading={true} />

    // const order = orderResponse?.data
    if (!order) return <div>No order found</div>

    const subtotal = Number(order.totalPrice) - Number(order.tax)

    console.log('Order', order)

    return (
        <Container>
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="plain"
                        icon={<TbArrowLeft />}
                        onClick={() => navigate(-1)}
                    >
                        Bact to Orders
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                        <OrderDetailProducts items={order.items} />
                        <OrderDetailPayment
                            subtotal={subtotal}
                            tax={order.tax}
                            total={order.totalPrice}
                            // paymentMethod={order.paymentMethod}
                            // paymentStatus={order.paymentStatus}
                        />
                        <OrderDetailsActivities
                            status={order.status}
                            createdAt={order.created_at}
                        />
                    </div>
                    <div className="lg:w-[360px] space-y-4">
                        <OrderDetailCustomer
                            user={order.user}
                            // customer={order.customerName}
                            // phone={order.customerPhone}
                            // orderType={order.orderType}
                            // address={order.address}
                        />
                        <OrderDetailNote notes={order.message} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default OrderDetails

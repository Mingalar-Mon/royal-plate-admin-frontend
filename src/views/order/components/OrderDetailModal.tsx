import Dialog from '@/components/ui/Dialog'
import type { Order } from '@/@types/order'
import OrderDetailHeader from './OrderDetailHeader'
import OrderDetailProducts from './OrderDetailProducts'
import OrderDetailPayment from './OrderDetailPayment'
import OrderDetailCustomer from './OrderDetailCustomer'
import OrderDetailNote from './OrderDetailNote'
import OrderDetailMeta from './OrderDetailMeta'
import OrderDetailsActivities from './OrderDetailsActivity'

interface OrderDetailModalProps {
    order: Order | null
    onClose: () => void
}

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
    if (!order) return null

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
        <Dialog
            isOpen={Boolean(order)}
            width={900}
            contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="space-y-6 p-6">
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
        </Dialog>
    )
}

export default OrderDetailModal

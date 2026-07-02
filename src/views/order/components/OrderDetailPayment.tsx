// components/OrderDetailPayment.tsx
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { NumericFormat } from 'react-number-format'
import { paymentStatusMap } from '@/utils/Status/paymentStatus'

interface OrderDetailPaymentProps {
    subtotal: number
    tax: number
    total: number
    paymentMethod?: string
}
const OrderDetailPayment = ({
    subtotal,
    tax,
    total,
    // paymentMethod,
    // paymentStatus,
}: OrderDetailPaymentProps) => {
    return (
        <Card>
            <div className="flex items-center gap-2 mb-6">
                <h4>Payment</h4>

                {/*      Add this after passing payment status        
                <Tag className={paymentStatusMap[paymentStatus]?.bgClass}>
                    <span
                        className={paymentStatusMap[paymentStatus]?.textClass}
                    >
                        {paymentStatusMap[paymentStatus]?.label}
                    </span>
                </Tag> */}
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={subtotal}
                            prefix="MMK "
                        />
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={tax}
                            prefix="MMK "
                        />
                    </span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={total}
                            prefix="MMK "
                        />
                    </span>
                </div>
                <hr />
                {/* <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="capitalize">{paymentMethod}</span>
                </div> */}
            </div>
        </Card>
    )
}

export default OrderDetailPayment

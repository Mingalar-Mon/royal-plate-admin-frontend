import Card from '@/components/ui/Card'
import { TbCalculator } from 'react-icons/tb'

interface OrderDetailPaymentProps {
    subtotal: number
    tax: number
    total: number
    paymentMethod?: string
}

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? Math.trunc(n).toLocaleString() : '0'
}

const formatCurrency = (value: number | null | undefined) =>
    `${formatNumber(value)} MMK`

const OrderDetailPayment = ({
    subtotal,
    tax,
    total,
}: OrderDetailPaymentProps) => {
    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbCalculator className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Payment Summary
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Subtotal
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(subtotal)}
                    </span>
                </div>

                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tax
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(tax)}
                    </span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default OrderDetailPayment

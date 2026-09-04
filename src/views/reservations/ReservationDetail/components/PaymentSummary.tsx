import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'

interface PaymentSummaryProps {
    subTotal?: number | string
    tax?: number | string
    total?: number | string
}

const formatAmount = (value?: number | string) => (
    <NumericFormat
        thousandSeparator
        displayType="text"
        value={Number(value) || 0}
        prefix="MMK "
    />
)

const PaymentSummary = ({ subTotal, tax, total }: PaymentSummaryProps) => {
    return (
        <Card>
            <h4 className="mb-5">Payment Summary</h4>
            <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatAmount(subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Tax</span>
                    <span>{formatAmount(tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="font-bold text-base">Total</span>
                    <span className="font-bold text-lg heading-text">
                        {formatAmount(total)}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default PaymentSummary

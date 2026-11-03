import Card from '@/components/ui/Card'
import { TbCalculator } from 'react-icons/tb'
import { Reservation } from '@/services/ReservationService'

const formatNumber = (value: number | string | null | undefined) => {
    const numericValue = Number(value ?? 0)
    return Number.isFinite(numericValue) ? Math.trunc(numericValue).toLocaleString() : '0'
}

const formatCurrency = (value: number | string | null | undefined) =>
    `${formatNumber(value)} MMK`

interface PaymentSummaryProps {
    reservation: Reservation
}

const PaymentSummary = ({ reservation }: PaymentSummaryProps) => {
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
                        {formatCurrency(reservation.subTotal)}
                    </span>
                </div>

                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tax
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(reservation.tax)}
                    </span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Price
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(reservation.totalPrice)}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Settlement Status
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            reservation.isSettle
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                            {reservation.isSettle ? 'Settled' : 'Unsettled'}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default PaymentSummary

import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'

interface PaymentSummaryProps {
    subTotal?: number | string
    tax?: number | string
    tableFee?: number | string
    total?: number | string
    commission_fee?: number | string
    /** The amount the commission rate was applied to. */
    commissionBase?: number | string | null
    /** The rate as a fraction — 0.1 means 10%. */
    commissionRate?: number | string | null
    netAmount?: number | string
}

const formatAmount = (value?: number | string | null) => (
    <NumericFormat
        thousandSeparator
        displayType="text"
        value={Number(value) || 0}
        prefix="MMK "
    />
)

/** The stored rate is a fraction, so 0.1 renders as 10%. */
const formatRate = (rate?: number | string | null) => {
    if (rate === null || rate === undefined || rate === '') return '0%'
    const parsed = Number(rate)
    if (!Number.isFinite(parsed)) return '0%'
    return `${Number((parsed * 100).toFixed(2))}%`
}

const SummaryRow = ({
    label,
    value,
    muted,
}: {
    label: string
    value: React.ReactNode
    muted?: boolean
}) => (
    <div
        className={`flex justify-between text-sm ${
            muted
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-300'
        }`}
    >
        <span>{label}</span>
        <span className="whitespace-nowrap">{value}</span>
    </div>
)

const PaymentSummary = ({
    subTotal,
    tax,
    tableFee,
    total,
    commission_fee,
    commissionBase,
    commissionRate,
    netAmount,
}: PaymentSummaryProps) => {
    // A missing batch is a neutral "no fee", not an error — show it plainly.
    const hasCommission =
        commission_fee !== undefined ||
        commissionBase !== undefined ||
        commissionRate !== undefined

    return (
        <Card>
            <h4 className="mb-5">Payment Summary</h4>
            <div className="space-y-3">
                <SummaryRow label="Table Fee" value={formatAmount(tableFee)} />
                <SummaryRow label="Subtotal" value={formatAmount(subTotal)} />
                <SummaryRow label="Tax" value={formatAmount(tax)} />

                {hasCommission && (
                    <div className="space-y-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                        <SummaryRow
                            muted
                            label="Commission base"
                            value={formatAmount(commissionBase)}
                        />
                        <SummaryRow
                            muted
                            label="Commission rate"
                            value={formatRate(commissionRate)}
                        />
                        <SummaryRow
                            label="Commission fee"
                            value={formatAmount(commission_fee)}
                        />
                    </div>
                )}

                {netAmount !== undefined && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Net amount (after commission)</span>
                        <span className="font-semibold">
                            {formatAmount(netAmount)}
                        </span>
                    </div>
                )}

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

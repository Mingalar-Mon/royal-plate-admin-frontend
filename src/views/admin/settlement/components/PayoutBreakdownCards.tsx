import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { TbCalendarPlus, TbUsers } from 'react-icons/tb'
import type { PayoutPreview } from '@/@types/payout'

const Money = ({ value }: { value: string | null | undefined }) => {
    if (value === null || value === undefined || value === '') {
        return <span className="text-gray-400">—</span>
    }
    return (
        <NumericFormat
            thousandSeparator
            displayType="text"
            value={Number(value)}
            prefix="MMK "
        />
    )
}

const Column = ({
    title,
    count,
    subTotal,
    commission,
    netAmount,
    emptyLabel,
}: {
    title: string
    count: number
    subTotal: string
    commission: string
    netAmount: string
    emptyLabel: string
}) => {
    const hasRows = count > 0

    return (
        <Card bodyClass="p-4" className="flex-1">
            <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h4>
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <TbUsers className="text-sm" />
                    {count}
                </span>
            </div>

            {!hasRows ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {emptyLabel}
                </p>
            ) : (
                <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Sub-total
                        </dt>
                        <dd className="whitespace-nowrap text-gray-700 dark:text-gray-200">
                            <Money value={subTotal} />
                        </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Commission
                        </dt>
                        <dd className="whitespace-nowrap font-semibold text-amber-600 dark:text-amber-400">
                            <Money value={commission} />
                        </dd>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-gray-100 pt-1.5 dark:border-gray-700">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Net amount
                        </dt>
                        <dd className="whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">
                            <Money value={netAmount} />
                        </dd>
                    </div>
                </dl>
            )}
        </Card>
    )
}

/**
 * Orders and reservations are charged different rates, and reservations may
 * be charged on the table fee alone. Rendering one blended figure would hide
 * that, so the split is shown per scope.
 */
const PayoutBreakdownCards = ({
    breakdown,
}: {
    breakdown: PayoutPreview['breakdown']
}) => {
    return (
        <div className="flex flex-col gap-3 lg:flex-row">
            <Column
                title="Orders"
                count={breakdown.orderCount}
                subTotal={breakdown.orderSubTotal}
                commission={breakdown.orderCommission}
                netAmount={breakdown.orderNetAmount}
                emptyLabel="No orders in this range."
            />
            <Column
                title="Reservations"
                count={breakdown.reservationCount}
                subTotal={breakdown.reservationSubTotal}
                commission={breakdown.reservationCommission}
                netAmount={breakdown.reservationNetAmount}
                emptyLabel="No reservations in this range."
            />
        </div>
    )
}

interface PayoutCountsStripProps {
    itemCount: number
    alreadySettled: number
}

/**
 * `alreadySettled` is the usual reason a payout comes in below expectations:
 * an earlier payout already took those rows.
 */
const PayoutCountsStrip = ({
    itemCount,
    alreadySettled,
}: PayoutCountsStripProps) => (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
        <span className="flex items-center gap-1.5">
            <TbCalendarPlus className="text-lg text-gray-400" />
            <span className="font-semibold">{itemCount}</span>
            {itemCount === 1 ? 'row' : 'rows'} to settle
        </span>
        {alreadySettled > 0 && (
            <span className="font-medium text-amber-600 dark:text-amber-400">
                {alreadySettled} already settled in this range (
                {alreadySettled === 1 ? 'it is' : 'they are'} excluded)
            </span>
        )}
    </div>
)

export { PayoutCountsStrip }
export default PayoutBreakdownCards

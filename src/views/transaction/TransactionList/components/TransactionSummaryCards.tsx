import type { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { TbCash, TbPercentage, TbReceipt2 } from 'react-icons/tb'
import type { TransactionSummary } from '@/@types/transaction'

type Tone = 'emerald' | 'blue' | 'amber'

const toneStyles: Record<
    Tone,
    { icon: string; value: string; soft: string }
> = {
    emerald: {
        icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        value: 'text-emerald-700 dark:text-emerald-300',
        soft: 'bg-emerald-500/5',
    },
    blue: {
        icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        value: 'text-blue-700 dark:text-blue-300',
        soft: 'bg-blue-500/5',
    },
    amber: {
        icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        value: 'text-amber-700 dark:text-amber-300',
        soft: 'bg-amber-500/5',
    },
}

type SummaryCardProps = {
    label: string
    description: string
    value?: number
    icon: ReactNode
    tone: Tone
}

const SummaryCard = ({
    label,
    description,
    value,
    icon,
    tone,
}: SummaryCardProps) => {
    const styles = toneStyles[tone]

    return (
        <Card
            className={`border-t-[3px] border-gold ${styles.soft}`}
            bodyClass="p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        {label}
                    </p>
                    <p
                        className={`mt-3 text-2xl font-bold tracking-tight ${styles.value}`}
                    >
                        {value === undefined ? (
                            <span className="text-gray-400">—</span>
                        ) : (
                            <NumericFormat
                                thousandSeparator
                                displayType="text"
                                value={Number(value)}
                                prefix="MMK "
                            />
                        )}
                    </p>
                </div>
                <div
                    className={`shrink-0 rounded-2xl p-3 text-xl ${styles.icon}`}
                >
                    {icon}
                </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {description}
            </p>
        </Card>
    )
}

const TransactionSummaryCards = ({
    summary,
    loading,
}: {
    summary?: TransactionSummary
    loading: boolean
}) => {
    const value = loading ? undefined : summary

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
                label="Total revenue"
                description="Sum of total prices for the selected period"
                value={value?.totalPrice}
                icon={<TbCash />}
                tone="emerald"
            />
            <SummaryCard
                label="Sub-total"
                description="Pre-tax, pre-commission total for the selected period"
                value={value?.subTotal}
                icon={<TbReceipt2 />}
                tone="blue"
            />
            <SummaryCard
                label="Commission fees"
                description="Commission earned for the selected period"
                value={value?.commission_fee}
                icon={<TbPercentage />}
                tone="amber"
            />
        </div>
    )
}

export default TransactionSummaryCards
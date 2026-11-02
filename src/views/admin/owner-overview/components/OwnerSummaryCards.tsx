import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import {
    TbCoin,
    TbShoppingBag,
    TbCalendarCheck,
    TbChartBar,
    TbPercentage,
} from 'react-icons/tb'
import type { OwnerOverviewSummary } from '@/@types/dashboard'

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? n.toLocaleString() : '0'
}

const formatCurrency = (value: number | null | undefined) =>
    `${formatNumber(value)} MMK`

type Props = {
    summary?: OwnerOverviewSummary
    loading?: boolean
}

const OwnerSummaryCards = ({ summary, loading }: Props) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} bodyClass="p-5">
                        <div className="space-y-3">
                            <Skeleton width={100} height={12} />
                            <Skeleton width={80} height={28} />
                            <Skeleton width="60%" height={10} />
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    const cards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(summary?.totalPrice),
            icon: TbCoin,
            color: 'primary',
            bgColor: 'bg-primary/10',
            textColor: 'text-primary',
            borderColor: 'border-l-primary',
        },
        {
            title: 'Commission',
            value: formatCurrency(summary?.commission_fee),
            icon: TbPercentage,
            color: 'orange',
            bgColor: 'bg-orange-500/10',
            textColor: 'text-orange-600 dark:text-orange-400',
            borderColor: 'border-l-orange-500',
        },
        {
            title: 'Net Amount',
            value: formatCurrency(summary?.netAmount),
            icon: TbChartBar,
            color: 'emerald',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            borderColor: 'border-l-emerald-500',
        },
        {
            title: 'Total Orders',
            value: formatNumber(summary?.orderCount),
            icon: TbShoppingBag,
            color: 'blue',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-l-blue-500',
        },
        {
            title: 'Total Reservations',
            value: formatNumber(summary?.reservationCount),
            icon: TbCalendarCheck,
            color: 'amber',
            bgColor: 'bg-amber-500/10',
            textColor: 'text-amber-600 dark:text-amber-400',
            borderColor: 'border-l-amber-500',
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((card) => (
                <Card
                    key={card.title}
                    className={`border-l-4 ${card.borderColor}`}
                    bodyClass="p-5"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {card.title}
                            </p>
                            <p className={`mt-2 text-xl font-bold ${card.textColor}`}>
                                {card.value}
                            </p>
                        </div>
                        <div className={`rounded-xl ${card.bgColor} ${card.textColor} p-2.5`}>
                            <card.icon className="text-xl" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default OwnerSummaryCards

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

type MetricProps = {
    title: string
    value: string
    accent: string
    icon: React.ComponentType<{ className?: string }>
    subtitle?: string
}

const Metric = ({ title, value, accent, icon: Icon, subtitle }: MetricProps) => (
    <Card
        bodyClass="p-4"
        className="relative overflow-hidden"
    >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary opacity-40" />
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{title}</span>
            </div>
            <p
                className={`text-2xl font-extrabold tracking-tight ${
                    accent === 'primary'
                        ? 'text-gray-900 dark:text-white'
                        : accent
                }`}
            >
                {value}
            </p>
            {subtitle && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {subtitle}
                </p>
            )}
        </div>
    </Card>
)

type Props = {
    summary?: OwnerOverviewSummary
    loading?: boolean
}

const OwnerSummaryCards = ({ summary, loading }: Props) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} bodyClass="p-4">
                        <div className="space-y-3">
                            <Skeleton width={70} height={10} />
                            <Skeleton width="70%" height={30} />
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    const totalPrice = formatCurrency(summary?.totalPrice)
    const subTotal = formatCurrency(summary?.subTotal)
    const commission = formatCurrency(summary?.commission_fee)
    const netAmount = formatCurrency(summary?.netAmount)
    const orderCount = formatNumber(summary?.orderCount)
    const reservationCount = formatNumber(summary?.reservationCount)

    const commissionRate =
        summary?.totalPrice && summary?.totalPrice > 0
            ? (summary.commission_fee / summary.totalPrice) * 100
            : 0

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Metric
                title="Total Revenue"
                value={totalPrice}
                accent="text-primary"
                icon={TbCoin}
                subtitle={subTotal}
            />
            <Metric
                title="Commission"
                value={commission}
                accent="text-orange-500 dark:text-orange-400"
                icon={TbPercentage}
                subtitle={`${commissionRate.toFixed(1)}% of revenue`}
            />
            <Metric
                title="Net Amount"
                value={netAmount}
                accent="text-emerald-600 dark:text-emerald-400"
                icon={TbChartBar}
                subtitle={
                    summary?.totalPrice && summary?.totalPrice > 0
                        ? `${((summary.netAmount / summary.totalPrice) * 100).toFixed(1)}% of revenue`
                        : undefined
                }
            />
            <Metric
                title="Total Orders"
                value={orderCount}
                accent="text-blue-600 dark:text-blue-400"
                icon={TbShoppingBag}
            />
            <Metric
                title="Total Reservations"
                value={reservationCount}
                accent="text-amber-600 dark:text-amber-400"
                icon={TbCalendarCheck}
            />
        </div>
    )
}

export default OwnerSummaryCards

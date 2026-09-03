import { useEffect, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import Container from '@/components/shared/Container'
import Chart from '@/components/shared/Chart'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Skeleton from '@/components/ui/Skeleton'
import {
    TbArrowNarrowLeft,
    TbCalendarCheck,
    TbCalendarClock,
    TbChefHat,
    TbCircleCheck,
    TbClock,
    TbCoin,
    TbDatabaseOff,
    TbRefresh,
    TbShoppingBag,
    TbSparkles,
    TbUsers,
} from 'react-icons/tb'
import {
    useGetDashboardEDA,
    useGetTopCustomers,
    useGetTopSaleDishes,
} from '@/utils/custom-hooks/useDashboard'
import { useGetRestaurant } from '@/utils/custom-hooks/useRestaurant'
import { useRestaurantStore } from '@/store/restaurantStore'

type Tone = 'emerald' | 'amber' | 'blue' | 'orange' | 'violet'

type StatCardProps = {
    label: string
    value: number
    description: string
    icon: ReactNode
    tone: Tone
    valueFormatter?: (value: number) => string
}

type CustomerRow = {
    userId: string
    name: string
    email: string
    metric: number
}

const toneStyles: Record<
    Tone,
    { icon: string; bar: string; value: string; soft: string }
> = {
    emerald: {
        icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500',
        value: 'text-emerald-700 dark:text-emerald-300',
        soft: 'bg-emerald-500/5',
    },
    amber: {
        icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        bar: 'bg-amber-500',
        value: 'text-amber-700 dark:text-amber-300',
        soft: 'bg-amber-500/5',
    },
    blue: {
        icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        bar: 'bg-blue-500',
        value: 'text-blue-700 dark:text-blue-300',
        soft: 'bg-blue-500/5',
    },
    orange: {
        icon: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        bar: 'bg-orange-500',
        value: 'text-orange-700 dark:text-orange-300',
        soft: 'bg-orange-500/5',
    },
    violet: {
        icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        bar: 'bg-violet-500',
        value: 'text-violet-700 dark:text-violet-300',
        soft: 'bg-violet-500/5',
    },
}

const formatNumber = (value: number | string | null | undefined) => {
    const numericValue = Number(value ?? 0)
    return Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0'
}

const formatCurrency = (value: number | string | null | undefined) =>
    `${formatNumber(value)} MMK`

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()

const StatCard = ({
    label,
    value,
    description,
    icon,
    tone,
    valueFormatter = formatNumber,
}: StatCardProps) => {
    const styles = toneStyles[tone]

    return (
        <Card
            className={`group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-gold ${styles.soft}`}
            bodyClass="p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        {label}
                    </p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-primary dark:text-gold-light sm:text-3xl">
                        {valueFormatter(value)}
                    </p>
                </div>
                <div
                    className={`shrink-0 rounded-2xl p-3 text-xl transition-transform duration-200 group-hover:scale-105 ${styles.icon}`}
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

const TableSkeleton = ({ rows = 4 }: { rows?: number }) => (
    <div className="space-y-4 py-2" aria-label="Loading data">
        {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
                <Skeleton variant="circle" width={32} height={32} />
                <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton width="45%" height={12} />
                    <Skeleton width="65%" height={10} />
                </div>
                <Skeleton width={48} height={12} />
            </div>
        ))}
    </div>
)

const EmptyState = ({
    title,
    description,
}: {
    title: string
    description: string
}) => (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-5 text-center dark:border-gray-700">
        <div className="rounded-2xl bg-gray-100 p-3 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <TbDatabaseOff className="text-2xl" />
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {title}
        </p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500 dark:text-gray-400">
            {description}
        </p>
    </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 px-5 text-center dark:border-red-900/50 dark:bg-red-950/10">
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            Couldn’t load this section
        </p>
        <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
            Please try again. Your other dashboard data is still available.
        </p>
        <Button
            className="mt-4"
            size="sm"
            variant="default"
            icon={<TbRefresh />}
            onClick={onRetry}
        >
            Try again
        </Button>
    </div>
)

const CustomerTable = ({
    title,
    metricLabel,
    customers,
    loading,
    error,
    onRetry,
}: {
    title: string
    metricLabel: string
    customers: CustomerRow[]
    loading: boolean
    error: boolean
    onRetry: () => void
}) => (
    <Card
        className="h-full"
        header={{
            content: (
                <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {title}
                    </h4>
                    <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                        Ranked by {metricLabel.toLowerCase()}
                    </p>
                </div>
            ),
            bordered: false,
            className: 'px-5 py-4',
        }}
        bodyClass="px-5 pb-5 pt-0"
    >
        {loading ? (
            <TableSkeleton rows={3} />
        ) : error ? (
            <ErrorState onRetry={onRetry} />
        ) : customers.length === 0 ? (
            <EmptyState
                title="No customer activity yet"
                description="Customer insights will appear here as orders and reservations come in."
            />
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                    <caption className="sr-only">{title}</caption>
                    <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 dark:border-gray-700">
                            <th className="py-3 pr-4 font-semibold" scope="col">
                                Customer
                            </th>
                            <th
                                className="hidden py-3 pr-4 font-semibold sm:table-cell"
                                scope="col"
                            >
                                Contact
                            </th>
                            <th
                                className="py-3 text-right font-semibold"
                                scope="col"
                            >
                                {metricLabel}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr
                                key={customer.userId}
                                className="border-b border-gray-100 last:border-0 dark:border-gray-700/70"
                            >
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            size={32}
                                            className="shrink-0 bg-primary/10 text-xs font-bold text-primary"
                                        >
                                            {getInitials(customer.name)}
                                        </Avatar>
                                        <span className="max-w-[150px] truncate font-medium text-gray-800 dark:text-gray-200">
                                            {customer.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="hidden max-w-[180px] truncate py-3 pr-4 text-gray-500 sm:table-cell dark:text-gray-400">
                                    {customer.email}
                                </td>
                                <td className="py-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                                    {formatNumber(customer.metric)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </Card>
)

const EdaDashboard = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const setActiveRestaurant = useRestaurantStore(
        (state) => state.setActiveRestaurant,
    )

    const {
        data: restaurantResponse,
        isLoading: restaurantLoading,
        isError: restaurantError,
        refetch: refetchRestaurant,
    } = useGetRestaurant(restaurantId ?? '')
    const {
        data: edaData,
        isLoading: edaLoading,
        isError: edaError,
        refetch: refetchEda,
    } = useGetDashboardEDA(restaurantId ?? '')
    const {
        data: topSaleDishes,
        isLoading: dishesLoading,
        isError: dishesError,
        refetch: refetchDishes,
    } = useGetTopSaleDishes(restaurantId ?? '')
    const {
        data: topCustomers,
        isLoading: customersLoading,
        isError: customersError,
        refetch: refetchCustomers,
    } = useGetTopCustomers(restaurantId ?? '')

    const stats = edaData?.data
    const pendingOrders = stats?.todayPendingOrder ?? 0
    const confirmedOrders = stats?.todayComfirmedOrder ?? 0
    const pendingReservations = stats?.todayPendingReservation ?? 0
    const confirmedReservations = stats?.todayComfirmedReservation ?? 0
    const completedOrders = stats?.todayCompletedOrder ?? 0
    const completedOrderRevenue = stats?.todayCompletedOrderTotalPrice ?? 0
    const completedReservations = stats?.todayCompletedReservation ?? 0
    const completedReservationRevenue =
        stats?.todayCompletedReservationTotalPrice ?? 0
    const totalOrders = pendingOrders + confirmedOrders + completedOrders
    const totalReservations =
        pendingReservations + confirmedReservations + completedReservations
    const totalCompletedRevenue =
        completedOrderRevenue + completedReservationRevenue
    const restaurantName =
        restaurantResponse?.data?.name || 'Restaurant workspace'
    const today = dayjs().format('dddd, DD MMM YYYY')
    const refreshing =
        restaurantLoading || edaLoading || dishesLoading || customersLoading

    const activityChartOptions: ApexOptions = {
        chart: {
            stacked: true,
            toolbar: { show: false },
        },
        colors: ['#f59e0b', '#2a85ff', '#10b981'],
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '48%',
            },
        },
        xaxis: {
            categories: ['Orders', 'Reservations'],
            labels: {
                formatter: (value) => formatNumber(value),
            },
        },
        yaxis: {
            labels: {
                style: { fontWeight: 600 },
            },
        },
        dataLabels: { enabled: false },
        legend: {
            position: 'bottom',
            horizontalAlign: 'left',
            itemMargin: { horizontal: 12 },
        },
        tooltip: {
            y: {
                formatter: (value) => `${formatNumber(value)} items`,
            },
        },
    }

    const revenueChartOptions: ApexOptions = {
        chart: {
            toolbar: { show: false },
        },
        colors: ['#6e1423'],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                columnWidth: '38%',
            },
        },
        xaxis: {
            categories: ['Orders', 'Reservations'],
        },
        yaxis: {
            labels: {
                formatter: (value) => formatNumber(value),
            },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        tooltip: {
            y: {
                formatter: (value) => formatCurrency(value),
            },
        },
    }

    useEffect(() => {
        if (!restaurantId) return

        setActiveRestaurant({
            id: restaurantId,
            name: restaurantResponse?.data?.name || restaurantId,
        })
    }, [restaurantId, restaurantResponse?.data?.name, setActiveRestaurant])

    const handleBack = () => {
        setActiveRestaurant(null)
        navigate('/owner/dashboard')
    }

    const handleRefresh = () => {
        void Promise.all([
            refetchRestaurant(),
            refetchEda(),
            refetchDishes(),
            refetchCustomers(),
        ])
    }

    if (!restaurantId) {
        return (
            <Container>
                <Card className="my-8" bodyClass="p-8">
                    <EmptyState
                        title="Restaurant not found"
                        description="This dashboard link does not include a valid restaurant workspace."
                    />
                </Card>
            </Container>
        )
    }

    return (
        <Container>
            <div className="space-y-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <Button
                            variant="plain"
                            size="sm"
                            icon={<TbArrowNarrowLeft />}
                            aria-label="Go back to restaurant dashboard"
                            onClick={handleBack}
                        >
                            Back to dashboard
                        </Button>
                        <div className="hidden h-8 w-px bg-gray-200 sm:block dark:bg-gray-700" />
                        <div className="hidden sm:block">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                                Analytics overview
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {today}
                            </p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="default"
                        icon={<TbRefresh />}
                        loading={refreshing}
                        onClick={handleRefresh}
                    >
                        Refresh data
                    </Button>
                </div>

                <Card
                    className="relative overflow-hidden border-none bg-gradient-to-br from-primary/[0.16] via-primary/[0.06] to-transparent shadow-sm dark:from-primary/[0.24] dark:via-primary/[0.08]"
                    bodyClass="relative p-0"
                >
                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur dark:bg-gray-800/70">
                                <TbSparkles />
                                Today’s performance
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                                {restaurantName}
                            </h1>
                            {restaurantError && (
                                <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                                    Restaurant details are temporarily
                                    unavailable. Refresh to try again.
                                </p>
                            )}
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                                A quick view of service activity, customer
                                trends, and the areas that need your attention
                                today.
                            </p>
                        </div>
                        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/70">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total orders
                                </p>
                                <p className="mt-1 whitespace-nowrap text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {edaLoading
                                        ? '—'
                                        : formatNumber(totalOrders)}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/70">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total reservations
                                </p>
                                <p className="mt-1 whitespace-nowrap text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {edaLoading
                                        ? '—'
                                        : formatNumber(totalReservations)}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {edaLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Card key={index} bodyClass="p-5">
                                <div className="flex justify-between">
                                    <div className="space-y-3">
                                        <Skeleton width={110} height={12} />
                                        <Skeleton width={72} height={32} />
                                    </div>
                                    <Skeleton
                                        variant="circle"
                                        width={44}
                                        height={44}
                                    />
                                </div>
                                <Skeleton
                                    className="mt-4"
                                    width="75%"
                                    height={10}
                                />
                            </Card>
                        ))}
                    </div>
                ) : edaError ? (
                    <Card bodyClass="p-5">
                        <ErrorState onRetry={() => void refetchEda()} />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Pending orders"
                            value={pendingOrders}
                            description="Waiting for action"
                            icon={<TbClock />}
                            tone="amber"
                        />
                        <StatCard
                            label="Confirmed orders"
                            value={confirmedOrders}
                            description="Ready for fulfillment"
                            icon={<TbShoppingBag />}
                            tone="blue"
                        />
                        <StatCard
                            label="Completed orders"
                            value={completedOrders}
                            description="Orders completed today"
                            icon={<TbCircleCheck />}
                            tone="emerald"
                        />
                        <StatCard
                            label="Order revenue"
                            value={completedOrderRevenue}
                            description="Completed order value"
                            icon={<TbCoin />}
                            tone="emerald"
                            valueFormatter={formatCurrency}
                        />
                        <StatCard
                            label="Pending reservations"
                            value={pendingReservations}
                            description="Reservations to review"
                            icon={<TbCalendarClock />}
                            tone="orange"
                        />
                        <StatCard
                            label="Confirmed reservations"
                            value={confirmedReservations}
                            description="Confirmed for today"
                            icon={<TbCalendarCheck />}
                            tone="violet"
                        />
                        <StatCard
                            label="Completed reservations"
                            value={completedReservations}
                            description="Reservations completed today"
                            icon={<TbCircleCheck />}
                            tone="emerald"
                        />
                        <StatCard
                            label="Reservation revenue"
                            value={completedReservationRevenue}
                            description="Completed reservation value"
                            icon={<TbCoin />}
                            tone="emerald"
                            valueFormatter={formatCurrency}
                        />
                    </div>
                )}

                {!edaError && !edaLoading && (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
                        <Card
                            header={{
                                content: (
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                            Activity by status
                                        </h2>
                                        <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                            Orders and reservations completed or
                                            waiting today.
                                        </p>
                                    </div>
                                ),
                                bordered: false,
                                className: 'px-5 py-5 sm:px-6',
                            }}
                            bodyClass="px-3 pb-4 pt-0 sm:px-6"
                        >
                            <Chart
                                type="bar"
                                height={290}
                                series={[
                                    {
                                        name: 'Pending',
                                        data: [
                                            pendingOrders,
                                            pendingReservations,
                                        ],
                                    },
                                    {
                                        name: 'Confirmed',
                                        data: [
                                            confirmedOrders,
                                            confirmedReservations,
                                        ],
                                    },
                                    {
                                        name: 'Completed',
                                        data: [
                                            completedOrders,
                                            completedReservations,
                                        ],
                                    },
                                ]}
                                customOptions={activityChartOptions}
                            />
                        </Card>
                        <Card
                            header={{
                                content: (
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                            Completed revenue
                                        </h2>
                                        <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                            {formatCurrency(
                                                totalCompletedRevenue,
                                            )}{' '}
                                            earned today.
                                        </p>
                                    </div>
                                ),
                                bordered: false,
                                className: 'px-5 py-5 sm:px-6',
                            }}
                            bodyClass="px-3 pb-4 pt-0 sm:px-6"
                        >
                            <Chart
                                type="bar"
                                height={290}
                                series={[
                                    {
                                        name: 'Revenue',
                                        data: [
                                            completedOrderRevenue,
                                            completedReservationRevenue,
                                        ],
                                    },
                                ]}
                                customOptions={revenueChartOptions}
                            />
                        </Card>
                    </div>
                )}

                <Card
                    header={{
                        content: (
                            <div className="flex items-center gap-3">
                                <span className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                                    <TbChefHat className="text-xl" />
                                </span>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                        Top-selling dishes
                                    </h2>
                                    <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                        Your menu’s strongest performers today.
                                    </p>
                                </div>
                            </div>
                        ),
                        bordered: false,
                        className: 'px-5 py-5 sm:px-6',
                    }}
                    bodyClass="px-5 pb-5 pt-0 sm:px-6"
                >
                    {dishesLoading ? (
                        <TableSkeleton rows={5} />
                    ) : dishesError ? (
                        <ErrorState onRetry={() => void refetchDishes()} />
                    ) : !topSaleDishes?.data?.length ? (
                        <EmptyState
                            title="No dish sales yet"
                            description="Top-selling dishes will appear here once orders are recorded."
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <caption className="sr-only">
                                    Top-selling dishes
                                </caption>
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 dark:border-gray-700">
                                        <th
                                            className="py-3 pr-4 font-semibold"
                                            scope="col"
                                        >
                                            Dish
                                        </th>
                                        <th
                                            className="py-3 pr-4 font-semibold"
                                            scope="col"
                                        >
                                            Price
                                        </th>
                                        <th
                                            className="py-3 text-right font-semibold"
                                            scope="col"
                                        >
                                            Order/Reservation Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSaleDishes.data.map((dish) => (
                                        <tr
                                            key={dish.dishId}
                                            className="border-b border-gray-100 last:border-0 dark:border-gray-700/70"
                                        >
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        shape="square"
                                                        size={40}
                                                        src={dish.coverImageUrl}
                                                        alt={dish.dishName}
                                                        icon={<TbChefHat />}
                                                        className="shrink-0 rounded-xl"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="max-w-[240px] truncate font-semibold text-gray-800 dark:text-gray-200">
                                                            {dish.dishName}
                                                        </p>
                                                        <p className="mt-0.5 max-w-[280px] truncate text-xs text-gray-500 dark:text-gray-400">
                                                            {dish.description ||
                                                                'Menu item'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-3 pr-4 text-gray-600 dark:text-gray-400">
                                                {formatNumber(dish.price)} MMK
                                            </td>
                                            <td className="py-3 text-right font-bold text-gray-800 dark:text-gray-200">
                                                {formatNumber(
                                                    dish.totalQuantity,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            Customer insights
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                            Know who keeps coming back
                        </h2>
                    </div>
                    <TbUsers className="hidden text-3xl text-gray-300 sm:block dark:text-gray-600" />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <CustomerTable
                        title="Most ordered customers"
                        metricLabel="Total orders"
                        customers={
                            topCustomers?.data?.mostOrderedCustomers?.map(
                                (customer) => ({
                                    userId: customer.userId,
                                    name: customer.name,
                                    email: customer.email,
                                    metric:
                                        customer.totalOrders ??
                                        (
                                            customer as typeof customer & {
                                                totalorders?: number
                                            }
                                        ).totalorders ??
                                        0,
                                }),
                            ) ?? []
                        }
                        loading={customersLoading}
                        error={customersError}
                        onRetry={() => void refetchCustomers()}
                    />
                    <CustomerTable
                        title="Most reserved customers"
                        metricLabel="Total reservations"
                        customers={
                            topCustomers?.data?.mostReservationCustomers?.map(
                                (customer) => ({
                                    userId: customer.userId,
                                    name: customer.name,
                                    email: customer.email,
                                    metric:
                                        customer.totalReservations ??
                                        (
                                            customer as typeof customer & {
                                                totalreservations?: number
                                            }
                                        ).totalreservations ??
                                        0,
                                }),
                            ) ?? []
                        }
                        loading={customersLoading}
                        error={customersError}
                        onRetry={() => void refetchCustomers()}
                    />
                </div>
            </div>
        </Container>
    )
}

export default EdaDashboard

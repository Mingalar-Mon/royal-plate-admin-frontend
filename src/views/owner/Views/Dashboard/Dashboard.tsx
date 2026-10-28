import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import type { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { TbSearch } from 'react-icons/tb'
import Chart from '@/components/shared/Chart'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Avatar from '@/components/ui/Avatar'
import Skeleton from '@/components/ui/Skeleton'
import {
    TbCalendar,
    TbChartBar,
    TbCoin,
    TbDatabaseOff,
    TbMapPin,
    TbRefresh,
    TbStar,
    TbShoppingBag,
    TbCalendarCheck,
    TbEye,
    TbEdit,
    TbTrash,
} from 'react-icons/tb'
import { useGetRestaurantCards } from '@/utils/custom-hooks/useRestaurant'
import { useRestaurantStore } from '@/store/restaurantStore'
import type { RestaurantCardData } from '@/@types/restaurant'

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? n.toLocaleString() : '0'
}

const formatCurrency = (value: number | null | undefined) =>
    `${formatNumber(value)} MMK`

const Dashboard = () => {
    const [fromDate, setFromDate] = useState<Date | null>(
        dayjs().startOf('month').toDate(),
    )
    const [toDate, setToDate] = useState<Date | null>(dayjs().toDate())
    const [search, setSearch] = useState<string>('')

    const fromDateStr = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : ''
    const toDateStr = toDate ? dayjs(toDate).format('YYYY-MM-DD') : ''

    const { data, isLoading, isFetching, refetch } = useGetRestaurantCards(
        fromDateStr,
        toDateStr,
        search,
    )

    const restaurants = data?.data ?? []

    const totals = useMemo(() => {
        return restaurants.reduce(
            (acc, r) => ({
                orderAmount: acc.orderAmount + (r.totalOrderAmount ?? 0),
                orderCount: acc.orderCount + (r.totalOrderCount ?? 0),
                reservationAmount:
                    acc.reservationAmount + (r.totalReservationAmount ?? 0),
                reservationCount:
                    acc.reservationCount + (r.totalReservationCount ?? 0),
            }),
            {
                orderAmount: 0,
                orderCount: 0,
                reservationAmount: 0,
                reservationCount: 0,
            },
        )
    }, [restaurants])

    const overviewChartOptions: ApexOptions = {
        chart: { toolbar: { show: false } },
        colors: ['#6e1423', '#e9c66a'],
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '55%',
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: restaurants.map((r) => r.name),
            labels: {
                rotate: restaurants.length > 4 ? -30 : 0,
                style: { fontSize: '11px' },
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => formatNumber(val),
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        tooltip: {
            y: { formatter: (val) => formatCurrency(val) },
        },
        grid: {
            borderColor: '#f0f0f0',
            strokeDashArray: 3,
        },
    }

    const countChartOptions: ApexOptions = {
        chart: { toolbar: { show: false } },
        colors: ['#6e1423', '#e9c66a'],
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '55%',
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: restaurants.map((r) => r.name),
            labels: {
                rotate: restaurants.length > 4 ? -30 : 0,
                style: { fontSize: '11px' },
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => formatNumber(val),
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        tooltip: {
            y: { formatter: (val) => `${formatNumber(val)} items` },
        },
        grid: {
            borderColor: '#f0f0f0',
            strokeDashArray: 3,
        },
    }

    const donutChartOptions: ApexOptions = {
        chart: { toolbar: { show: false } },
        colors: ['#6e1423', '#e9c66a'],
        labels: ['Orders', 'Reservations'],
        legend: {
            position: 'bottom',
        },
        tooltip: {
            y: { formatter: (val) => formatCurrency(val) },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Revenue',
                            formatter: () =>
                                formatCurrency(
                                    totals.orderAmount +
                                        totals.reservationAmount,
                                ),
                        },
                    },
                },
            },
        },
        dataLabels: { enabled: false },
    }

    const handleRefresh = () => {
        void refetch()
    }

    return (
        <div className="w-full px-4 py-6 md:px-6 lg:px-8">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-primary text-2xl font-bold">
                            Restaurant Dashboard
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Overview of your restaurants performance
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search restaurant name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[240px] rounded-lg border border-gray-300 bg-white px-3 py-2 pl-9 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                            />
                            <TbSearch className="absolute left-2.5 top-2.5 text-gray-400" />
                        </div>
                        <Button
                            size="sm"
                            icon={<TbRefresh />}
                            onClick={handleRefresh}
                            loading={isFetching}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                <Card
                    className="border-none bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                    bodyClass="p-5"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <TbCalendar className="text-lg text-primary" />
                            <span>Date Range</span>
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                                    From
                                </label>
                                <DatePicker
                                    value={fromDate}
                                    onChange={(val) => setFromDate(val)}
                                    inputFormat="DD/MM/YYYY"
                                    clearable={false}
                                    className="w-[160px]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                                    To
                                </label>
                                <DatePicker
                                    value={toDate}
                                    onChange={(val) => setToDate(val)}
                                    inputFormat="DD/MM/YYYY"
                                    clearable={false}
                                    className="w-[160px]"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} bodyClass="p-5">
                                <div className="space-y-3">
                                    <Skeleton width={100} height={12} />
                                    <Skeleton width={80} height={28} />
                                    <Skeleton width="60%" height={10} />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card
                            className="border-l-4 border-l-primary"
                            bodyClass="p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Restaurants
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {restaurants.length}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                    <TbChartBar className="text-xl" />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Total registered restaurants
                            </p>
                        </Card>

                        <Card
                            className="border-l-4 border-l-emerald-500"
                            bodyClass="p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Order Revenue
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(totals.orderAmount)}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                                    <TbShoppingBag className="text-xl" />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {formatNumber(totals.orderCount)} orders total
                            </p>
                        </Card>

                        <Card
                            className="border-l-4 border-l-amber-500"
                            bodyClass="p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Reservation Revenue
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                                        {formatCurrency(
                                            totals.reservationAmount,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                                    <TbCalendarCheck className="text-xl" />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {formatNumber(totals.reservationCount)}{' '}
                                reservations total
                            </p>
                        </Card>

                        <Card
                            className="border-l-4 border-l-blue-500"
                            bodyClass="p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Total Revenue
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(
                                            totals.orderAmount +
                                                totals.reservationAmount,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                                    <TbCoin className="text-xl" />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Combined order & reservation revenue
                            </p>
                        </Card>
                    </div>
                )}

                {!isLoading && restaurants.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
                            <Card
                                header={{
                                    content: (
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                                Revenue by Restaurant
                                            </h4>
                                            <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                                Order vs reservation amount
                                                comparison
                                            </p>
                                        </div>
                                    ),
                                    bordered: false,
                                    className: 'px-5 py-4',
                                }}
                                bodyClass="px-3 pb-4 pt-0 sm:px-5"
                            >
                                <Chart
                                    type="bar"
                                    height={320}
                                    series={[
                                        {
                                            name: 'Order Amount',
                                            data: restaurants.map(
                                                (r) => r.totalOrderAmount ?? 0,
                                            ),
                                        },
                                        {
                                            name: 'Reservation Amount',
                                            data: restaurants.map(
                                                (r) =>
                                                    r.totalReservationAmount ??
                                                    0,
                                            ),
                                        },
                                    ]}
                                    customOptions={overviewChartOptions}
                                />
                            </Card>

                            <Card
                                header={{
                                    content: (
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                                Revenue Split
                                            </h4>
                                            <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                                Orders vs reservations
                                            </p>
                                        </div>
                                    ),
                                    bordered: false,
                                    className: 'px-5 py-4',
                                }}
                                bodyClass="px-3 pb-4 pt-0 sm:px-5"
                            >
                                <Chart
                                    type="donut"
                                    height={320}
                                    series={[
                                        totals.orderAmount,
                                        totals.reservationAmount,
                                    ]}
                                    customOptions={donutChartOptions}
                                />
                            </Card>
                        </div>

                        <Card
                            header={{
                                content: (
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                            Order & Reservation Count
                                        </h4>
                                        <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                            Number of orders vs reservations per
                                            restaurant
                                        </p>
                                    </div>
                                ),
                                bordered: false,
                                className: 'px-5 py-4',
                            }}
                            bodyClass="px-3 pb-4 pt-0 sm:px-5"
                        >
                            <Chart
                                type="bar"
                                height={300}
                                series={[
                                    {
                                        name: 'Order Count',
                                        data: restaurants.map(
                                            (r) => r.totalOrderCount ?? 0,
                                        ),
                                    },
                                    {
                                        name: 'Reservation Count',
                                        data: restaurants.map(
                                            (r) =>
                                                r.totalReservationCount ?? 0,
                                        ),
                                    },
                                ]}
                                customOptions={countChartOptions}
                            />
                        </Card>
                    </>
                )}

                <div>
                    <h4 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
                        Restaurant Details
                    </h4>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i} bodyClass="p-5">
                                    <div className="flex gap-4">
                                        <Skeleton
                                            variant="circle"
                                            width={56}
                                            height={56}
                                        />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton width="50%" height={16} />
                                            <Skeleton width="70%" height={12} />
                                        </div>
                                    </div>
                                    <Skeleton
                                        className="mt-4"
                                        width="100%"
                                        height={80}
                                    />
                                </Card>
                            ))}
                        </div>
                    ) : restaurants.length === 0 ? (
                        <Card bodyClass="p-8">
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="rounded-2xl bg-gray-100 p-4 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                                    <TbDatabaseOff className="text-3xl" />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    No restaurants found
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Try adjusting the date range or add a new
                                    restaurant
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {restaurants.map((restaurant) => (
                                <RestaurantDetailCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const RestaurantDetailCard = ({
    restaurant,
}: {
    restaurant: RestaurantCardData
}) => {
    const navigate = useNavigate()
    const { openProfileDialog } = useRestaurantStore()

    const handleView = () => {
        if (restaurant.profile !== null) {
            navigate(`/restaurant/restaurant-profile/${restaurant.id}`)
        } else {
            openProfileDialog('CREATE_PROFILE', {
                id: restaurant.id,
                name: restaurant.name,
            })
        }
    }

    const handleEdit = () => {
        navigate(`/restaurant/update-restaurant/${restaurant.id}`)
    }

    const handleDelete = () => {
        openProfileDialog('DELETE_CONFIRM', {
            id: restaurant.id,
            name: restaurant.name,
        })
    }

    const maxAmount = Math.max(
        restaurant.totalOrderAmount ?? 0,
        restaurant.totalReservationAmount ?? 0,
        1,
    )
    const orderBarWidth =
        ((restaurant.totalOrderAmount ?? 0) / maxAmount) * 100
    const reservationBarWidth =
        ((restaurant.totalReservationAmount ?? 0) / maxAmount) * 100

    const miniChartOptions: ApexOptions = {
        chart: { toolbar: { show: false } },
        colors: ['#6e1423', '#e9c66a'],
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '35%',
            },
        },
        xaxis: {
            categories: ['Orders', 'Reservations'],
            labels: { show: false },
        },
        yaxis: {
            labels: { show: false },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        tooltip: {
            y: { formatter: (val) => formatCurrency(val) },
        },
        grid: { show: false },
    }

    return (
        <Card className="overflow-hidden" bodyClass="p-0">
            <div className="flex items-start gap-4 border-b border-gray-100 p-5 dark:border-gray-700">
                <Avatar
                    shape="square"
                    size={56}
                    src={restaurant.logoImage?.url}
                    alt={restaurant.name}
                    className="shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                    <h5 className="truncate text-base font-bold text-gray-900 dark:text-gray-100">
                        {restaurant.name}
                    </h5>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <TbMapPin className="shrink-0 text-sm" />
                        <span className="truncate">{restaurant.address}</span>
                    </div>
                    {restaurant.averageRating > 0 && (
                        <div className="mt-1.5 flex items-center gap-1">
                            <TbStar className="text-amber-400" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {restaurant.averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400">
                                ({restaurant.totalReviews} reviews)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5">
                <div className="mb-4">
                    <Chart
                        type="bar"
                        height={120}
                        series={[
                            {
                                name: 'Amount',
                                data: [
                                    restaurant.totalOrderAmount ?? 0,
                                    restaurant.totalReservationAmount ?? 0,
                                ],
                            },
                        ]}
                        customOptions={{
                            ...miniChartOptions,
                            plotOptions: {
                                bar: {
                                    borderRadius: 4,
                                    columnWidth: '45%',
                                },
                            },
                        }}
                    />
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                Order Amount
                            </span>
                            <span className="font-bold text-primary dark:text-gold">
                                {formatCurrency(restaurant.totalOrderAmount)}
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${orderBarWidth}%` }}
                            />
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                            {formatNumber(restaurant.totalOrderCount)} orders
                        </p>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                Reservation Amount
                            </span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                                {formatCurrency(
                                    restaurant.totalReservationAmount,
                                )}
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                style={{ width: `${reservationBarWidth}%` }}
                            />
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                            {formatNumber(restaurant.totalReservationCount)}{' '}
                            reservations
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Total Revenue
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(
                            (restaurant.totalOrderAmount ?? 0) +
                                (restaurant.totalReservationAmount ?? 0),
                        )}
                    </span>
                </div>

                <div className="mt-4 flex gap-2">
                    <Button
                        size="sm"
                        variant="solid"
                        icon={<TbEye />}
                        onClick={handleView}
                    >
                        View
                    </Button>
                    <Button
                        size="sm"
                        icon={<TbEdit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        icon={<TbTrash />}
                        variant="plain"
                        className="text-red-500 hover:text-red-600 border"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default Dashboard

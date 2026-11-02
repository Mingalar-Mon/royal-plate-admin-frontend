import { useState, useCallback } from 'react'
import dayjs from 'dayjs'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker'
import Skeleton from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import {
    FaSort,
    FaSortUp,
    FaSortDown,
} from 'react-icons/fa'
import {
    TbSearch,
    TbRefresh,
    TbBuildingStore,
    TbUsers,
    TbCoin,
    TbShoppingBag,
    TbCalendarCheck,
    TbArrowRight,
    TbPercentage,
} from 'react-icons/tb'
import { useGetOwnerOverview } from '@/utils/custom-hooks/useDashboard'
import { useGetOwnerOptions } from '@/utils/custom-hooks/useOwner'
import Select from '@/components/ui/Select'
import type { OwnerOverviewData, OwnerOverviewSummary } from '@/@types/dashboard'
import OwnerSummaryCards from './components/OwnerSummaryCards'
import RestaurantBreakdown from './components/RestaurantBreakdown'

type SortField = 'totalPrice' | 'netAmount' | 'commission_fee' | 'orderCount' | 'reservationCount' | 'ownerName'
type SortOrder = 'ASC' | 'DESC'

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? n.toLocaleString() : '0'
}

const formatCurrency = (value: number | null | undefined) =>
    `${formatNumber(value)} MMK`

const SortButton = ({
    label,
    field,
    currentSort,
    currentOrder,
    onSort,
}: {
    label: string
    field: SortField
    currentSort: SortField
    currentOrder: SortOrder
    onSort: (field: SortField) => void
}) => {
    const active = currentSort === field
    return (
        <button
            type="button"
            onClick={() => onSort(field)}
            className="flex items-center gap-1 rounded-lg px-1 -mx-1 text-xs font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
        >
            {active ? (
                currentOrder === 'ASC' ? (
                    <FaSortUp className="h-3.5 w-3.5 text-primary" />
                ) : (
                    <FaSortDown className="h-3.5 w-3.5 text-primary" />
                )
            ) : (
                <FaSort className="h-3.5 w-3.5 text-gray-400" />
            )}
            <span>{label}</span>
        </button>
    )
}

const OwnerRow = ({
    owner,
    sortBy,
    sortOrder,
    onSort,
    expandedIds,
    onToggle,
}: {
    owner: OwnerOverviewData
    sortBy: SortField
    sortOrder: SortOrder
    onSort: (field: SortField) => void
    expandedIds: Set<string>
    onToggle: (ownerId: string) => void
}) => {
    const expanded = expandedIds.has(owner.ownerId)

    return (
        <>
            <tr className="border-b border-gray-100 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3">
                    <button
                        type="button"
                        onClick={() => onToggle(owner.ownerId)}
                        className="flex w-full items-center gap-3 text-left"
                    >
                        <span
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold transition-transform ${expanded ? 'rotate-90' : ''
                                }`}
                        >
                            <TbArrowRight className="h-3 w-3" />
                        </span>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-sm shadow-sm">
                                {owner.ownerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                    {owner.ownerName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {owner.ownerEmail}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">
                                    {owner.ownerPhone ?? 'No phone'}
                                </p>
                            </div>
                        </div>
                    </button>
                </td>
                <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        <TbBuildingStore className="h-4 w-4 text-gray-500" />
                        {formatNumber(owner.restaurantCount)}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {formatCurrency(owner.totalPrice)}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400">
                        <TbPercentage className="h-4 w-4" />
                        {formatCurrency(owner.commission_fee)}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <TbCoin className="h-4 w-4" />
                        {formatCurrency(owner.netAmount)}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        <TbShoppingBag className="h-4 w-4" />
                        {formatNumber(owner.orderCount)}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                        <TbCalendarCheck className="h-4 w-4" />
                        {formatNumber(owner.reservationCount)}
                    </span>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50/60 dark:bg-gray-800/40">
                    <td
                        colSpan={7}
                        className="px-4 py-1 border-b border-gray-100 dark:border-gray-700"
                    >
                        <RestaurantBreakdown restaurants={owner.restaurants} />
                    </td>
                </tr>
            )}
        </>
    )
}

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
        <div className="rounded-2xl bg-gray-100 p-4 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <TbUsers className="h-10 w-10" />
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            No owners found
        </p>
        <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
            Try adjusting the filters, date range, or search term
        </p>
    </div>
)

const ActiveFilterChip = ({
    label,
    onRemove,
}: {
    label: string
    onRemove: () => void
}) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary dark:border-primary/40 dark:bg-primary/10 dark:text-primary">
        <span>{label}</span>
        <button
            type="button"
            onClick={onRemove}
            className="rounded-full p-0.5 text-primary hover:bg-primary/10 dark:text-primary dark:hover:bg-primary/20"
        >
            <TbSearch className="h-3 w-3" />
        </button>
    </span>
)

const SortStrip = ({
    sortBy,
    sortOrder,
    onSort,
}: {
    sortBy: SortField
    sortOrder: SortOrder
    onSort: (field: SortField) => void
}) => {
    const fields: { label: string; field: SortField }[] = [
        { label: 'Revenue', field: 'totalPrice' },
        { label: 'Net', field: 'netAmount' },
        { label: 'Commission', field: 'commission_fee' },
        { label: 'Orders', field: 'orderCount' },
        { label: 'Owner', field: 'ownerName' },
    ]
    return (
        <div className="flex flex-wrap items-center gap-1 text-primary">
            {fields.map((f) => (
                <span key={f.field} className="flex items-center gap-1">
                    <SortButton
                        label={f.label}
                        field={f.field}
                        currentSort={sortBy}
                        currentOrder={sortOrder}
                        onSort={onSort}
                    />
                    {f.field !== fields[fields.length - 1].field && (
                        <span className="text-gray-300 dark:text-gray-600">
                            /
                        </span>
                    )}
                </span>
            ))}
        </div>
    )
}

const OwnerOverview = () => {
    const [fromDate, setFromDate] = useState<Date | null>(null)
    const [toDate, setToDate] = useState<Date | null>(null)
    const [ownerId, setOwnerId] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState(1)
    const [limit] = useState(20)
    const [sortBy, setSortBy] = useState<SortField>('totalPrice')
    const [sortOrder, setSortOrder] = useState<SortOrder>('DESC')
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const fromDateStr = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : ''
    const toDateStr = toDate ? dayjs(toDate).format('YYYY-MM-DD') : ''

    const { data: ownerOptionsData, isLoading: optionsLoading } =
        useGetOwnerOptions()

    const ownerOptions =
        ownerOptionsData?.data?.map((o) => ({
            label: `${o.name} (${o.email})`,
            value: o.id,
            name: o.name,
            email: o.email,
        })) ?? []

    const ownerOptionValue = ownerOptions.find((o) => o.value === ownerId)
        ?.value ?? null

    const { data, isLoading, refetch } = useGetOwnerOverview({
        ownerId: ownerId || undefined,
        search: search || undefined,
        fromDate: fromDateStr || undefined,
        toDate: toDateStr || undefined,
        page,
        limit,
        sortBy,
        sortOrder,
    })

    const owners = data?.data ?? []
    const summary = data?.summary
    const paginator = data?.paginator
    const total = paginator?.totalItems ?? 0
    const totalPages = paginator?.totalPages ?? 1
    const pageSize = paginator?.pageSize ?? limit

    const toggleExpand = useCallback((ownerId_: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(ownerId_)) {
                next.delete(ownerId_)
            } else {
                next.add(ownerId_)
            }
            return next
        })
    }, [])

    const handleSort = useCallback(
        (field: SortField) => {
            if (sortBy === field) {
                setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
            } else {
                setSortBy(field)
                setSortOrder('DESC')
            }
            setPage(1)
        },
        [sortBy],
    )

    const clearFilters = () => {
        setFromDate(null)
        setToDate(null)
        setOwnerId('')
        setSearch('')
        setPage(1)
        setSortBy('totalPrice')
        setSortOrder('DESC')
    }

    const hasActiveFilters =
        fromDate ||
        toDate ||
        ownerId ||
        search ||
        sortBy !== 'totalPrice'

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h3 className="text-primary text-xl font-bold">
                                Owner Overview
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Revenue and transaction summary across all owners
                                and their restaurants
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Button
                                size="sm"
                                variant="default"
                                icon={<TbRefresh className="h-4 w-4" />}
                                loading={isLoading}
                                onClick={() => refetch()}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card bodyClass="p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Filters
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    From
                                </label>
                                <DatePicker
                                    size="sm"
                                    value={fromDate}
                                    onChange={(date) => {
                                        setFromDate(date)
                                        setPage(1)
                                    }}
                                    inputFormat="DD/MM/YYYY"
                                    clearable
                                    className="w-44"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    To
                                </label>
                                <DatePicker
                                    size="sm"
                                    value={toDate}
                                    onChange={(date) => {
                                        setToDate(date)
                                        setPage(1)
                                    }}
                                    inputFormat="DD/MM/YYYY"
                                    clearable
                                    className="w-44"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Owner name / email
                                </label>
                                <Select
                                    size="sm"
                                    isSearchable
                                    className="w-60"
                                    placeholder="Select an owner..."
                                    options={ownerOptions}
                                    value={ownerOptionValue}
                                    onChange={(option) => {
                                        if (option?.value) {
                                            setOwnerId(option.value)
                                            setSearch('')
                                        } else {
                                            setOwnerId('')
                                        }
                                        setPage(1)
                                    }}
                                    isLoading={optionsLoading}
                                    noOptionsMessage={() =>
                                        optionsLoading
                                            ? 'Loading owners...'
                                            : 'No owners found'
                                    }
                                />
                            </div>

                            {/* <div className="flex flex-wrap items-center gap-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Owner ID
                                </label>
                                <Input
                                    size="sm"
                                    value={ownerId}
                                    onChange={(e) => {
                                        // If an owner was chosen via the dropdown, direct
                                        // UUID typing is blocked to avoid mismatches.
                                        if (ownerOptionValue) {
                                            setOwnerId(ownerOptionValue)
                                            return
                                        }
                                        setOwnerId(e.target.value.trim())
                                        setPage(1)
                                    }}
                                    placeholder="UUID (optional)"
                                    disabled={!!ownerOptionValue}
                                    className="w-52"
                                />
                            </div> */}

                            <div className="flex flex-wrap items-center gap-2 ml-auto">
                                {hasActiveFilters && (
                                    <Button
                                        size="xs"
                                        variant="plain"
                                        onClick={clearFilters}
                                        className="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        Clear all
                                    </Button>
                                )}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                {fromDate && (
                                    <ActiveFilterChip
                                        label={`From: ${dayjs(fromDate).format('DD/MM/YYYY')}`}
                                        onRemove={() => {
                                            setFromDate(null)
                                            setPage(1)
                                        }}
                                    />
                                )}
                                {toDate && (
                                    <ActiveFilterChip
                                        label={`To: ${dayjs(toDate).format('DD/MM/YYYY')}`}
                                        onRemove={() => {
                                            setToDate(null)
                                            setPage(1)
                                        }}
                                    />
                                )}
                                {ownerId && (
                                    <ActiveFilterChip
                                        label={
                                            ownerOptions.find((o) => o.value === ownerId)
                                                ? `Owner: ${ownerOptions.find((o) => o.value === ownerId)!.name}`
                                                : `Owner ID: ${ownerId}`
                                        }
                                        onRemove={() => {
                                            setOwnerId('')
                                            setPage(1)
                                        }}
                                    />
                                )}
                                {search && (
                                    <ActiveFilterChip
                                        label={`Search: "${search}"`}
                                        onRemove={() => {
                                            setSearch('')
                                            setPage(1)
                                        }}
                                    />
                                )}
                                {sortBy !== 'totalPrice' && (
                                    <ActiveFilterChip
                                        label={`Sort: ${sortBy} ${sortOrder}`}
                                        onRemove={() => {
                                            setSortBy('totalPrice')
                                            setSortOrder('DESC')
                                            setPage(1)
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Summary cards */}
                    <OwnerSummaryCards summary={summary} loading={isLoading} />

                    {/* Data table */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Owners ({formatNumber(total)})
                            </h4>
                            <SortStrip
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                            />
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                                    >
                                        <Skeleton
                                            variant="circle"
                                            width={36}
                                            height={36}
                                        />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton width="40%" height={14} />
                                            <Skeleton width="25%" height={10} />
                                        </div>
                                        <Skeleton width={90} height={14} />
                                        <Skeleton width={90} height={14} />
                                        <Skeleton width={90} height={14} />
                                    </div>
                                ))}
                            </div>
                        ) : owners.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    <table className="w-full border-collapse text-sm">
                                        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/95 backdrop-blur-sm">
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Owner
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Restaurants
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Total Revenue
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Commission
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Net Amount
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Orders
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Reservations
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {owners.map((owner) => (
                                                <OwnerRow
                                                    key={owner.ownerId}
                                                    owner={owner}
                                                    sortBy={sortBy}
                                                    sortOrder={sortOrder}
                                                    onSort={handleSort}
                                                    expandedIds={expandedIds}
                                                    onToggle={toggleExpand}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Showing page {page} of {totalPages}
                                        </p>
                                        <Pagination
                                            currentPage={page}
                                            pageSize={pageSize}
                                            total={total}
                                            onChange={(p) => setPage(p)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default OwnerOverview

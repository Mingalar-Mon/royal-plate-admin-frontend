import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { ColumnDef, ExpandedState, Row } from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import { TbChevronDown, TbReceipt, TbCalendarEvent } from 'react-icons/tb'
import DataTable from '@/components/shared/DataTable'
import { usePayoutStore } from '@/store/payoutStore'
import type { PayoutBatch } from '@/@types/payout'

const Money = ({ value }: { value: string | number | null | undefined }) => {
    if (value === null || value === undefined || value === '') {
        return <span className="text-gray-400 dark:text-gray-500">—</span>
    }
    return (
        <span className="whitespace-nowrap">
            <NumericFormat
                thousandSeparator
                displayType="text"
                value={Number(value)}
                prefix="MMK "
            />
        </span>
    )
}

const Count = ({ value }: { value: number | null | undefined }) => {
    if (value === null || value === undefined) {
        return <span className="text-gray-400 dark:text-gray-500">—</span>
    }
    return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {value}
        </span>
    )
}

const StatusBadge = ({ status }: { status: string }) => {
    const colorMap: Record<string, string> = {
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    }
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colorMap[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
            {status}
        </span>
    )
}

interface PayoutListTableProps {
    data: PayoutBatch[]
    total: number
    loading: boolean
}

const PayoutListTable = ({ data, total, loading }: PayoutListTableProps) => {
    const tableData = usePayoutStore((state) => state.tableData)
    const setTableData = usePayoutStore((state) => state.setTableData)
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const columns: ColumnDef<PayoutBatch>[] = useMemo(
        () => [
            {
                id: 'expander',
                header: '',
                cell: (props) => {
                    const hasItems = props.row.original.payoutItems?.length
                    if (!hasItems) return null
                    return (
                        <button
                            onClick={() => props.row.toggleExpanded()}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        >
                            <TbChevronDown
                                className={`h-4 w-4 transition-transform ${props.row.getIsExpanded() ? 'rotate-180' : ''}`}
                            />
                        </button>
                    )
                },
                enableSorting: false,
                size: 40,
            },
            {
                header: 'Batch code',
                accessorKey: 'code',
                cell: (props) => (
                    <span className="whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">
                        {props.row.original.code}
                    </span>
                ),
            },
            {
                header: 'Restaurant',
                accessorKey: 'restaurant',
                cell: (props) => (
                    <span className="text-gray-700 dark:text-gray-200">
                        {props.row.original.restaurant.name}
                    </span>
                ),
            },
            {
                header: 'Period',
                id: 'period',
                cell: (props) => {
                    const { fromDate, toDate } = props.row.original
                    return (
                        <span className="whitespace-nowrap">
                            {dayjs(fromDate).format('DD/MM/YYYY')} ~{' '}
                            {dayjs(toDate).format('DD/MM/YYYY')}
                        </span>
                    )
                },
            },
            {
                header: 'Orders / Reservations',
                id: 'counts',
                cell: (props) => {
                    const batch = props.row.original
                    const isHistorical =
                        batch.orderCount === null &&
                        batch.reservationCount === null
                    if (isHistorical) {
                        return (
                            <span className="text-gray-400 dark:text-gray-500">
                                —
                            </span>
                        )
                    }
                    return (
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <Count value={batch.orderCount} />
                            <span className="text-gray-400">/</span>
                            <Count value={batch.reservationCount} />
                        </span>
                    )
                },
            },
            {
                header: 'Order commission',
                accessorKey: 'orderCommission',
                cell: (props) => (
                    <Money value={props.row.original.orderCommission} />
                ),
            },
            {
                header: 'Reservation commission',
                accessorKey: 'reservationCommission',
                cell: (props) => (
                    <Money value={props.row.original.reservationCommission} />
                ),
            },
            {
                header: 'Total',
                accessorKey: 'totalPrice',
                cell: (props) => (
                    <Money value={props.row.original.totalPrice} />
                ),
            },
            {
                header: 'Sub-total',
                accessorKey: 'subTotal',
                cell: (props) => <Money value={props.row.original.subTotal} />,
            },
            {
                header: 'Commission fee',
                accessorKey: 'commission_fee',
                cell: (props) => (
                    <Money value={props.row.original.commission_fee} />
                ),
            },
            {
                header: 'Net amount',
                accessorKey: 'netAmount',
                cell: (props) => (
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                        <Money value={props.row.original.netAmount} />
                    </span>
                ),
            },
            {
                header: 'Paid Date',
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="whitespace-nowrap">
                        {dayjs(props.row.original.created_at).format(
                            'DD/MM/YYYY HH:mm',
                        )}
                    </span>
                ),
            },
        ],
        [],
    )

    const renderSubComponent = ({ row }: { row: Row<PayoutBatch> }) => {
        const items = row.original.payoutItems || []
        if (items.length === 0) return null

        return (
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Payout Items ({items.length})
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="pb-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
                                <th className="pb-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Reference</th>
                                <th className="pb-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                                <th className="pb-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Sub-total</th>
                                <th className="pb-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Commission</th>
                                <th className="pb-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Net</th>
                                <th className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const isOrder = !!item.order
                                const record = isOrder ? item.order! : item.reservation!
                                if (!record) return null
                                return (
                                    <tr key={item.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                        <td className="py-2.5 pr-3">
                                            <span className="inline-flex items-center gap-1.5">
                                                {isOrder ? (
                                                    <TbReceipt className="text-blue-500" />
                                                ) : (
                                                    <TbCalendarEvent className="text-purple-500" />
                                                )}
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {isOrder ? 'Order' : 'Reservation'}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="py-2.5 pr-3 font-mono text-xs text-gray-700 dark:text-gray-200">
                                            {isOrder ? record.orderNumber : record.id.slice(0, 8)}
                                        </td>
                                        <td className="py-2.5 pr-3 text-xs text-gray-500 dark:text-gray-400">
                                            {dayjs(record.scheduledDate).format('DD/MM/YYYY HH:mm')}
                                        </td>
                                        <td className="py-2.5 pr-3 text-right text-xs text-gray-700 dark:text-gray-200">
                                            <Money value={record.subTotal} />
                                        </td>
                                        <td className="py-2.5 pr-3 text-right text-xs text-gray-500 dark:text-gray-400">
                                            <Money value={record.commission_fee} />
                                        </td>
                                        <td className="py-2.5 pr-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            <Money value={record.netAmount} />
                                        </td>
                                        <td className="py-2.5 text-center">
                                            <StatusBadge status={record.status} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, page }))
        setExpanded({})
    }

    const handleSelectChange = (limit: number) => {
        setTableData((prev) => ({ ...prev, limit, page: 1 }))
        setExpanded({})
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total,
                pageIndex: tableData.page,
                pageSize: tableData.limit,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            expanded={expanded}
            onExpandedChange={setExpanded}
            getRowCanExpand={() => true}
            renderSubComponent={renderSubComponent}
        />
    )
}

export default PayoutListTable

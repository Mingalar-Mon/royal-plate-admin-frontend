import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
    ColumnDef,
    Row,
    ExpandedState,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import {
    TbChevronDown,
    TbChevronRight,
    TbListDetails,
} from 'react-icons/tb'
import classNames from 'classnames'
import DataTable from '@/components/shared/DataTable'
import { usePayoutStore } from '@/store/payoutStore'
import type { PayoutBatch, PayoutItem } from '@/@types/payout'

const Money = ({ value }: { value: string | number | null | undefined }) => {
    if (value === null || value === undefined || value === '') {
        return <span>—</span>
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

const TypeBadge = ({ type }: { type: 'Order' | 'Reservation' }) => (
    <span
        className={classNames(
            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
            type === 'Order'
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400'
                : 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
        )}
    >
        {type}
    </span>
)

const StatusBadge = ({ isSettle }: { isSettle?: boolean }) => (
    <span
        className={classNames(
            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
            isSettle
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        )}
    >
        {isSettle ? 'Settled' : 'Unsettled'}
    </span>
)

const PayoutItemDetail = ({ item }: { item: PayoutItem }) => {
    const reference = item.order || item.reservation
    const code =
        item.order?.orderNumber || item.reservation?.reservationNumber || '—'
    const commissionBatch = reference?.commissionBatch

    return (
        <tr className="bg-white text-center transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/60">
            <td className="px-3 py-2">
                <TypeBadge type={item.order ? 'Order' : 'Reservation'} />
            </td>
            <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                {code}
            </td>
            <td className="px-3 py-2">
                <Money value={reference?.tax} />
            </td>
            <td className="px-3 py-2">
                <Money value={reference?.totalPrice} />
            </td>
            <td className="px-3 py-2">
                <Money value={reference?.subTotal} />
            </td>
            <td className="px-3 py-2">
                <Money value={reference?.commission_fee} />
            </td>
            <td className="px-3 py-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">
                    <Money value={reference?.netAmount} />
                </span>
            </td>
            <td className="px-3 py-2">
                <span className="text-gray-700 dark:text-gray-200">
                    {commissionBatch?.percentage
                        ? `${commissionBatch.percentage}%`
                        : '—'}
                </span>
            </td>
            <td className="px-3 py-2">
                <span className="text-gray-700 dark:text-gray-200">
                    {commissionBatch?.code || '—'}
                </span>
            </td>
            <td className="px-3 py-2">
                <StatusBadge isSettle={reference?.isSettle} />
            </td>
        </tr>
    )
}

const PayoutItemsSubTable = ({ row }: { row: Row<PayoutBatch> }) => {
    const items = row.original.payoutItems
    return (
        <div className="my-1 overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <div className="flex items-center gap-2 border-b border-sky-100 bg-sky-50 px-4 py-2.5 dark:border-sky-500/20 dark:bg-sky-500/10">
                <TbListDetails className="text-lg text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                    Payout items ({items.length})
                </span>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-gray-900">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2">Code</th>
                            <th className="px-3 py-2">Tax</th>
                            <th className="px-3 py-2">Total</th>
                            <th className="px-3 py-2">Sub-total</th>
                            <th className="px-3 py-2">Commission fee</th>
                            <th className="px-3 py-2">Net amount</th>
                            <th className="px-3 py-2">Commission Batch %</th>
                            <th className="px-3 py-2">Commission Batch Code</th>
                            <th className="px-3 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {items.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="px-3 py-4 text-center text-sm text-gray-500"
                                >
                                    No payout items.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <PayoutItemDetail key={item.id} item={item} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

interface PayoutListTableProps {
    data: PayoutBatch[]
    total: number
    loading: boolean
}

const PayoutListTable = ({
    data,
    total,
    loading,
}: PayoutListTableProps) => {
    const tableData = usePayoutStore((state) => state.tableData)
    const setTableData = usePayoutStore((state) => state.setTableData)
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const columns: ColumnDef<PayoutBatch>[] = useMemo(
        () => [
            {
                id: 'expand',
                header: '',
                cell: (props) => {
                    const canExpand =
                        props.row.original.payoutItems.length > 0
                    if (!canExpand) {
                        return null
                    }
                    return (
                        <button
                            type="button"
                            aria-label="Toggle payout items"
                            className="flex items-center text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
                            onClick={props.row.getToggleExpandedHandler()}
                        >
                            {props.row.getIsExpanded() ? (
                                <TbChevronDown />
                            ) : (
                                <TbChevronRight />
                            )}
                        </button>
                    )
                },
                maxSize: 40,
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
                            {fromDate} ~ {toDate}
                        </span>
                    )
                },
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
                header: 'Items',
                id: 'items',
                cell: (props) => (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {props.row.original.payoutItems.length}
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

    const handlePaginationChange = (page: number) => {
        setExpanded({})
        setTableData((prev) => ({ ...prev, page }))
    }

    const handleSelectChange = (limit: number) => {
        setExpanded({})
        setTableData((prev) => ({ ...prev, limit, page: 1 }))
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            expanded={expanded}
            onExpandedChange={setExpanded}
            getRowCanExpand={(row) => row.original.payoutItems.length > 0}
            renderSubComponent={(props) => (
                <PayoutItemsSubTable row={props.row} />
            )}
            pagingData={{
                total,
                pageIndex: tableData.page,
                pageSize: tableData.limit,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
        />
    )
}

export default PayoutListTable
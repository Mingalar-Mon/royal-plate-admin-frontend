import { useMemo } from 'react'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'
import classNames from 'classnames'
import { NumericFormat } from 'react-number-format'
import DataTable from '@/components/shared/DataTable'
import { useTransactionStore } from '@/store/transactionStore'
import TransactionTypeBadge from './TransactionTypeBadge'
import type { TransactionItem } from '@/@types/transaction'

/** Decimals arrive as JSON strings, so coerce before formatting. */
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

/**
 * The rate is stored as a fraction, so 0.1 renders as 10%.
 */
const formatRate = (rate: string | null | undefined) => {
    if (rate === null || rate === undefined || rate === '') return null
    const parsed = Number(rate)
    if (!Number.isFinite(parsed)) return null
    return `${Number((parsed * 100).toFixed(2))}%`
}

/**
 * Explains the fee without the reader re-deriving the basis: which rate, and
 * what it was applied to.
 */
const CommissionCell = ({ item }: { item: TransactionItem }) => {
    const { commissionBatch, commissionRate, commissionBase, type } = item

    if (!commissionBatch) {
        return (
            <div className="whitespace-nowrap">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    No fee
                </span>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                    No active batch
                </div>
            </div>
        )
    }

    const rate = formatRate(commissionRate)
    // commissionRate is the only reliable signal here: the list endpoint may
    // return the batch as `{ id, code }` alone, so its flags cannot be relied
    // on. A null or zero rate means this scope wasn't charged.
    const scopeCharged = rate !== null && rate !== '0%'
    // The basis only matters for reservations, and may be absent entirely.
    const basisLabel =
        type === 'reservation' &&
        commissionBatch.reservationBasis === 'TABLE_FEE_ONLY'
            ? 'table fee'
            : 'subtotal'

    return (
        <div className="whitespace-nowrap">
            <div className="font-semibold">{commissionBatch.code}</div>
            <div className="text-xs text-gray-500">
                {scopeCharged && rate
                    ? `${rate} of the ${basisLabel}`
                    : 'No fee'}
            </div>
            {commissionBase !== null && commissionBase !== undefined && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                    base <Money value={Number(commissionBase)} />
                </div>
            )}
        </div>
    )
}

interface TransactionListTableProps {
    data: TransactionItem[]
    total: number
    loading: boolean
}

const TransactionListTable = ({
    data,
    total,
    loading,
}: TransactionListTableProps) => {
    const tableData = useTransactionStore((state) => state.tableData)
    const setTableData = useTransactionStore((state) => state.setTableData)

    const columns: ColumnDef<TransactionItem>[] = useMemo(
        () => [
            {
                header: 'Reference',
                id: 'reference',
                cell: (props) => {
                    const item = props.row.original
                    const reference =
                        item.orderNumber || item.reservationNumber || '—'
                    return (
                        <span className="min-w-44 font-semibold text-gray-900 dark:text-gray-100">
                            {reference}
                        </span>
                    )
                },
            },
            {
                header: 'Time',
                accessorKey: 'created_at',
                cell: (props) => (
                    <div className="flex flex-col whitespace-nowrap">
                        <span className="text-gray-900 dark:text-gray-100">
                            {dayjs(props.row.original.created_at).format(
                                'DD/MM/YYYY',
                            )}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {dayjs(props.row.original.created_at).format(
                                'hh:mm a',
                            )}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <TransactionTypeBadge type={props.row.original.type} />
                ),
            },
            {
                header: 'Sub-total',
                accessorKey: 'subTotal',
                cell: (props) => <Money value={props.row.original.subTotal} />,
            },
            {
                header: 'Total',
                accessorKey: 'totalPrice',
                cell: (props) => (
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                        <Money value={props.row.original.totalPrice} />
                    </span>
                ),
            },
            {
                header: 'Commission fee',
                accessorKey: 'commission_fee',
                cell: (props) => (
                    <Money value={props.row.original.commission_fee} />
                ),
            },
            {
                header: 'Commission batch',
                id: 'commissionBatch',
                cell: (props) => <CommissionCell item={props.row.original} />,
            },
            {
                header: 'Settlement',
                accessorKey: 'isSettle',
                cell: (props) => {
                    const settled = props.row.original.isSettle
                    return (
                        <span
                            className={classNames(
                                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                                settled
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
                            )}
                        >
                            {settled ? 'Settled' : 'Unsettled'}
                        </span>
                    )
                },
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
        ],
        [],
    )

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, page }))
    }

    const handleSelectChange = (limit: number) => {
        setTableData((prev) => ({ ...prev, limit, page: 1 }))
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
        />
    )
}

export default TransactionListTable

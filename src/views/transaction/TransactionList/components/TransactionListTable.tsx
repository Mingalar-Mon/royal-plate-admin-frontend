import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import classNames from 'classnames'
import { NumericFormat } from 'react-number-format'
import DataTable from '@/components/shared/DataTable'
import { useTransactionStore } from '@/store/transactionStore'
import TransactionTypeBadge from './TransactionTypeBadge'
import type { TransactionItem } from '@/@types/transaction'

const Money = ({ value }: { value: number | null | undefined }) => {
    if (value === null || value === undefined) {
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
    const isReservation = type === 'reservation'
    // The scope flag decides whether a rate applied; the basis decides the base.
    const scopeEnabled = isReservation
        ? commissionBatch.perReservation
        : commissionBatch.perOrder
    const basisLabel =
        isReservation && commissionBatch.reservationBasis === 'TABLE_FEE_ONLY'
            ? 'table fee'
            : 'subtotal'

    return (
        <div className="whitespace-nowrap">
            <div className="font-semibold">{commissionBatch.code}</div>
            <div className="text-xs text-gray-500">
                {scopeEnabled && rate
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

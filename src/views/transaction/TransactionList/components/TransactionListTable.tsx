import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
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
                        <div className="min-w-44">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {reference}
                            </div>
                            <div className="text-xs text-gray-500">
                                {item.referenceId}
                            </div>
                        </div>
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
                cell: (props) => {
                    const batch = props.row.original.commissionBatch
                    if (!batch) {
                        return <span>—</span>
                    }
                    return (
                        <div className="whitespace-nowrap">
                            <div className="font-semibold">{batch.code}</div>
                            <div className="text-xs text-gray-500">
                                {Number(batch.percentage)}%
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Created',
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
import { useMemo } from 'react'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import DataTable from '@/components/shared/DataTable'
import { usePayoutStore } from '@/store/payoutStore'
import type { PayoutBatch } from '@/@types/payout'

const Money = ({ value }: { value: string | number | null | undefined }) => {
    // The breakdown columns are null on payouts created before the commission
    // split. That means "not recorded" — render an em-dash, never 0.
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

interface PayoutListTableProps {
    data: PayoutBatch[]
    total: number
    loading: boolean
}

const PayoutListTable = ({ data, total, loading }: PayoutListTableProps) => {
    const tableData = usePayoutStore((state) => state.tableData)
    const setTableData = usePayoutStore((state) => state.setTableData)

    const columns: ColumnDef<PayoutBatch>[] = useMemo(
        () => [
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

export default PayoutListTable

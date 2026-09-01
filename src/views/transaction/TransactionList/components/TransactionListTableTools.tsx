import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import { CSVLink } from 'react-csv'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbCloudDownload, TbRefresh, TbX } from 'react-icons/tb'
import { useTransactionStore } from '@/store/transactionStore'
import { apiGetAllTransactions } from '@/services/TransactionService'
import type { TransactionItem } from '@/@types/transaction'

const exportHeaders = [
    'Reference Number',
    'Type',
    'Sub-total',
    'Total Price',
    'Commission Fee',
    'Commission Batch',
    'Commission %',
]

const mapTransactionToCsvRow = (item: TransactionItem) => ({
    'Reference Number': item.orderNumber || item.reservationNumber || '—',
    'Type': item.type,
    'Sub-total': item.subTotal ?? '',
    'Total Price': item.totalPrice,
    'Commission Fee': item.commission_fee ?? '',
    'Commission Batch': item.commissionBatch?.code ?? '',
    'Commission %': item.commissionBatch
        ? Number(item.commissionBatch.percentage)
        : '',
})

const TransactionListTableTools = ({
    onRefresh,
}: {
    onRefresh: () => void
}) => {
    const { restaurantId } = useParams()
    const tableData = useTransactionStore((state) => state.tableData)
    const setTableData = useTransactionStore((state) => state.setTableData)

    const [exporting, setExporting] = useState(false)
    const [exportData, setExportData] = useState<
        ReturnType<typeof mapTransactionToCsvRow>[] | null
    >(null)
    const csvLinkRef = useRef<any>(null)

    useEffect(() => {
        if (!exportData) return

        // Auto-trigger the hidden CSVLink once the full dataset is ready.
        csvLinkRef.current?.link?.click()
        setExportData(null)
    }, [exportData])

    const handleMonthChange = (value: string) => {
        setTableData((prev) => ({ ...prev, month: value, page: 1 }))
    }

    const handleExport = async () => {
        if (!restaurantId) return

        setExporting(true)
        try {
            const items = await apiGetAllTransactions({
                restaurantId,
                ...(tableData.month
                    ? {
                          fromDate: dayjs(tableData.month)
                              .startOf('month')
                              .format('YYYY-MM-DD'),
                          toDate: dayjs(tableData.month)
                              .endOf('month')
                              .format('YYYY-MM-DD'),
                      }
                    : {}),
            })
            setExportData(items.map(mapTransactionToCsvRow))
        } catch {
            toast.push(
                <Notification type="danger" title="Export failed">
                    Could not export transactions. Please try again.
                </Notification>,
            )
        } finally {
            setExporting(false)
        }
    }

    const filename = `transactions-${
        tableData.month || 'all-time'
    }.csv`

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                    Period
                </span>
                <Input
                    type="month"
                    size="sm"
                    value={tableData.month}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    suffix={
                        tableData.month ? (
                            <button
                                type="button"
                                aria-label="Clear month filter"
                                className="flex items-center text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
                                onClick={() => handleMonthChange('')}
                            >
                                <TbX />
                            </button>
                        ) : undefined
                    }
                    className="w-52"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="default"
                    icon={<TbCloudDownload />}
                    loading={exporting}
                    onClick={handleExport}
                >
                    Export
                </Button>
                <Button
                    size="sm"
                    variant="default"
                    icon={<TbRefresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>
            </div>
            {exportData && (
                <CSVLink
                    ref={csvLinkRef}
                    data={exportData}
                    headers={exportHeaders}
                    filename={filename}
                    className="hidden"
                    target="_blank"
                />
            )}
        </div>
    )
}

export default TransactionListTableTools
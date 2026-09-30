import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import { CSVLink } from 'react-csv'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbCloudDownload, TbRefresh } from 'react-icons/tb'
import { useTransactionStore } from '@/store/transactionStore'
import { apiGetAllTransactions } from '@/services/TransactionService'
import type { TransactionItem } from '@/@types/transaction'
import type { DatePickerRangeValue } from '@/components/ui/DatePicker/DatePickerRange'

const exportHeaders = [
    'Reference Number',
    'Type',
    'Sub-total',
    'Total Price',
    'Commission Fee',
    'Commission Batch',
    'Commission Rate %',
    'Commission Base',
    'Settlement',
    'Net Amount',
]

/** The rate is a fraction, so 0.1 exports as 10. */
const toRatePercent = (rate: string | null | undefined) => {
    if (rate === null || rate === undefined || rate === '') return ''
    const parsed = Number(rate)
    if (!Number.isFinite(parsed)) return ''
    return Number((parsed * 100).toFixed(2))
}

const mapTransactionToCsvRow = (item: TransactionItem) => ({
    'Reference Number': item.orderNumber || item.reservationNumber || '—',
    Type: item.type,
    'Sub-total': item.subTotal ?? '',
    'Total Price': item.totalPrice,
    'Commission Fee': item.commission_fee ?? '',
    'Commission Batch': item.commissionBatch?.code ?? '',
    'Commission Rate %': toRatePercent(item.commissionRate),
    'Commission Base': item.commissionBase ?? '',
    Settlement: item.isSettle ? 'Settled' : 'Unsettled',
    'Net Amount': item.netAmount,
})

const TransactionListTableTools = ({
    onRefresh,
    restaurantId: restaurantIdProp,
}: {
    onRefresh: () => void
    restaurantId?: string
}) => {
    const { restaurantId: restaurantIdFromParams } = useParams()
    const restaurantId = restaurantIdProp || restaurantIdFromParams
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

    const handleRangeChange = (range: DatePickerRangeValue) => {
        const [start, end] = range
        setTableData((prev) => ({
            ...prev,
            fromDate: start ? dayjs(start).format('YYYY-MM-DD') : '',
            toDate: end ? dayjs(end).format('YYYY-MM-DD') : '',
            page: 1,
        }))
    }

    const handleExport = async () => {
        if (!restaurantId) return

        setExporting(true)
        try {
            const items = await apiGetAllTransactions({
                restaurantId,
                ...(tableData.fromDate ? { fromDate: tableData.fromDate } : {}),
                ...(tableData.toDate ? { toDate: tableData.toDate } : {}),
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

    const rangeLabel = [tableData.fromDate, tableData.toDate]
        .filter(Boolean)
        .join(' to ')
    const filename = `transactions-${rangeLabel || 'all-time'}.csv`

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                    Period
                </span>
                <DatePicker.DatePickerRange
                    clearable
                    size="sm"
                    value={
                        tableData.fromDate || tableData.toDate
                            ? [
                                  tableData.fromDate
                                      ? dayjs(tableData.fromDate).toDate()
                                      : null,
                                  tableData.toDate
                                      ? dayjs(tableData.toDate).toDate()
                                      : null,
                              ]
                            : [null, null]
                    }
                    maxDate={dayjs().subtract(1, 'day').toDate()}
                    inputFormat="YYYY-MM-DD"
                    className="w-72"
                    onChange={handleRangeChange}
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

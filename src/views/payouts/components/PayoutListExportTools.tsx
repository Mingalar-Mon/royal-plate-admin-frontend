import { useState } from 'react'
import dayjs from 'dayjs'
import { csvFormat } from 'd3-dsv'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbCloudDownload } from 'react-icons/tb'
import { usePayoutStore } from '@/store/payoutStore'
import { apiGetAllPayouts } from '@/services/TransactionService'
import type { PayoutBatch } from '@/@types/payout'

const exportHeaders: readonly string[] = [
    'Batch code',
    'Restaurant',
    'Period from',
    'Period to',
    'Orders',
    'Reservations',
    'Order commission',
    'Reservation commission',
    'Total',
    'Sub-total',
    'Commission fee',
    'Net amount',
    'Paid Date',
]

const mapPayoutToCsvRow = (item: PayoutBatch) => ({
    'Batch code': item.code,
    Restaurant: item.restaurant.name,
    'Period from': dayjs(item.fromDate).format('DD/MM/YYYY'),
    'Period to': dayjs(item.toDate).format('DD/MM/YYYY'),
    Orders: item.orderCount ?? '',
    Reservations: item.reservationCount ?? '',
    'Order commission': item.orderCommission ?? '',
    'Reservation commission': item.reservationCommission ?? '',
    Total: item.totalPrice,
    'Sub-total': item.subTotal,
    'Commission fee': item.commission_fee,
    'Net amount': item.netAmount,
    'Paid Date': dayjs(item.created_at).format('DD/MM/YYYY HH:mm'),
})

interface PayoutListExportToolsProps {
    requireRestaurant?: boolean
    restaurantId?: string
}

const PayoutListExportTools = ({
    requireRestaurant = true,
    restaurantId: restaurantIdProp,
}: PayoutListExportToolsProps) => {
    const tableData = usePayoutStore((state) => state.tableData)
    const restaurantId = restaurantIdProp ?? tableData.restaurantId
    const disabled = requireRestaurant && !restaurantId

    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        if (disabled) return

        setExporting(true)
        try {
            const items = await apiGetAllPayouts({ restaurantId })
            const rows = items.map(mapPayoutToCsvRow)
            const csv = csvFormat(rows as object[], exportHeaders)

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            link.setAttribute('download', `payouts-${restaurantId || 'all'}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast.push(
                <Notification type="success" title="Export complete">
                    Payouts exported successfully.
                </Notification>,
            )
        } catch {
            toast.push(
                <Notification type="danger" title="Export failed">
                    Could not export payouts. Please try again.
                </Notification>,
            )
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                size="sm"
                variant="default"
                icon={<TbCloudDownload />}
                loading={exporting}
                disabled={disabled}
                onClick={handleExport}
            >
                Export
            </Button>
        </div>
    )
}

export default PayoutListExportTools

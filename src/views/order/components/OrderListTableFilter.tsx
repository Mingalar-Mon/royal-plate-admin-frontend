import { Select, Input, Button } from '@/components/ui'
import { TbCalendarEvent, TbX } from 'react-icons/tb'
import { useOrderStore } from '@/store/orderStore'

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'no_show', label: 'No Show' },
]

const OrderListTableFilter = () => {
    const tableData = useOrderStore((state) => state.tableData)
    const setTableData = useOrderStore((state) => state.setTableData)

    const hasDateFilter = Boolean(tableData.fromDate || tableData.toDate)

    const handleStatusChange = (value?: string) => {
        setTableData((prev) => ({
            ...prev,
            status: value || 'all',
            pageIndex: 1,
        }))
    }

    const handleFromDateChange = (value: string) => {
        setTableData((prev) => ({
            ...prev,
            fromDate: value,
            pageIndex: 1,
        }))
    }

    const handleToDateChange = (value: string) => {
        setTableData((prev) => ({
            ...prev,
            toDate: value,
            pageIndex: 1,
        }))
    }

    const handleClearDates = () => {
        setTableData((prev) => ({
            ...prev,
            fromDate: '',
            toDate: '',
            pageIndex: 1,
        }))
    }

    return (
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <Select
                options={statusOptions}
                value={
                    statusOptions.find(
                        (opt) => opt.value === tableData.status,
                    ) || statusOptions[0]
                }
                size="sm"
                className="min-w-37.5"
                onChange={(opt) => handleStatusChange(opt?.value)}
            />
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-2.5 py-1.5 dark:border-gray-700">
                    <TbCalendarEvent className="text-base text-primary" />
                    <Input
                        type="date"
                        size="sm"
                        value={tableData.fromDate || ''}
                        aria-label="From date"
                        onChange={(e) => handleFromDateChange(e.target.value)}
                    />
                    <span className="text-gray-400">—</span>
                    <Input
                        type="date"
                        size="sm"
                        value={tableData.toDate || ''}
                        aria-label="To date"
                        onChange={(e) => handleToDateChange(e.target.value)}
                    />
                </div>
                {hasDateFilter && (
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<TbX />}
                        aria-label="Clear date filter"
                        onClick={handleClearDates}
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )
}

export default OrderListTableFilter

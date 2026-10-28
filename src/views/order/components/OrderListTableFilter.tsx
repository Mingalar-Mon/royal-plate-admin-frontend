import { useState } from 'react'
import { Select, Input, Button, Drawer, Form, FormItem } from '@/components/ui'
import { TbFilter } from 'react-icons/tb'
import { useOrderStore } from '@/store/orderStore'

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'canceled', label: 'Canceled' },
]

const OrderListTableFilter = () => {
    const [isOpen, setIsOpen] = useState(false)
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
            status: 'all',
            pageIndex: 1,
        }))
        setIsOpen(false)
    }

    const activeFilterCount = [tableData.status, tableData.fromDate, tableData.toDate]
        .filter(Boolean).length

    return (
        <>
            <Button
                className="relative"
                icon={<TbFilter />}
                onClick={() => setIsOpen(true)}
            >
                Filter
                {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                        {activeFilterCount}
                    </span>
                )}
            </Button>
            <Drawer
                title="Filter orders"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={(event) => {
                        event.preventDefault()
                        setIsOpen(false)
                    }}
                >
                    <div className="space-y-4">
                        <FormItem label="Status">
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
                        </FormItem>
                        <FormItem label="Date from">
                            <Input
                                type="date"
                                size="sm"
                                value={tableData.fromDate || ''}
                                aria-label="From date"
                                onChange={(e) => handleFromDateChange(e.target.value)}
                            />
                        </FormItem>
                        <FormItem label="Date to">
                            <Input
                                type="date"
                                size="sm"
                                value={tableData.toDate || ''}
                                aria-label="To date"
                                onChange={(e) => handleToDateChange(e.target.value)}
                            />
                        </FormItem>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <Button
                            size="sm"
                            type="button"
                            variant="default"
                            onClick={handleClearDates}
                        >
                            Clear
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={() => setIsOpen(false)}
                        >
                            Apply filters
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default OrderListTableFilter

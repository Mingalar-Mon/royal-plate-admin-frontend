import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { TbRefresh, TbX } from 'react-icons/tb'
import { useTransactionStore } from '@/store/transactionStore'

const TransactionListTableTools = ({
    onRefresh,
}: {
    onRefresh: () => void
}) => {
    const tableData = useTransactionStore((state) => state.tableData)
    const setTableData = useTransactionStore((state) => state.setTableData)

    const handleMonthChange = (value: string) => {
        setTableData((prev) => ({ ...prev, month: value, page: 1 }))
    }

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
            <Button
                size="sm"
                variant="default"
                icon={<TbRefresh />}
                onClick={onRefresh}
            >
                Refresh
            </Button>
        </div>
    )
}

export default TransactionListTableTools
import { useCommissionStore } from '@/store/commissionStore'
import { DatePicker, Select } from '@/components/ui'
import CommissionListSearch from './CommissionListSearch'

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
]

const CommissionListTableTools = () => {
    const tableData = useCommissionStore((state) => state.tableData)
    const setTableData = useCommissionStore((state) => state.setTableData)

    const selectedStatus =
        tableData.status === undefined ? 'all' : String(tableData.status)

    const handleSearch = (search: string) => {
        setTableData((prev) => ({ ...prev, search, page: 1 }))
    }

    const handleStatusChange = (value?: string) => {
        setTableData((prev) => ({
            ...prev,
            status: value === 'all' ? undefined : value === 'true',
            page: 1,
        }))
    }

    const handleDateRangeChange = (range: [Date | null, Date | null]) => {
        setTableData((prev) => ({
            ...prev,
            fromDate: range[0] || undefined,
            toDate: range[1] || undefined,
            page: 1,
        }))
    }

    return (
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <CommissionListSearch onSearch={handleSearch} />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select
                    options={statusOptions}
                    value={statusOptions.find(
                        (option) => option.value === selectedStatus,
                    )}
                    size="sm"
                    className="min-w-32.5"
                    onChange={(option) => handleStatusChange(option?.value)}
                />
                <DatePicker.DatePickerRange
                    value={[tableData.fromDate || null, tableData.toDate || null]}
                    inputFormat="DD/MM/YYYY"
                    placeholder="Select date range"
                    size="sm"
                    onChange={handleDateRangeChange}
                />
            </div>
        </div>
    )
}

export default CommissionListTableTools

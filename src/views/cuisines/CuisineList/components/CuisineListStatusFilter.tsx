import Select from '@/components/ui/Select'
import { useCuisineStore, type CuisineStatus } from '@/store/cuisineStore'

const statusOptions = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Deactivated' },
] as const

const CuisineListStatusFilter = () => {
    const status = useCuisineStore((state) => state.tableData.status)
    const setTableData = useCuisineStore((state) => state.setTableData)

    const handleStatusChange = (value?: string) => {
        const next = (value as CuisineStatus) || 'all'
        setTableData((prev) => ({ ...prev, status: next, pageIndex: 1 }))
    }

    return (
        <Select
            size="sm"
            className="min-w-[160px]"
            options={statusOptions as any}
            value={statusOptions.find((o) => o.value === status) || statusOptions[0]}
            onChange={(opt: any) => handleStatusChange(opt?.value)}
            placeholder="Filter by status"
        />
    )
}

export default CuisineListStatusFilter

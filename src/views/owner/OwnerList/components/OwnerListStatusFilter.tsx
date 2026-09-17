import Select from '@/components/ui/Select'
import { useOwnerStore, type OwnerStatus } from '@/store/ownerStore'

const statusOptions = [
    { value: 'all', label: 'All Owners' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Deactivated' },
] as const

const OwnerListStatusFilter = () => {
    const status = useOwnerStore((state) => state.tableData.status)
    const setTableData = useOwnerStore((state) => state.setTableData)

    const handleStatusChange = (value?: string) => {
        const nextStatus = (value as OwnerStatus) || 'all'
        setTableData((prev) => ({
            ...prev,
            status: nextStatus,
            pageIndex: 1,
        }))
    }

    return (
        <Select
            size="sm"
            className="min-w-[160px]"
            options={statusOptions as any}
            value={
                statusOptions.find((opt) => opt.value === status) ||
                statusOptions[0]
            }
            onChange={(opt: any) => handleStatusChange(opt?.value)}
            placeholder="Filter by status"
        />
    )
}

export default OwnerListStatusFilter

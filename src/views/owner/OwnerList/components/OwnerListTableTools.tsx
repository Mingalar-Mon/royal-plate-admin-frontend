import { useOwnerStore } from '@/store/ownerStore'
import OwnerListSearch from './OwnerListSearch' // Your input layout path
import OwnerListActionTools from './OwnerListActionTools'
import OwnerListStatusFilter from './OwnerListStatusFilter'

const OwnerListTableTools = () => {
    const setTableData = useOwnerStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        // ✅ Updates configurations query strings natively via functional callback syntax
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1, // Safe fallback reset to page 1 on input filtering modifications
        }))
    }

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <OwnerListSearch onSearch={handleSearch} />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <OwnerListStatusFilter />
                <OwnerListActionTools />
            </div>
        </div>
    )
}
export default OwnerListTableTools

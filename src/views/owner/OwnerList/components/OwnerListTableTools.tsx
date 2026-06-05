import { useOwnerStore } from '@/store/ownerStore'
import OwnerListSearch from './OwnerListSearch' // Your input layout path

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <OwnerListSearch onSearch={handleSearch} />
        </div>
    )
}
export default OwnerListTableTools

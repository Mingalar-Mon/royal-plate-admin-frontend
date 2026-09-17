import { useCuisineStore } from '@/store/cuisineStore'
import CuisineListSearch from './CuisineListSearch'
import CuisineListStatusFilter from './CuisineListStatusFilter'

const CuisineListTableTools = () => {
    const setTableData = useCuisineStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1,
        }))
    }

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CuisineListSearch onSearch={handleSearch} />
            <div className="flex items-center gap-2">
                <CuisineListStatusFilter />
            </div>
        </div>
    )
}

export default CuisineListTableTools

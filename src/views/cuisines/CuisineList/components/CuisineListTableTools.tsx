import { useCuisineStore } from '@/store/cuisineStore'
import CuisineListSearch from './CuisineListSearch'
import CuisineListStatusFilter from './CuisineListStatusFilter'
import { TbLayoutGrid, TbListDetails } from 'react-icons/tb'

const CuisineListTableTools = () => {
    const setTableData = useCuisineStore((state) => state.setTableData)
    const viewMode = useCuisineStore((state) => state.viewMode)
    const setViewMode = useCuisineStore((state) => state.setViewMode)

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
                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        className={`flex items-center justify-center px-2 py-1.5 sm:px-2.5 sm:py-2 transition-colors ${
                            viewMode === 'table'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                        title="Table view"
                    >
                        <TbListDetails className="text-base sm:text-lg" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('card')}
                        className={`flex items-center justify-center px-2 py-1.5 sm:px-2.5 sm:py-2 transition-colors ${
                            viewMode === 'card'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                        title="Card view"
                    >
                        <TbLayoutGrid className="text-base sm:text-lg" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CuisineListTableTools

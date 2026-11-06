import { useDishStore } from '@/store/dishStore'
import DishListSearch from './DishListSearch'
import DishTableFilter from './DishTableFilter'
import { TbLayoutGrid, TbListDetails } from 'react-icons/tb'

const DishListTableTools = () => {
    const { setTableData } = useDishStore()
    const viewMode = useDishStore((state) => state.viewMode)
    const setViewMode = useDishStore((state) => state.setViewMode)

    const handleInputChange = (val: string) => {
        setTableData((prev) => ({ ...prev, query: val, pageIndex: 1 }))
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700/80 dark:bg-gray-900/40">
            <div className="w-full sm:max-w-md">
                <DishListSearch onInputChange={handleInputChange} />
            </div>
            <div className="flex items-center gap-2">
                <DishTableFilter />
                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        className={`flex items-center justify-center px-2.5 py-2 transition-colors ${
                            viewMode === 'table'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                        title="Table view"
                    >
                        <TbListDetails className="text-lg" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('card')}
                        className={`flex items-center justify-center px-2.5 py-2 transition-colors ${
                            viewMode === 'card'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                        title="Card view"
                    >
                        <TbLayoutGrid className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DishListTableTools

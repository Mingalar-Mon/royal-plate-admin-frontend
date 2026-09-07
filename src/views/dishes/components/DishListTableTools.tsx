import { useDishStore } from '@/store/dishStore'
import DishListSearch from './DishListSearch'
import DishTableFilter from './DishTableFilter'

const DishListTableTools = () => {
    const { setTableData } = useDishStore()

    const handleInputChange = (val: string) => {
        setTableData((prev) => ({ ...prev, query: val, pageIndex: 1 }))
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700/80 dark:bg-gray-900/40">
            <div className="w-full sm:max-w-md">
                <DishListSearch onInputChange={handleInputChange} />
            </div>
            <DishTableFilter />
        </div>
    )
}

export default DishListTableTools

import DishListSearch from './DishListSearch'
import DishTableFilter from './DishTableFilter'
import { useDishList } from '@/utils/custom-hooks/useDish'
import cloneDeep from 'lodash/cloneDeep'

const DishListTableTools = () => {
    const { setTableData } = useDishList()

    const handleInputChange = (val: string) => {
        setTableData((prev) => ({ ...prev, query: val, pageIndex: 1 }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <DishListSearch onInputChange={handleInputChange} />
            <DishTableFilter />
        </div>
    )
}

export default DishListTableTools

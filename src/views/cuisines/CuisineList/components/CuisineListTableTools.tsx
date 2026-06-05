import { useCuisineStore } from '@/store/cuisineStore'
import CuisineListSearch from './CuisineListSearch'
import { useCuisineList } from '@/utils/custom-hooks/useCuisine'
import cloneDeep from 'lodash/cloneDeep'

const CuisineListTableTools = () => {
    // const { tableData, setTableData } = useCuisineList()
    const setTableData = useCuisineStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1,
        }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CuisineListSearch onSearch={handleSearch} />
        </div>
    )
}

export default CuisineListTableTools

import TableListSearch from './TableListSearch'
import TableFilter from './TableFilter'

import { useParams } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { useTableStore } from '@/store/tableStore'

const TableListTableTools = () => {
    // const { restaurantId } = useParams()
    // const { tableData, setTableData } = useTableList(restaurantId!)
    // const tableData = useTableStore((state) => state.tableData)
    const setTableData = useTableStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({ ...prev, query: val, pageIndex: 1 }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <TableListSearch onSearch={handleSearch} />
            {/* <TableFilter /> */}
        </div>
    )
}

export default TableListTableTools

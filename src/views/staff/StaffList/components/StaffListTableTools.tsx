import StaffListSearch from './StaffListSearch'
import StaffTableFilter from './StaffTableFilter'
import { useStaffList } from '@/utils/custom-hooks/useStaff'
import { useParams } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TableQueries } from '@/views/staff/types/staff.type'
import { Dispatch, SetStateAction } from 'react'
import { useStaffStore } from '@/store/staffStore'

// {
// tableData,
// setTableData,
// }: {
// tableData: TableQueries
// setTableData: Dispatch<SetStateAction<TableQueries>>
// }
const StaffListTableTools = () => {
    // const tableData = useStaffStore((state) => state.tableData)
    const setTableData = useStaffStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1,
        }))
        // const newData = cloneDeep(tableData)
        // newData.query = val
        // newData.pageIndex = 1
        // console.log('Search Value:', val)
        // setTableData(newData)
        // console.log('Updated Table Data:', newData)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <StaffListSearch onSearch={handleSearch} />
            <StaffTableFilter
            // tableData={tableData}
            // setTableData={setTableData}
            />
        </div>
    )
}

export default StaffListTableTools

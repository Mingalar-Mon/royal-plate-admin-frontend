import { useParams } from 'react-router'
import ReservationListSearch from './ReservationListSearch'
import ReservationTableFilter from './ReservationTableFilter'
import { useReservations } from '@/utils/custom-hooks/useReservation'
import cloneDeep from 'lodash/cloneDeep'
import { useReservationStore } from '@/store/reservationStore'

// {
//     tableData,
//     setTableData,
// }: {
//     tableData: any
//     setTableData: any
// }
const ReservationListTableTools = () => {
    // const { restaurantId } = useParams()

    // const { tableData, setTableData } = useReservations(restaurantId)
    const setTableData = useReservationStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1,
        }))
        // const newData = cloneDeep(tableData)
        // newData.query = val
        // newData.pageIndex = 1
        // setTableData((prev: any) => ({
        //     ...prev,
        //     query: val,
        //     pageIndex: 1,
        // }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <ReservationListSearch onSearch={handleSearch} />
            <ReservationTableFilter
            // tableData={tableData}
            // setTableData={setTableData}
            />
        </div>
    )
}

export default ReservationListTableTools

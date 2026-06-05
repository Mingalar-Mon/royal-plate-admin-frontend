import { Dispatch, SetStateAction } from 'react'
import OrderListSearch from './OrderListSearch'
import OrderListTableFilter from './OrderListTableFilter'
import { OrderTableData, useOrderList } from '@/utils/custom-hooks/useOrder'
import cloneDeep from 'lodash/cloneDeep'
import {
    useReservation,
    useReservations,
} from '@/utils/custom-hooks/useReservation'
import { useReservationStore } from '@/store/reservationStore'
import { useOrderStore } from '@/store/orderStore'

const OrderListTableTools = () => {
    // const { tableData, setTableData } = useOrderList()
    // const tableData = useOrderStore((state) => state.tableData)
    const setTableData = useOrderStore((state) => state.setTableData)

    const handleInputChange = (val: string) => {
        setTableData((prev: any) => ({
            ...prev,
            query: val,
            pageIndex: 1,
        }))
        // const newTableData = cloneDeep(tableData)
        // newTableData.query = val
        // newTableData.pageIndex = 1
        // setTableData(newTableData)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <OrderListSearch onInputChange={handleInputChange} />
            <OrderListTableFilter />
        </div>
    )
}

export default OrderListTableTools

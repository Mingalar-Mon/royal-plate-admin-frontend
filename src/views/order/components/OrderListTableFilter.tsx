import { Select } from '@/components/ui'
import { useOrderStore } from '@/store/orderStore'
// import { useReservationStore } from '@/store/reservationStore'
// import { useOrderList } from '@/utils/custom-hooks/useOrder'
// import { Dispatch, SetStateAction } from 'react'

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' },
]
// interface Props {
//     tableData: OrderTableData
//     setTableData: Dispatch<SetStateAction<OrderTableData>>
// }
/*Props
{ tableData, setTableData }: Props

*/
const OrderListTableFilter = () => {
    const tableData = useOrderStore((state) => state.tableData)
    const setTableData = useOrderStore((state) => state.setTableData)

    console.log('Status from state: ', tableData.status)
    console.log(
        'Evaluating status: ',
        statusOptions.find((opt) => opt.value === tableData.status),
    )
    // console.log('Evaluating all: ', statusOptions.find('all'))

    return (
        <Select
            options={statusOptions}
            value={
                statusOptions.find((opt) => opt.value === tableData.status) ||
                statusOptions[0]
            }
            size="sm"
            className="min-w-37.5"
            onChange={(opt) => {
                setTableData((prev: any) => ({
                    ...prev,
                    // ...tableData,
                    status: opt?.value || 'all',
                    pageIndex: 1,
                }))
            }}
        />
    )
}

export default OrderListTableFilter

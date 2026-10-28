import OrderListSearch from './OrderListSearch'
import OrderListTableFilter from './OrderListTableFilter'
import { useOrderStore } from '@/store/orderStore'

const OrderListTableTools = () => {
    const setTableData = useOrderStore((state) => state.setTableData)

    const handleInputChange = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1,
        }))
    }

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <OrderListSearch onInputChange={handleInputChange} />
            <OrderListTableFilter />
        </div>
    )
}

export default OrderListTableTools

// components/OrderListActionTools.tsx
import Button from '@/components/ui/Button'
import { TbRefresh } from 'react-icons/tb'

import { Order } from '@/@types/order'

interface Props {
    orderList: Order[]
    onRefresh: () => void
}

const OrderListActionTools = ({ onRefresh }: Props) => {
    // const { orderList } = useOrderList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/* <CSVLink filename="orders.csv" data={orderList}>
                <Button icon={<TbCloudDownload className="text-xl" />}>
                    Export
                </Button>
            </CSVLink> */}
            <Button
                variant="default"
                icon={<TbRefresh className="text-xl" />}
                onClick={onRefresh}
            >
                Refresh
            </Button>
        </div>
    )
}

export default OrderListActionTools

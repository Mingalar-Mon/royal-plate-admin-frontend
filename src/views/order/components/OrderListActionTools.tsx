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
        <div className="flex items-center">
            <Button
                size="sm"
                variant="default"
                icon={<TbRefresh className="text-lg" />}
                onClick={onRefresh}
            >
                <span className="hidden sm:inline">Refresh</span>
            </Button>
        </div>
    )
}

export default OrderListActionTools

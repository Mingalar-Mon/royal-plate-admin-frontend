import { useParams } from 'react-router'

import { useGetOrders } from '@/utils/custom-hooks/useOrder'
import { AdaptiveCard, Container } from '@/components/shared'

import OrderListActionTools from '../components/OrderListActionTools'
import OrderListCards from '../components/OrderListCards'
import OrderListTableTools from '../components/OrderListTableTools'

import { useOrderStore } from '@/store/orderStore'

const OrderList = () => {
    const { restaurantId } = useParams()
    const tableData = useOrderStore((state) => state.tableData)

    const { data, isLoading, refetch } = useGetOrders(restaurantId!, tableData)

    const orderList = data?.orders || []
    const orderListTotal = data?.total || 0

    // if (!orderList || !(orderList.length > 0)) return <div> No order found</div>

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3 className='text-primary'>Orders</h3>
                        {/* Card view of orders */}
                        <OrderListActionTools
                            orderList={orderList}
                            onRefresh={refetch}
                        />
                    </div>
                    <OrderListTableTools />
                    <OrderListCards
                        orderList={orderList}
                        orderListTotal={orderListTotal}
                        isLoading={isLoading}
                    />

                    {/* <OrderListTableFilter /> */}
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default OrderList

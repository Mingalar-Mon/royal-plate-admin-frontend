import { Order } from '@/@types/order'
import { useNavigate } from 'react-router'

const OrderColumn = ({ row }: { row: Order }) => {
    const navigate = useNavigate()
    // console.log('Row inside order column: ', row)

    return (
        <div
            className="cursor-pointer text-primary-600 hover:underline"
            onClick={() => navigate(`/orders/${row.id}`)}
        >
            #{row.orderNumber}
        </div>
    )
}

export default OrderColumn

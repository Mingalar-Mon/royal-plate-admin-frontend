import Card from '@/components/ui/Card'
import { TbUser, TbPhone, TbMapPin } from 'react-icons/tb'

interface OrderDetailCustomerProps {
    user?: {
        name: string
        email: string
        phone?: string // Add if available on your user record
    }
}
const OrderDetailCustomer = ({ user }: OrderDetailCustomerProps) => {
    if (!user) return null

    return (
        <Card>
            <h4 className="mb-4">Customer Details</h4>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <TbUser className="text-gray-500" />
                    <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <TbPhone className="text-gray-500" />
                    <span>{user.email || user.phone}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                    <TbMapPin className="text-gray-500" />
                    <span className="capitalize">
                        {orderTypeLabel[orderType]}
                    </span>
                </div> */}
                {/* {address && (
                    <div className="flex items-start gap-2">
                        <TbMapPin className="text-gray-500 mt-0.5" />
                        <span>{address}</span>
                    </div>
                )} */}
            </div>
        </Card>
    )
}

export default OrderDetailCustomer

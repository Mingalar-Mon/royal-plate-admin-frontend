import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { TbUser, TbPhone, TbMail } from 'react-icons/tb'
import { User } from '@/@types/order'

interface OrderDetailCustomerProps {
    user?: User
}

const OrderDetailCustomer = ({ user }: OrderDetailCustomerProps) => {
    if (!user) {
        return (
            <Card>
                <h4 className="mb-4">Customer Details</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No customer information available.
                </p>
            </Card>
        )
    }

    return (
        <Card>
            <h4 className="mb-4">Customer Details</h4>
            <div className="flex items-center gap-3 mb-4">
                <Avatar
                    size={48}
                    shape="circle"
                    src={user.profileImage || undefined}
                    icon={<TbUser />}
                />
                <div className="min-w-0">
                    <div className="font-semibold heading-text truncate">
                        {user.name || 'Unknown customer'}
                    </div>
                    {user.isVerified && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                            Verified customer
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3 text-sm">
                {user.phone && (
                    <a
                        href={`tel:${user.phone}`}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                    >
                        <TbPhone className="text-gray-500 shrink-0" />
                        <span className="truncate">{user.phone}</span>
                    </a>
                )}
                {user.email && (
                    <a
                        href={`mailto:${user.email}`}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                    >
                        <TbMail className="text-gray-500 shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </a>
                )}
                {!user.phone && !user.email && (
                    <p className="text-gray-500 dark:text-gray-400">
                        No contact details provided.
                    </p>
                )}
            </div>
        </Card>
    )
}

export default OrderDetailCustomer

import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { TbUser, TbPhone, TbMail, TbMapPin, TbInfoCircle } from 'react-icons/tb'
import { User } from '@/@types/order'

interface OrderDetailCustomerProps {
    user?: User
}

const OrderDetailCustomer = ({ user }: OrderDetailCustomerProps) => {
    if (!user) {
        return (
            <Card
                header={{
                    content: (
                        <div className="flex items-center gap-2">
                            <TbUser className="text-lg text-primary" />
                            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Customer Details
                            </h4>
                        </div>
                    ),
                    bordered: false,
                    className: 'px-5 py-4',
                }}
                bodyClass="p-5"
            >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No customer information available.
                </p>
            </Card>
        )
    }

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbUser className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Customer Details
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Avatar
                        size={48}
                        shape="circle"
                        src={user.profileImage || undefined}
                        icon={<TbUser />}
                        className="shrink-0 bg-primary/10 text-primary"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.name || 'Unknown customer'}
                        </p>
                        {user.isVerified && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                Verified customer
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {user.phone ? (
                        <a
                            href={`tel:${user.phone}`}
                            className="flex items-center gap-2 text-sm group"
                        >
                            <TbPhone className="text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                            <span className="text-gray-700 dark:text-gray-300 truncate group-hover:text-primary transition-colors">
                                {user.phone}
                            </span>
                        </a>
                    ) : (
                        <div className="flex items-center gap-2 text-sm">
                            <TbPhone className="text-gray-400 shrink-0" />
                            <span className="text-gray-400 dark:text-gray-500 italic">
                                No phone provided
                            </span>
                        </div>
                    )}

                    {user.email ? (
                        <a
                            href={`mailto:${user.email}`}
                            className="flex items-center gap-2 text-sm group"
                        >
                            <TbMail className="text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                            <span className="text-gray-700 dark:text-gray-300 truncate group-hover:text-primary transition-colors">
                                {user.email}
                            </span>
                        </a>
                    ) : (
                        <div className="flex items-center gap-2 text-sm">
                            <TbMail className="text-gray-400 shrink-0" />
                            <span className="text-gray-400 dark:text-gray-500 italic">
                                No email provided
                            </span>
                        </div>
                    )}

                    {user.address && (
                        <div className="flex items-start gap-2 text-sm">
                            <TbMapPin className="text-gray-400 shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {user.address}
                            </span>
                        </div>
                    )}
                </div>

                {user.status && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <TbInfoCircle className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Status: {user.status}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default OrderDetailCustomer

import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { TbUser, TbMail, TbPhone, TbInfoCircle } from 'react-icons/tb'
import type { User } from '../../types/reservation.type'

const UserInfo = ({ user }: { user: User }) => {
    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbUser className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Customer Information
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
                        src={user.profileImage}
                        icon={<TbUser />}
                        className="shrink-0 bg-primary/10 text-primary"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user.gender || 'Not specified'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {user.email ? (
                        <div className="flex items-center gap-2 text-sm">
                            <TbMail className="text-gray-400 shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                                {user.email}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm">
                            <TbMail className="text-gray-400 shrink-0" />
                            <span className="text-gray-400 dark:text-gray-500 italic">
                                No email provided
                            </span>
                        </div>
                    )}

                    {user.phone ? (
                        <div className="flex items-center gap-2 text-sm">
                            <TbPhone className="text-gray-400 shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                                {user.phone}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm">
                            <TbPhone className="text-gray-400 shrink-0" />
                            <span className="text-gray-400 dark:text-gray-500 italic">
                                No phone provided
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

export default UserInfo

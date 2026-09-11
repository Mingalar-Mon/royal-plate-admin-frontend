import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import dayjs from 'dayjs'
import {
    TbCalendar,
    TbCalendarEvent,
    TbMail,
    TbMapPin,
    TbPhone,
    TbShoppingBag,
    TbUserCheck,
} from 'react-icons/tb'
import UserVerifiedBadge from '@/views/users/UserDetail/components/UserVerifiedBadge'

interface UserViewModalProps {
    user: any | null
    onClose: () => void
}

const UserViewModal = ({ user, onClose }: UserViewModalProps) => {
    if (!user) return null

    return (
        <Dialog
            isOpen={Boolean(user)}
            width={560}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
                    <Avatar
                        shape="circle"
                        size={64}
                        src={user.profile?.url}
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {user.name || 'Anonymous User'}
                        </h1>
                        <div className="mt-1.5">
                            <UserVerifiedBadge
                                isVerified={user.isVerified}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                    {user.email && (
                        <div className="flex items-center gap-2.5">
                            <TbMail className="text-lg text-gray-400" />
                            <span>
                                Email Address:{' '}
                                <strong className="font-medium text-gray-900 dark:text-gray-100">
                                    {user.email}
                                </strong>
                            </span>
                        </div>
                    )}
                    {user.phone && (
                        <div className="flex items-center gap-2.5">
                            <TbPhone className="text-lg text-gray-400" />
                            <span>
                                Phone Number:{' '}
                                <strong className="font-medium text-gray-900 dark:text-gray-100">
                                    {user.phone}
                                </strong>
                            </span>
                        </div>
                    )}
                    {user.address && (
                        <div className="flex items-center gap-2.5">
                            <TbMapPin className="text-lg text-gray-400" />
                            <span>
                                Address:{' '}
                                <strong className="font-medium text-gray-900 dark:text-gray-100">
                                    {user.address}
                                </strong>
                            </span>
                        </div>
                    )}
                    {user.gender && (
                        <div className="flex items-center gap-2.5 border-t border-gray-100 pt-3.5 dark:border-gray-800">
                            <TbUserCheck className="text-lg text-gray-400" />
                            <span>
                                Gender:{' '}
                                <strong className="font-medium capitalize text-gray-900 dark:text-gray-100">
                                    {user.gender}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbShoppingBag />
                            <span>Orders</span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                            {user.ordersCount || 0}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbCalendarEvent />
                            <span>Reservations</span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                            {user.reservationsCount || 0}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbCalendar />
                            <span>Joined</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {dayjs(user.createdAt).format('DD MMM YYYY')}
                        </p>
                    </div>
                </div>

                {user.updatedAt && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <TbCalendar />
                        Last Updated:{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {dayjs(user.updatedAt).format('DD MMM YYYY, HH:mm')}
                        </span>
                    </p>
                )}
            </div>
        </Dialog>
    )
}

export default UserViewModal
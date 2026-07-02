import { useParams, useNavigate } from 'react-router'
import { useUserDetailQuery } from '@/utils/custom-hooks/useUser' // Real react-query hook
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import UserVerifiedBadge from './components/UserVerifiedBadge' // Your refactored badge path
import {
    TbArrowNarrowLeft,
    TbMail,
    TbPhone,
    TbMapPin,
    TbUserCheck,
    TbShoppingBag,
    TbCalendarEvent,
    TbCalendar,
} from 'react-icons/tb'
import dayjs from 'dayjs'

const UserDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // 1. Fetch live user details directly from your react-query custom hook
    const { data: userResponse, isLoading } = useUserDetailQuery(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    // 2. Unpack your response data object wrapper safely
    // user initially
    const user = userResponse?.data // at first this was userResponse?.data, but adjust according to your actual API response structure
    if (!user) return <div className="p-8 text-center">User not found</div>

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    {/* Top Action Back Button */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/users')}
                        >
                            Back to Users
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Profile Info Cards Grid */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        shape="circle"
                                        size={80}
                                        src={user.profile.url}
                                    />
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                            {user.name || 'Anonymous Customer'}
                                        </h1>
                                        <UserVerifiedBadge
                                            isVerified={user.isVerified}
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    Profile Details
                                </h4>
                                <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                                    {user.email && (
                                        <div className="flex items-center gap-2.5">
                                            <TbMail className="text-gray-400 text-lg" />
                                            <span>
                                                Email:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {user.email}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                    {user.phone && (
                                        <div className="flex items-center gap-2.5">
                                            <TbPhone className="text-gray-400 text-lg" />
                                            <span>
                                                Phone:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {user.phone}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                    {user.address && (
                                        <div className="flex items-start gap-2.5">
                                            <TbMapPin className="text-gray-400 text-lg mt-0.5" />
                                            <span>
                                                Address:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {user.address}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                    {user.gender && (
                                        <div className="flex items-center gap-2.5">
                                            <TbUserCheck className="text-gray-400 text-lg" />
                                            <span>
                                                Gender:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                                                    {user.gender}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Right Hand Sidebar: Activity Metrics & Timestamps */}
                        <div className="space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Customer Statistics
                                </h4>
                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbShoppingBag className="text-gray-400 text-lg" />
                                        <span>
                                            Lifetime Orders:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {user.ordersCount || 0}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendarEvent className="text-gray-400 text-lg" />
                                        <span>
                                            Reservations Built:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {user.reservationsCount || 0}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Metadata Registry
                                </h4>
                                <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Joined:{' '}
                                            {/* ✅ Dynamic binding maps straight to TypeORM camelCase columns of User entity */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(user.createdAt).format(
                                                    'DD MMM YYYY, HH:mm',
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Last Updated:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(user.updatedAt).format(
                                                    'DD MMM YYYY, HH:mm',
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </AdaptiveCard>
    )
}

export default UserDetail

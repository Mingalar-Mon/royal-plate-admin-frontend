import { useParams, useNavigate } from 'react-router'
import { useOwnerDetailQuery } from '@/utils/custom-hooks/useOwner' // Real react-query hook
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import {
    TbArrowNarrowLeft,
    TbMail,
    TbPhone,
    TbCalendar,
    TbBuildingStore,
    TbId,
} from 'react-icons/tb'
import dayjs from 'dayjs'

const OwnerDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // 1. Fetch live owner details straight from your react-query custom hook
    const { data: ownerResponse, isLoading } = useOwnerDetailQuery(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    // 2. Unpack your response data object wrapper safely
    const owner = ownerResponse?.data
    if (!owner) return <div className="p-8 text-center">Owner not found</div>

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    {/* Top Action Back Button */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/owners')}
                        >
                            Back to Owners
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Profile Info Cards Grid */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                    {owner.name}
                                </h1>
                                <p className="text-xs text-gray-400 select-all font-mono bg-gray-50 dark:bg-gray-800 p-1.5 rounded inline-block mt-1">
                                    Owner ID: {owner.id}
                                </p>
                            </Card>

                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    Contact Information
                                </h4>
                                <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbMail className="text-gray-400 text-lg" />
                                        <span>
                                            Email Address:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100 font-medium">
                                                {owner.email}
                                            </strong>
                                        </span>
                                    </div>
                                    {owner.phone && (
                                        <div className="flex items-center gap-2.5">
                                            <TbPhone className="text-gray-400 text-lg" />
                                            <span>
                                                Phone Number:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {owner.phone}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                    {owner.code && (
                                        <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                                            <TbId className="text-indigo-500 text-lg" />
                                            <span>
                                                Merchant Security Code:{' '}
                                                <strong className="font-mono text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded ml-1 font-bold">
                                                    {owner.code}
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
                                    Business Statistics
                                </h4>
                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbBuildingStore className="text-gray-400 text-lg" />
                                        <span>
                                            Owned Restaurants:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {owner.restaurants?.length || 0}
                                                {/* {owner.restaurantsCount || 0} */}
                                            </strong>{' '}
                                            Properties
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Account Registry
                                </h4>
                                <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Joined Base:{' '}
                                            {/* ✅ Dynamic binding maps straight to TypeORM snake_case columns */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(owner.created_at).format(
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
                                                {dayjs(owner.updated_at).format(
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

export default OwnerDetail

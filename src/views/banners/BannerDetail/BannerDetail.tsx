import { useParams, useNavigate } from 'react-router'
import { useBannerDetailQuery } from '@/utils/custom-hooks/useBanner' // Production react-query hook
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbCalendar,
    TbLink,
    TbUser,
} from 'react-icons/tb'
import dayjs from 'dayjs'
import { ActionLink } from '@/components/shared'

// Simple UI badge fallback placeholder – change path to match your layout folder setup if needed
const BannerTypeBadge = ({ type }: { type: string }) => (
    <span
        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            type === 'in_app'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
        }`}
    >
        {type.replace('_', ' ')}
    </span>
)

const BannerDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const urlRegex =
        /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/g

    // 1. Fetch live promotional banner dataset via our synchronized query hook
    const { data: bannerResponse, isLoading } = useBannerDetailQuery(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    // 2. Unpack your TypeORM backend response envelope envelope safely
    const banner = bannerResponse?.data
    if (!banner) return <div className="p-8 text-center">Banner not found</div>

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    {/* Top Action Panel Rows Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/banners')}
                        >
                            Back to Banners
                        </Button>
                        <Button
                            variant="solid"
                            icon={<TbEdit />}
                            onClick={() =>
                                navigate(`/banners/edit/${banner.id}`)
                            }
                        >
                            Edit Banner
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Main Splitted Media Preview Card Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="overflow-hidden border dark:border-gray-800 shadow-sm p-2 bg-gray-50 dark:bg-gray-800/20">
                                <img
                                    src={banner.image.url}
                                    alt="Promotional campaign banner preview"
                                    className="w-full rounded-lg object-contain max-h-[500px] mx-auto select-none"
                                />
                            </Card>
                        </div>

                        {/* Right Sidebar Metadata Fields Information Metrics Card */}
                        <div className="space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    Banner Information
                                </h4>
                                <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            Campaign Destination:
                                        </span>
                                        <BannerTypeBadge type={banner.type} />
                                    </div>
                                    <div className="flex items-center gap-2.5 border-t border-gray-100 dark:border-gray-800 pt-3">
                                        <TbLink className="text-gray-400 text-lg shrink-0" />
                                        <span className="truncate">
                                            Linked Target Restaurant ID:{' '}
                                            {!urlRegex.test(
                                                banner.linkToRestaurant,
                                            ) ? (
                                                <strong className="text-gray-900 dark:text-gray-100 block mt-0.5 font-medium text-xs break-all bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                    {banner.linkToRestaurant}
                                                </strong>
                                            ) : (
                                                <ActionLink
                                                    href={
                                                        banner.linkToRestaurant
                                                    }
                                                    className="cursor-pointer block"
                                                >
                                                    {banner.linkToRestaurant}
                                                </ActionLink>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbUser className="text-gray-400 text-lg" />
                                        <span>
                                            Authorizing Admin:{' '}
                                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                                {banner.authorAdmin?.name ||
                                                    'System Admin'}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Created:{' '}
                                            {/* ✅ Dynamic binding maps straight to TypeORM snake_case key strings */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(
                                                    banner.created_at,
                                                ).format('DD MMM YYYY, HH:mm')}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Updated:{' '}
                                            {/* ✅ Dynamic binding maps straight to TypeORM snake_case key strings */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(
                                                    banner.updated_at,
                                                ).format('DD MMM YYYY, HH:mm')}
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

export default BannerDetail

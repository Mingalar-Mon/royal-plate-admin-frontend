import { useParams, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbClock,
    TbPhone,
    TbWorld,
    TbCar,
    TbShirt,
    TbAccessible,
    TbTable,
    TbCreditCard,
    TbLocation,
    TbStar,
    TbStarFilled,
    TbReceipt,
    TbCoin,
    TbMenu2,
} from 'react-icons/tb'
import { useGetRestaurantProfile } from '@/utils/custom-hooks/useRestaurantProfile'
import PageLoading from '@/components/shared/PageLoading'
import RestaurantImageGallery from './components/RestaurantImageGallery'
import LocationView from './components/LocationView'
import { useEffect, type ReactNode } from 'react'
import { useRestaurantStore } from '@/store/restaurantStore'

const formatTime = (totalMinutes: number) => {
    if (totalMinutes === undefined || totalMinutes === null) return '--:--'

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const displayMinutes = minutes.toString().padStart(2, '0')

    return `${displayHour}:${displayMinutes} ${period}`
}

const formatPrice = (price?: number | string | null) => {
    const value = Number(price)
    if (!price || Number.isNaN(value)) return '--'
    return value.toLocaleString('en-US')
}

const RatingStars = ({ rating }: { rating: number }) => {
    const rounded = Math.round(rating)
    return (
        <span className="inline-flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) =>
                star <= rounded ? (
                    <TbStarFilled key={star} size={16} />
                ) : (
                    <TbStar key={star} size={16} className="text-gray-300 dark:text-gray-600" />
                ),
            )}
        </span>
    )
}

const InfoRow = ({
    icon,
    label,
    children,
}: {
    icon: ReactNode
    label: string
    children: ReactNode
}) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 text-gray-500">{icon}</span>
        <div>
            <p className="font-medium text-sm text-gray-500">{label}</p>
            <div className="text-gray-800 dark:text-gray-200">{children}</div>
        </div>
    </div>
)

const RestaurantProfilePage = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const { setActiveRestaurant } = useRestaurantStore()

    const { data: profile, isLoading } = useGetRestaurantProfile(
        restaurantId as string,
    )

    useEffect(() => {
        setActiveRestaurant(
            profile
                ? {
                    id: profile.data.restaurant.id,
                    name: profile.data.restaurant.name,
                }
                : null,
        )
    }, [profile, setActiveRestaurant])

    if (isLoading) {
        return <PageLoading label="Loading restaurant profile" />
    }

    if (!profile) {
        return (
            <Container>
                <div className="py-6">
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">
                            No Profile Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            This restaurant doesn&apos;t have a profile yet.
                        </p>
                    </div>
                </div>
            </Container>
        )
    }

    const restaurant = profile.data.restaurant
    const images = (restaurant.images || []).map((img) => img.url)
    const logoUrl = restaurant.logo?.url
    const rating = Number(restaurant.averageRating ?? 0)
    const totalReviews = restaurant.totalReviews ?? 0
    const dishCount = restaurant.dishes?.length ?? 0
    const tableCount = restaurant.tables?.length ?? 0

    const hasPriceRange =
        restaurant.startingPrice != null && restaurant.endingPrice != null

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                <Button
                    variant="plain"
                    icon={<TbArrowNarrowLeft />}
                    aria-label="Back to Restaurant Dashboard"
                    className="flex-wrap min-w-fit"
                    onClick={() => navigate('/owner/dashboard')}
                >
                    <span className="hidden sm:inline">
                        Back to Restaurant
                        <br />
                        Dashboard
                    </span>
                </Button>
                <Button
                    variant="solid"
                    icon={<TbEdit />}
                    className="flex-wrap min-w-fit"
                    onClick={() =>
                        navigate(
                            `/restaurant/update-restaurant-profile/${restaurant.id}/${profile.data.id}`,
                        )
                    }
                >
                    Edit Profile
                </Button>
            </div>

            {/* Hero Summary */}
            <Card className="mb-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={restaurant.name}
                            className="h-28 w-28 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                        />
                    ) : (
                        <div className="h-28 w-28 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary text-4xl font-bold shrink-0">
                            {restaurant.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {restaurant.name}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm font-medium">
                                <RatingStars rating={rating} />
                                {rating.toFixed(1)}
                                <span className="text-gray-500 dark:text-gray-400 font-normal">
                                    ({totalReviews}{' '}
                                    {totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </span>
                        </div>
                        <p className="mt-1.5 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <TbLocation size={16} />
                            {restaurant.address}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {hasPriceRange && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium">
                                    <TbCoin size={16} />
                                    {formatPrice(restaurant.startingPrice)} –{' '}
                                    {formatPrice(restaurant.endingPrice)}
                                </span>
                            )}
                            {restaurant.tax != null && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    <TbReceipt size={16} />
                                    Tax {Number(restaurant.tax)}%
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                                <TbClock size={16} />
                                {formatTime(profile.data.openingHour)} –{' '}
                                {formatTime(profile.data.closingHour)}
                            </span>
                            {dishCount > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    <TbMenu2 size={16} />
                                    {dishCount} dishes
                                </span>
                            )}
                            {tableCount > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    <TbTable size={16} />
                                    {tableCount} tables
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <RestaurantImageGallery
                title={restaurant.name}
                images={images}
            />

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
                {/* Main Info - Left Column */}
                <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
                    {/* Description */}
                    <Card>
                        <h4 className="mb-4 text-primary">About</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {profile.data.description}
                        </p>
                    </Card>

                    {/* Operating Hours */}
                    <Card>
                        <h4 className="mb-4 flex items-center gap-2 text-primary">
                            <TbClock />
                            Operating Hours
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 text-primary border-b dark:border-gray-700">
                                <span className="font-medium">
                                    Opening Time
                                </span>
                                <span>
                                    {formatTime(profile.data.openingHour)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 text-primary">
                                <span className="font-medium">
                                    Closing Time
                                </span>
                                <span>
                                    {formatTime(profile.data.closingHour)}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Cuisines */}
                    <Card>
                        <h4 className="mb-4 flex text-primary items-center gap-2">
                            <TbTable />
                            Cuisines
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {profile.data.cuisines.map((cuisine) => (
                                <span
                                    key={cuisine.id}
                                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                                >
                                    {cuisine.name}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card>
                        <h4 className="mb-4 text-primary">
                            Contact Information
                        </h4>
                        <div className="space-y-3">
                            <InfoRow icon={<TbPhone />} label="Phone">
                                {profile.data.contactNumber}
                            </InfoRow>
                            {profile.data.websiteUrl && (
                                <InfoRow icon={<TbWorld />} label="Website">
                                    <a
                                        href={profile.data.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:underline break-all"
                                    >
                                        {profile.data.websiteUrl}
                                    </a>
                                </InfoRow>
                            )}
                            <InfoRow icon={<TbLocation />} label="Address">
                                {restaurant.address}
                            </InfoRow>
                        </div>
                    </Card>

                    {/* Pricing & Tax */}
                    <Card>
                        <h4 className="mb-4 flex items-center gap-2 text-primary">
                            <TbReceipt />
                            Pricing & Tax
                        </h4>
                        <div className="space-y-3">
                            <InfoRow icon={<TbCoin />} label="Price Range">
                                {hasPriceRange
                                    ? `${formatPrice(restaurant.startingPrice)} – ${formatPrice(restaurant.endingPrice)} MMK`
                                    : 'Not set'}
                            </InfoRow>
                            <InfoRow icon={<TbReceipt />} label="Tax">
                                {restaurant.tax != null
                                    ? `${Number(restaurant.tax)}%`
                                    : 'Not set'}
                            </InfoRow>
                        </div>
                    </Card>

                    {/* Amenities */}
                    <Card>
                        <h4 className="mb-4 text-primary">Amenities</h4>
                        <div className="space-y-3">
                            <InfoRow icon={<TbCar />} label="Parking">
                                {profile.data.parking
                                    ? 'Available'
                                    : 'Not Available'}
                            </InfoRow>
                            {profile.data.dressCode && (
                                <InfoRow icon={<TbShirt />} label="Dress Code">
                                    {profile.data.dressCode}
                                </InfoRow>
                            )}
                            {profile.data.accessibility && (
                                <InfoRow
                                    icon={<TbAccessible />}
                                    label="Accessibility"
                                >
                                    {profile.data.accessibility}
                                </InfoRow>
                            )}
                        </div>
                    </Card>

                    {/* Payment Methods */}
                    <Card>
                        <h4 className="mb-4 flex items-center gap-2 text-primary">
                            <TbCreditCard />
                            Payment Methods
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {profile.data.paymentMethods.map((method) => (
                                <span
                                    key={method.id}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm flex items-center gap-1"
                                >
                                    {method.image && (
                                        <img
                                            src={method.image.url}
                                            alt={method.name}
                                            className="w-4 h-4 object-contain"
                                        />
                                    )}
                                    {method.name}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Location */}
            {restaurant.latitude && restaurant.longitude && (
                <LocationView
                    latitude={Number(restaurant.latitude)}
                    longitude={Number(restaurant.longitude)}
                    restaurantName={restaurant.name}
                    address={restaurant.address}
                />
            )}
        </div>
    )
}

export default RestaurantProfilePage

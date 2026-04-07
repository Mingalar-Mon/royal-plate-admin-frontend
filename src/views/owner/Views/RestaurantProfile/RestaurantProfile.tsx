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
} from 'react-icons/tb'
import { useGetRestaurantProfile } from '../../hooks/useRestaurantProfile'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import RestaurantImageGallery from './components/RestaurantImageGallery'
import LocationView from './components/LocationView'

const RestaurantProfilePage = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const layoutType = useThemeStore((state) => state.layout.type)
    console.log(restaurantId)

    const { data: profile, isLoading } = useGetRestaurantProfile(
        restaurantId as string,
    )

    const formatTime = (hour: number) => {
        const period = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${displayHour}:00 ${period}`
    }

    if (isLoading) {
        return (
            <PostLoginLayout layoutType={layoutType}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            </PostLoginLayout>
        )
    }

    if (!profile) {
        return (
            <PostLoginLayout layoutType={layoutType}>
                <Container>
                    <div className="py-6">
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">
                                No Profile Found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                This restaurant doesn't have a profile yet.
                            </p>
                            <Button
                                variant="solid"
                                onClick={() =>
                                    navigate(
                                        `/restaurants/${restaurantId}/profile/create`,
                                    )
                                }
                            >
                                Create Profile
                            </Button>
                        </div>
                    </div>
                </Container>
            </PostLoginLayout>
        )
    }
    // console.log('Restaurant Profile', profile)
    // profile.cuisines = MOCK_CUISINES
    // profile.paymentMethods = MOCK_PAYMENT_METHODS

    return (
        <PostLoginLayout layoutType={layoutType}>
            <Container>
                <div className="py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate(`/owner/dashboard`)}
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            variant="solid"
                            icon={<TbEdit />}
                            onClick={() => {
                                return navigate(
                                    `/restaurant/profile/edit/${profile.id}`,
                                )
                            }}
                        >
                            Edit Profile
                        </Button>
                    </div>

                    <RestaurantImageGallery
                        title={profile.restaurant.name}
                        images={profile.restaurant.imageUrls}
                    />
                    {/* Profile Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
                        {/* Main Info - Left Column */}
                        <div className="lg:col-span-2 flex flex-col justify-between space-y-6    ">
                            {/* Description */}
                            <Card>
                                <h4 className="mb-4">About</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {profile.description}
                                </p>
                            </Card>

                            {/* Hours */}
                            <Card>
                                <h4 className="mb-4 flex items-center gap-2">
                                    <TbClock />
                                    Operating Hours
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                                        <span className="font-medium">
                                            Opening Time
                                        </span>
                                        <span>
                                            {formatTime(profile.openingHour)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-medium">
                                            Closing Time
                                        </span>
                                        <span>
                                            {formatTime(profile.closingHour)}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Cuisines */}
                            <Card>
                                <h4 className="mb-4 flex items-center gap-2">
                                    <TbTable />
                                    Cuisines
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.cuisines.map((cuisine) => (
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
                        <div className="space-y-6 ">
                            {/* Contact Info */}
                            <Card>
                                <h4 className="mb-4">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <TbPhone className="mt-0.5 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-sm text-gray-500">
                                                Phone
                                            </p>
                                            <p>{profile.contactNumber}</p>
                                        </div>
                                    </div>
                                    {profile.websiteUrl && (
                                        <div className="flex items-start gap-3">
                                            <TbWorld className="mt-0.5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-sm text-gray-500">
                                                    Website
                                                </p>
                                                <a
                                                    href={profile.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-600 hover:underline"
                                                >
                                                    {profile.websiteUrl}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <TbLocation className="mt-0.5 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-sm text-gray-500">
                                                Address
                                            </p>
                                            <p>{profile.restaurant.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Amenities */}
                            <Card>
                                <h4 className="mb-4">Amenities</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <TbCar className="text-gray-500" />
                                        <span>
                                            Parking:{' '}
                                            {profile.parking
                                                ? 'Available'
                                                : 'Not Available'}
                                        </span>
                                    </div>
                                    {profile.dressCode && (
                                        <div className="flex items-center gap-3">
                                            <TbShirt className="text-gray-500" />
                                            <span>
                                                Dress Code: {profile.dressCode}
                                            </span>
                                        </div>
                                    )}
                                    {profile.accessibility && (
                                        <div className="flex items-center gap-3">
                                            <TbAccessible className="text-gray-500" />
                                            <span>
                                                Accessibility:{' '}
                                                {profile.accessibility}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Payment Methods */}
                            <Card>
                                <h4 className="mb-4 flex items-center gap-2">
                                    <TbCreditCard />
                                    Payment Methods
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.paymentMethods.map((method) => (
                                        <span
                                            key={method.id}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {method.icon && (
                                                <span>{method.icon}</span>
                                            )}
                                            {method.name}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                    {/* location */}
                    <LocationView
                        latitude={profile.restaurant.latitude}
                        longitude={profile.restaurant.longitude}
                        restaurantName={profile.restaurant.name}
                        address={profile.restaurant.address}
                    />
                </div>
            </Container>
        </PostLoginLayout>
    )
}

export default RestaurantProfilePage

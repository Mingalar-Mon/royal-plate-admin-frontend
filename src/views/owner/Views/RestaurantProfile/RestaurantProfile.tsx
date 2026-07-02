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
// import { useGetRestaurantProfile } from '../../hooks/useRestaurantProfile'
import { useGetRestaurantProfile } from '@/utils/custom-hooks/useRestaurantProfile'
import RestaurantImageGallery from './components/RestaurantImageGallery'
import LocationView from './components/LocationView'
import { useEffect } from 'react'
import { useRestaurantStore } from '@/store/restaurantStore'

const RestaurantProfilePage = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const { setActiveRestaurant } = useRestaurantStore()

    const { data: profile, isLoading } = useGetRestaurantProfile(
        restaurantId as string,
    )

    useEffect(() => {
        console.log('Use effect got run')
        setActiveRestaurant(
            profile
                ? {
                      id: profile.data.restaurant.id,
                      name: profile.data.restaurant.name,
                  }
                : null,
        )
    }, [profile, setActiveRestaurant])

    // const formatTime = (hour: number) => {
    //     console.log('Hour: ', hour)
    //     const period = hour >= 12 ? 'PM' : 'AM'
    //     const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    //     return `${displayHour}:00 ${period}`
    // }

    const formatTime = (totalMinutes: number) => {
        // If data hasn't loaded or is undefined
        if (totalMinutes === undefined || totalMinutes === null) return '--:--'

        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        const displayMinutes = minutes.toString().padStart(2, '0')

        return `${displayHour}:${displayMinutes} ${period}`
    }

    const handleBackToDashboard = () => {
        setActiveRestaurant(null)
        navigate(`/owner/dashboard`)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
        )
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
        )
    }

    const images = profile.data.restaurant.images.map((img) => img.url)

    return (
        // <Container>
        <div className="py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="plain"
                    icon={<TbArrowNarrowLeft />}
                    onClick={handleBackToDashboard}
                >
                    Back to Dashboard
                </Button>
                <Button
                    variant="solid"
                    icon={<TbEdit />}
                    onClick={() => {
                        return navigate(
                            `/restaurant/update-restaurant-profile/${profile.data.id}`,
                        )
                    }}
                >
                    Edit Profile
                </Button>
            </div>

            <RestaurantImageGallery
                title={profile.data.restaurant.name}
                images={images}
            />
            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
                {/* Main Info - Left Column */}
                <div className="lg:col-span-2 flex flex-col justify-between space-y-6    ">
                    {/* Description */}
                    <Card>
                        <h4 className="mb-4">About</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {profile.data.description}
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
                                    {formatTime(profile.data.openingHour)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
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
                        <h4 className="mb-4 flex items-center gap-2">
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
                                    <p>{profile.data.contactNumber}</p>
                                </div>
                            </div>
                            {profile.data.websiteUrl && (
                                <div className="flex items-start gap-3">
                                    <TbWorld className="mt-0.5 text-gray-500" />
                                    <div>
                                        <p className="font-medium text-sm text-gray-500">
                                            Website
                                        </p>
                                        <a
                                            href={profile.data.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:underline"
                                        >
                                            {profile.data.websiteUrl}
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
                                    <p>{profile.data.restaurant.address}</p>
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
                                    {profile.data.parking
                                        ? 'Available'
                                        : 'Not Available'}
                                </span>
                            </div>
                            {profile.data.dressCode && (
                                <div className="flex items-center gap-3">
                                    <TbShirt className="text-gray-500" />
                                    <span>
                                        Dress Code: {profile.data.dressCode}
                                    </span>
                                </div>
                            )}
                            {profile.data.accessibility && (
                                <div className="flex items-center gap-3">
                                    <TbAccessible className="text-gray-500" />
                                    <span>
                                        Accessibility:{' '}
                                        {profile.data.accessibility}
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
            {/* location */}
            {profile.data.restaurant.latitude &&
                profile.data.restaurant.longitude && (
                    <LocationView
                        latitude={profile.data.restaurant.latitude}
                        longitude={profile.data.restaurant.longitude}
                        restaurantName={profile.data.restaurant.name}
                        address={profile.data.restaurant.address}
                    />
                )}
        </div>
        // </Container>
    )
}

export default RestaurantProfilePage

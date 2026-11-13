import { useRef, useState, type ReactNode } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import NoProductFound from '@/assets/svg/NoProductFound'
import {
    TbArrowNarrowLeft,
    TbDeviceFloppy,
    TbBuilding,
    TbFileText,
} from 'react-icons/tb'
import RestaurantForm, {
    type RestaurantFormHandle,
} from './components/RestaurantForm'
import RestaurantProfileForm, {
    type RestaurantProfileFormHandle,
} from '../RestaurantProfile/components/RestaurantProfileForm'
import type { RestaurantFormSchema } from './types/restaurantForm.types'
import {
    useGetRestaurant,
    useUpdateRestaurant,
} from '@/utils/custom-hooks/useRestaurant'
import { RestaurantFormInput } from '@/@types/restaurant.type'

type Tab = 'restaurant' | 'profile'

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
    { key: 'restaurant', label: 'Restaurant Details', icon: <TbBuilding /> },
    { key: 'profile', label: 'Profile Details', icon: <TbFileText /> },
]

const EditRestaurant = () => {
    const { restaurantId, profileId } = useParams()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const tabParam = searchParams.get('tab')
    const activeTab: Tab =
        tabParam === 'profile' || (!tabParam && !!profileId)
            ? 'profile'
            : 'restaurant'

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [profileSubmitting, setProfileSubmitting] = useState(false)

    const restaurantFormRef = useRef<RestaurantFormHandle>(null)
    const profileFormRef = useRef<RestaurantProfileFormHandle>(null)

    if (!restaurantId) {
        return <div>No restaurant id provided</div>
    }
    const { data: restaurantJson, isLoading } = useGetRestaurant(restaurantId)

    const { mutate: updateRestaurant } = useUpdateRestaurant()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Loading restaurant...
                </p>
            </div>
        )
    }

    if (!restaurantJson?.data) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoProductFound height={280} width={280} />
                <h3 className="mt-8">No restaurant found!</h3>
                <Button
                    className="mt-4"
                    onClick={() => navigate('/owner/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </div>
        )
    }

    const defaultValues: RestaurantFormInput = {
        name: restaurantJson.data.name,
        address: restaurantJson.data.address,
        startingPrice: restaurantJson.data.startingPrice,
        endingPrice: restaurantJson.data.endingPrice,
        tax: restaurantJson.data.tax,
        latitude: restaurantJson.data.latitude,
        longitude: restaurantJson.data.longitude,
        logoImage: restaurantJson.data.logoImage,
        images: restaurantJson.data.images || [],
        deletedImageKeys: [],
    }

    const setTab = (tab: Tab) => {
        setSearchParams({ tab })
    }

    const handleSave = () => {
        if (activeTab === 'restaurant') {
            restaurantFormRef.current?.submit()
        } else {
            profileFormRef.current?.submit()
        }
    }

    const handleFormSubmit = async (formData: RestaurantFormSchema) => {
        setIsSubmitting(true)
        try {
            const body = new FormData()
            body.append('name', formData.name)
            body.append('address', formData.address)
            body.append('startingPrice', String(formData.startingPrice))
            body.append('endingPrice', String(formData.endingPrice))
            body.append('latitude', String(formData.latitude))
            body.append('longitude', String(formData.longitude))
            body.append('tax', String(formData.tax))

            formData.images.forEach((img) => {
                if (img instanceof File) {
                    body.append('newImages', img)
                }
            })

            if (formData.logoImage instanceof File) {
                body.append('logo', formData.logoImage)
            }

            updateRestaurant(
                { id: restaurantId!, data: body as any },
                {
                    onSuccess: () =>
                        navigate(
                            `/restaurant/restaurant-profile/${restaurantId}`,
                        ),
                    onSettled: () => setIsSubmitting(false),
                },
            )
        } catch (error: any) {
            toast.push(
                Notification({
                    type: 'danger',
                    title: 'Error updating restaurant',
                    children: error,
                }),
            )
        }
    }

    const isSaving = isSubmitting || profileSubmitting

    return (
        <>
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Edit {restaurantJson.data.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Update restaurant details and profile
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="plain"
                            size="sm"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() =>
                                navigate(
                                    `/restaurant/restaurant-profile/${restaurantId}`,
                                )
                            }
                        >
                            <span className="hidden sm:inline">
                                Back to Profile
                            </span>
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            size="sm"
                            icon={<TbDeviceFloppy />}
                            loading={isSaving}
                            onClick={handleSave}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mt-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                activeTab === tab.key
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                            onClick={() => setTab(tab.key)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </Container>

            {activeTab === 'restaurant' ? (
                <RestaurantForm
                    ref={restaurantFormRef}
                    defaultValues={defaultValues}
                    isNew={false}
                    onFormSubmit={handleFormSubmit}
                />
            ) : (
                <RestaurantProfileForm
                    ref={profileFormRef}
                    isEditMode={true}
                    embedded={true}
                    onSubmittingChange={setProfileSubmitting}
                />
            )}
        </>
    )
}

export default EditRestaurant

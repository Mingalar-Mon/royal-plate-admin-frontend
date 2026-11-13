import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NoProductFound from '@/assets/svg/NoProductFound'
import {
    TbTrash,
    TbArrowNarrowLeft,
    TbDeviceFloppy,
    TbBuilding,
    TbFileText,
} from 'react-icons/tb'
import RestaurantForm from './components/RestaurantForm'
import RestaurantProfileForm from '../RestaurantProfile/components/RestaurantProfileForm'
import type { RestaurantFormSchema } from './types/restaurantForm.types'
import {
    useGetRestaurant,
    useUpdateRestaurant,
    useDeleteRestaurant,
} from '@/utils/custom-hooks/useRestaurant'
import { RestaurantFormInput } from '@/@types/restaurant.type'

type Tab = 'restaurant' | 'profile'

const EditRestaurant = () => {
    const { restaurantId, profileId } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>(
        profileId ? 'profile' : 'restaurant',
    )
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!restaurantId) {
        return <div>No restaurant id provided</div>
    }
    const { data: restaurantJson, isLoading } = useGetRestaurant(restaurantId)

    const { mutate: updateRestaurant } = useUpdateRestaurant()
    const { mutate: deleteRestaurant } = useDeleteRestaurant()

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

    console.log('Populating form with restaurant data: ', restaurantJson.data)

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

    const handleFormSubmit = async (formData: RestaurantFormSchema) => {
        console.log('In the form submit fn ')
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

            const existingImages: { key: string; url: string }[] = []
            formData.images.forEach((img) => {
                if (img instanceof File) {
                    body.append('newImages', img)
                } else {
                    existingImages.push(img)
                }
            })

            if (formData.logoImage instanceof File) {
                body.append('logo', formData.logoImage)
            }

            formData.images.forEach((img) => {
                if (img instanceof File) body.append('newImages', img)
            })

            updateRestaurant(
                { id: restaurantId!, data: body as any },
                {
                    onSuccess: () => navigate('/owner/dashboard'),
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

    const handleDelete = async () => {
        try {
            deleteRestaurant(restaurantId!, {
                onSuccess: () => navigate('/owner/dashboard'),
            })
            toast.push(
                <Notification type="success">
                    Restaurant deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/owner/dashboard')
        } catch (error: any) {
            toast.push(
                Notification({
                    type: 'danger',
                    title: 'Error updating restaurant',
                    children: error,
                }),
            )
        }
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {activeTab === 'restaurant'
                            ? 'Edit Restaurant Details'
                            : 'Edit Restaurant Profile'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activeTab === 'restaurant'
                            ? 'Update basic restaurant information'
                            : 'Update restaurant profile details'}
                    </p>
                </div>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'restaurant' ? 'solid' : 'plain'}
                        icon={<TbBuilding />}
                        onClick={() => setActiveTab('restaurant')}
                    >
                        Restaurant Details
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'profile' ? 'solid' : 'plain'}
                        icon={<TbFileText />}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Details
                    </Button>
                </div>
            </div>

            {activeTab === 'restaurant' ? (
                <RestaurantForm
                    defaultValues={defaultValues}
                    isNew={false}
                    onFormSubmit={handleFormSubmit}
                >
                    <Button
                        type="button"
                        variant="plain"
                        size="xs"
                        icon={<TbArrowNarrowLeft />}
                        className="!px-2 flex items-center justify-center"
                        onClick={() => navigate('/owner/dashboard')}
                    >
                        <span className="hidden sm:inline">
                            Back to Dashboard
                        </span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="default"
                            size="xs"
                            icon={<TbTrash />}
                            className="text-red-500 hover:text-red-600 !px-2 flex items-center justify-center"
                            onClick={() => setDeleteConfirmationOpen(true)}
                        >
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            size="xs"
                            icon={<TbDeviceFloppy />}
                            className="!px-2 flex items-center justify-center"
                            loading={isSubmitting}
                        >
                            <span className="hidden sm:inline">
                                Save Changes
                            </span>
                        </Button>
                    </div>
                </RestaurantForm>
            ) : (
                <RestaurantProfileForm isEditMode={true} />
            )}

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Restaurant"
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to remove{' '}
                    <strong>{restaurantJson.data.name}</strong>? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default EditRestaurant

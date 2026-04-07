import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NoProductFound from '@/assets/svg/NoProductFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import RestaurantForm from './components/RestaurantForm'
import type { RestaurantFormSchema } from './types/restaurantForm.types'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import {
    useDeleteRestaurant,
    useGetRestaurant,
    useUpdateRestaurant,
} from '../../hooks/useRestaurant'

const EditRestaurant = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const layoutType = useThemeStore((state) => state.layout.type)

    const { data: restaurantJson, isLoading } = useGetRestaurant(
        restaurantId as string,
    )

    const updateMutation = useUpdateRestaurant()
    const deleteMutation = useDeleteRestaurant()

    if (isLoading) {
        return (
            <PostLoginLayout layoutType={layoutType}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            </PostLoginLayout>
        )
    }

    if (!restaurantJson) {
        return (
            <PostLoginLayout layoutType={layoutType}>
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
            </PostLoginLayout>
        )
    }

    const defaultValues: RestaurantFormSchema = {
        name: restaurantJson.data.name,
        address: restaurantJson.data.address,
        startingPrice: restaurantJson.data.startingPrice,
        endingPrice: restaurantJson.data.endingPrice,
        latitude: restaurantJson.data.latitude,
        longitude: restaurantJson.data.longitude,
        imageUrls: restaurantJson.data.imageUrls || [],
        staffIds: restaurantJson.data.staff?.map((s: any) => s.id) || [],
    }

    const handleFormSubmit = async (formData: RestaurantFormSchema) => {
        setIsSubmitting(true)
        try {
            const cleanedData = {
                ...formData,
                startingPrice: Number(formData.startingPrice),
                endingPrice: Number(formData.endingPrice),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
            }
            console.log('Clean Data', cleanedData)
            updateMutation.mutate({
                id: restaurantId as string,
                data: cleanedData,
            })
            toast.push(
                <Notification type="success">
                    Restaurant updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/owner/dashboard')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to update restaurant
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(id as string)
            toast.push(
                <Notification type="success">
                    Restaurant deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/owner/dashboard')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to delete restaurant
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setDeleteConfirmationOpen(false)
    }

    return (
        <PostLoginLayout layoutType={layoutType}>
            <RestaurantForm
                defaultValues={defaultValues}
                isNew={false}
                onFormSubmit={handleFormSubmit}
            >
                <Button
                    type="button"
                    variant="plain"
                    icon={<TbArrowNarrowLeft />}
                    onClick={() => navigate('/owner/dashboard')}
                >
                    Back to Dashboard
                </Button>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="default"
                        icon={<TbTrash />}
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setDeleteConfirmationOpen(true)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isSubmitting}
                    >
                        Save Changes
                    </Button>
                </div>
            </RestaurantForm>

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
        </PostLoginLayout>
    )
}

export default EditRestaurant

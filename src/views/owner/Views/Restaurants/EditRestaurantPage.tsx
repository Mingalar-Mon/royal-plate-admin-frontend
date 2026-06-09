import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NoProductFound from '@/assets/svg/NoProductFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import RestaurantForm from './components/RestaurantForm'
import type { RestaurantFormSchema } from './types/restaurantForm.types'

// import {
//     useDeleteRestaurant,
//     useGetRestaurant,
//     useUpdateRestaurant,
// } from '../../hooks/useRestaurant'
import { Staff } from '@/@types/restaurant'
import {
    useGetRestaurant,
    useUpdateRestaurant,
    useDeleteRestaurant,
} from '@/utils/custom-hooks/useRestaurant'

// import { useSessionUser } from '@/store/authStore'

const EditRestaurant = () => {
    // const { user } = useSessionUser()
    // console.log('user: ', user)

    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!restaurantId) {
        return <div>No restaurant id provided</div>
    }
    const { data: restaurantJson, isLoading } = useGetRestaurant(restaurantId)

    // const { data: restaurantJson, isLoading } = useGetRestaurant(
    //     restaurantId as string,
    // )

    // console.log('restaurantJSON: ', restaurantJson)

    const { mutate: updateRestaurant } = useUpdateRestaurant()
    const { mutate: deleteRestaurant } = useDeleteRestaurant()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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

    const defaultValues: RestaurantFormSchema = {
        name: restaurantJson.data.name,
        address: restaurantJson.data.address,
        startingPrice: restaurantJson.data.startingPrice,
        endingPrice: restaurantJson.data.endingPrice,
        tax: restaurantJson.data.tax,
        latitude: restaurantJson.data.latitude,
        longitude: restaurantJson.data.longitude,
        logoImage: restaurantJson.data.logoImage,
        images: restaurantJson.data.images || [],
        staffIds: restaurantJson.data.staff?.map((s: Staff) => s.id) || [],
        deletedImageKeys: [],
    }

    const handleFormSubmit = async (formData: RestaurantFormSchema) => {
        setIsSubmitting(true)
        try {
            // 1. Create a FormData instance
            const body = new FormData()
            // 2. Append simple fields
            body.append('name', formData.name)
            body.append('address', formData.address)
            body.append('startingPrice', String(formData.startingPrice))
            body.append('endingPrice', String(formData.endingPrice))
            body.append('latitude', String(formData.latitude))
            body.append('longitude', String(formData.longitude))

            // // Append staffIds (Backend usually expects multiple appends for arrays)
            formData.staffIds.forEach((id) => body.append('staffIds', id))
            // // 3. Handle Images
            const existingImages: { key: string; url: string }[] = []
            formData.images.forEach((img) => {
                if (img instanceof File) {
                    // New file to be uploaded
                    body.append('newImages', img)
                } else {
                    // Existing image to keep
                    existingImages.push(img)
                }
            })
            // ====== Send existing images as a JSON string
            body.append('existingImages', JSON.stringify(existingImages))

            if (formData.logoImage instanceof File) {
                body.append('logo', formData.logoImage)
            }

            // const jsonData = {
            //     name: formData.name,
            //     address: formData.address,
            //     startingPrice: formData.startingPrice,
            //     endingPrice: formData.endingPrice,
            //     latitude: formData.latitude,
            //     longitude: formData.longitude,
            //     staffIds: formData.staffIds.forEach((id) =>
            //         body.append('staffIds', id),
            //     ),
            //     existingImages: formData.images.filter(
            //         (img) => !(img instanceof File),
            //     ),
            // }

            // body.append('body', JSON.stringify(jsonData))

            console.log('Body: ', body)
            console.log('FormData contents:', Array.from(body.entries()))

            console.log('restaurantId: ', restaurantId)

            // append files separately
            formData.images.forEach((img) => {
                if (img instanceof File) body.append('newImages', img)
            })

            // 4. Send to Mutation
            updateRestaurant(
                { id: restaurantId!, data: body as any }, // Cast to any to bypass the JSON type check for now
                {
                    onSuccess: () => navigate('/owner/dashboard'),
                    onSettled: () => setIsSubmitting(false),
                },
            )
            // const cleanedData = {
            //     ...formData,
            //     startingPrice: Number(formData.startingPrice),
            //     endingPrice: Number(formData.endingPrice),
            //     latitude: Number(formData.latitude),
            //     longitude: Number(formData.longitude),
            // }
            // console.log('Clean Data', cleanedData)
            // updateRestaurant(
            //     {
            //         id: restaurantId!,
            //         data: cleanedData,
            //     },
            //     {
            //         onSuccess: () => {
            //             console.log('Updata was succeeded')
            //             return navigate('/owner/dashboard')
            //         },
            //     },
            // )
        } catch (error: any) {
            toast.push(
                Notification({
                    type: 'danger',
                    title: 'Error updating restaurant',
                    children: error,
                }),
                // <Notification type="danger">
                //     Failed to update restaurant
                // </Notification>,
                // { placement: 'top-center' },
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
        </>
    )
}

export default EditRestaurant

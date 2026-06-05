import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import DishForm from '../components/DishForm'
import type { DishFormData } from '@/views/dishes/types/dish.type'

import {
    useGetDish,
    useUpdateDish,
    useDeleteDish,
} from '@/utils/custom-hooks/useDish'
import { useGetCuisines } from '@/utils/custom-hooks/useCuisine'
import { useRestaurantStore } from '@/store/restaurantStore'

const DishEdit = () => {
    const { dishId } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const restaurantId = useRestaurantStore(
        (state) => state.activeRestaurant?.id,
    )

    // const [deletedKeys, setDeletedKeys] = useState<string[]>([])

    // get data from hooks, stop using is submitting
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { mutate: updateDish, isPending: isUpdating } = useUpdateDish()
    const { mutate: deleteDish } = useDeleteDish()
    const { data: cuisines } = useGetCuisines()

    // console.log('Dish id: ', dishId)

    const { data: dish, isLoading } = useGetDish(dishId!)
    // const updateDish = useUpdateDish()
    // const deleteDish = useDeleteDish()

    if (isLoading) return <div className="p-8 text-center">Loading...</div>
    if (!dish) return <div className="p-8 text-center">Dish not found</div>

    const defaultValues: DishFormData = {
        name: dish.data.name,
        price: dish.data.price,
        description: dish.data.description || '',
        category: dish.data.cuisine.id || '', // Use the UUID of the cuisine
        coverImage: dish.data.coverImage,
        detailImages: dish.data.detailImages,
        available: dish.data.availableForOrder,
        preparationTime: dish.data.preparationTime || 0,
        deletedImageKeys: [],
        // name: dish.name,
        // description: dish.description,
        // price: dish.price,
        // category: dish.category,
        // imageUrl: dish.imageUrl,
        // available: dish.available,
    }

    const handleSubmit = async (data: DishFormData) => {
        console.log('Data from form ', data)

        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('price', data.price.toString())
        if (data.preparationTime) {
            formData.append('preparationTime', data.preparationTime.toString())
        }
        if (data.description) {
            formData.append('description', data.description)
        }
        formData.append('cuisineId', data.category)

        if (data.detailImages) {
            data.detailImages.forEach((img) => {
                if (img instanceof File) {
                    formData.append('detailImages[]', img)
                }
            })
        }
        console.log('detail images: ', data.detailImages)

        // console.log('Deleted keys: ', deletedKeys)

        if (data.deletedImageKeys.length > 0) {
            data.deletedImageKeys.forEach((key) =>
                formData.append('deletedImageKeys[]', key),
            )
        }
        // if (deletedKeys.length > 0) {
        //     deletedKeys.forEach((key) =>
        //         formData.append('deletedImageKeys', key),
        //     )
        // }

        if (data.coverImage instanceof File) {
            formData.append('coverImage', data.coverImage)
        }

        updateDish(
            {
                dishId: dishId!,
                data: formData,
            },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success">
                            Dish Updated
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                    navigate(`/restaurants/${restaurantId}/dishes`)
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger">
                            Failed to update dish
                        </Notification>,
                    )
                },
            },
        )
    }

    const handleDelete = async () => {
        deleteDish(dishId!, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success">Dish deleted</Notification>,
                    {
                        placement: 'top-center',
                    },
                )
                navigate(`/restaurants/${restaurantId}/dishes`)
            },
            onError: () => {
                toast.push(
                    <Notification type="danger">
                        Failed to delete dish
                    </Notification>,
                )
            },
        })
        setDeleteConfirmationOpen(false)
    }

    // Define the function that catches the key from the child
    // const handleImageDelete = (key: string) => {
    //     setDeletedKeys((prev) => [...prev, key])
    //     console.log('Keys marked for deletion:', [...deletedKeys, key])
    // }

    const cuisineOptions =
        cuisines?.data.map((c) => ({
            value: c.id,
            label: c.name,
        })) || []

    return (
        <>
            <DishForm
                defaultValues={defaultValues}
                // onImageDelete={handleImageDelete}
                isNew={false}
                categories={cuisineOptions}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/dishes`)
                        }
                    >
                        Back to Menu
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500"
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
                </div>
            </DishForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Dish"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete this dish? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default DishEdit

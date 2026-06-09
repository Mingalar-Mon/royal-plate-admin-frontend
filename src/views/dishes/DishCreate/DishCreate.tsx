import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import DishForm from '../components/DishForm'
import type { DishFormData } from '@/views/dishes/types/dish.type'

import { useCreateDish } from '@/utils/custom-hooks/useDish'
import { useGetCuisines } from '@/utils/custom-hooks/useCuisine'
import { AdaptiveCard } from '@/components/shared'
import { useCuisineStore } from '@/store/cuisineStore'

const DishCreate = () => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { tableData } = useCuisineStore()

    const { mutate: createDish } = useCreateDish()
    const { data: cuisinesData } = useGetCuisines({
        ...tableData,
        pageSize: 1000,
    })

    const handleSubmit = async (data: DishFormData) => {
        if (!restaurantId) {
            console.error('No restaurant ID found in URL')
            return
        }

        setIsSubmitting(true)

        console.log('Data from form: ', data)
        // 2. Prepare FormData because your backend uses Multer
        const body = new FormData()
        body.append('name', data.name)
        body.append('price', data.price.toString())
        body.append('availableForOrder', String(data.available))
        if (data.description) body.append('description', data.description)

        if (data.preparationTime)
            body.append('preparationTime', data.preparationTime.toString())

        // Handle Cover Image (Assuming data.coverImage is a File)
        if (data.coverImage) {
            body.append('coverImage', data.coverImage as string | File)
        }

        // Handle Detail Images (Assuming data.detailImages is File[])
        if (data.detailImages && data.detailImages.length > 0) {
            data.detailImages.forEach((file: File) => {
                body.append('detailImages', file as File)
            })
        }

        createDish(
            { restaurantId, cuisineId: data.category, data: body },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success">
                            Dish created successfully!
                        </Notification>,
                        { placement: 'top-center' },
                    )

                    navigate(`/restaurants/${restaurantId}/dishes`)
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger">
                            Failed to create dish
                        </Notification>,
                    )
                },
            },
        )

        setIsSubmitting(false)
    }

    const cuisineOptions =
        cuisinesData?.data.map((c) => ({
            value: c.id,
            label: c.name,
        })) || []

    return (
        <AdaptiveCard>
            <DishForm
                isNew={true}
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
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isSubmitting}
                    >
                        Create Dish
                    </Button>
                </div>
            </DishForm>
        </AdaptiveCard>
    )
}

export default DishCreate

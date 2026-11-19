import { useUpdateDishBasic } from '@/utils/custom-hooks/useDish'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DishForm from './DishForm'
import type { DishFormInput, DishFormOutput } from '../types/dish.type'
import type { GetDishResponse } from '@/@types/dish'

type DishRow = GetDishResponse['data']

interface DishEditDialogProps {
    dish: DishRow | null
    onClose: () => void
    categories: { value: string; label: string }[]
}

const DishEditDialog = ({ dish, onClose, categories }: DishEditDialogProps) => {
    const { mutate: updateDishBasic, isPending: isUpdatingDish } =
        useUpdateDishBasic()

    const defaultValues: DishFormInput | undefined = dish
        ? {
              name: dish.name,
              price: dish.price,
              description: dish.description || '',
              category: dish.cuisine?.id || '',
              coverImage: dish.coverImage as any,
              detailImages: (dish.detailImages as any) || [],
              available: dish.availableForOrder,
              preparationTime: dish.preparationTime || 0,
              deletedImageKeys: [],
          }
        : undefined

    const handleUpdateDishBasic = (data: DishFormOutput) => {
        if (!dish) return

        const formData = new FormData()
        if (data.name?.trim()) formData.append('name', data.name.trim())
        if (data.price != null) formData.append('price', String(data.price))
        if (data.description !== undefined)
            formData.append('description', data.description ?? '')
        if (data.preparationTime != null)
            formData.append(
                'preparationTime',
                String(data.preparationTime ?? 0),
            )
        formData.append('availableForOrder', String(data.available))
        if (data.category) formData.append('cuisineId', data.category)

        if (data.coverImage instanceof File)
            formData.append('coverImage', data.coverImage)
        if (data.detailImages && data.detailImages.length > 0) {
            data.detailImages.forEach((img: any) => {
                if (img instanceof File) formData.append('detailImages[]', img)
            })
        }
        if (
            (data as any).deletedImageKeys &&
            (data as any).deletedImageKeys.length > 0
        ) {
            ;(data as any).deletedImageKeys.forEach((key: string) => {
                formData.append('deletedImageKeys', key)
                formData.append('deletedImageKeys[]', key)
            })
        }

        updateDishBasic(
            { dishId: dish.id, data: formData },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success">
                            Dish updated successfully
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    onClose()
                },
                onError: (error: any) => {
                    toast.push(
                        <Notification type="danger">
                            {error?.response?.data?.message ||
                                'Failed to update dish'}
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <Dialog
            isOpen={Boolean(dish)}
            closable={true}
            width={900}
            contentClassName="flex max-h-[92vh] flex-col overflow-y-auto"
            onClose={onClose}
            onRequestClose={onClose}
        >
            {dish && defaultValues && (
                <DishForm
                    key={dish.id}
                    isNew={false}
                    categories={categories}
                    defaultValues={defaultValues}
                    disabled={isUpdatingDish}
                    onFormSubmit={handleUpdateDishBasic}
                >
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="plain"
                            size="xs"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            size="xs"
                            loading={isUpdatingDish}
                        >
                            Save
                        </Button>
                    </div>
                </DishForm>
            )}
        </Dialog>
    )
}

export default DishEditDialog

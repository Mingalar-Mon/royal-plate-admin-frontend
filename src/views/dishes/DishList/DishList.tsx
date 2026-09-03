import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DishForm from '../components/DishForm'
import DishListActionTools from '../components/DishListActionTool'
import DishListTableTools from '../components/DishListTableTools'
import DishListTable from '../components/DishListTable'

import { useCreateDish, useGetDishes } from '@/utils/custom-hooks/useDish'
import { useGetCuisinesByRestaurant } from '@/utils/custom-hooks/useCuisine'
import type { DishFormOutput } from '../types/dish.type'
import { useParams } from 'react-router'
import { useDishStore } from '@/store/dishStore'

const DishList = () => {
    const { restaurantId } = useParams()
    const tableData = useDishStore((state) => state.tableData)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const { mutate: createDish, isPending: isCreatingDish } = useCreateDish()
    const { data: cuisines } = useGetCuisinesByRestaurant(restaurantId ?? '')

    const { dishes, total, refetch, isLoading } = useGetDishes({
        restaurantId: restaurantId!,
        params: tableData,
    })

    const handleCreateDish = (data: DishFormOutput) => {
        if (!restaurantId) return

        const body = new FormData()
        body.append('name', data.name)
        body.append('price', String(data.price))
        body.append('availableForOrder', String(data.available))
        body.append('cuisineId', data.category)
        body.append('preparationTime', String(data.preparationTime || 0))
        if (data.description) body.append('description', data.description)

        if (data.coverImage instanceof File) {
            body.append('coverImage', data.coverImage)
        }

        data.detailImages?.forEach((image) => {
            if (image instanceof File) body.append('detailImages', image)
        })

        createDish(
            { restaurantId, cuisineId: data.category, data: body },
            {
                onSuccess: () => {
                    setIsCreateDialogOpen(false)
                    toast.push(
                        <Notification type="success">
                            Dish created successfully!
                        </Notification>,
                        { placement: 'top-center' },
                    )
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger">
                            Failed to create dish
                        </Notification>,
                        { placement: 'top-center' },
                    )
                },
            },
        )
    }

    const cuisineOptions =
        cuisines?.data.map((cuisine) => ({
            value: cuisine.id,
            label: cuisine.name,
        })) || []

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-content-primary">Menu</h3>
                            <p className="mt-1 text-sm text-content-muted">
                                Manage dishes, pricing, and availability.
                            </p>
                        </div>
                        <DishListActionTools
                            onAdd={() => setIsCreateDialogOpen(true)}
                            onRefresh={refetch}
                        />
                    </div>
                    <DishListTableTools />
                    <DishListTable
                        dishList={dishes}
                        dishListTotal={total}
                        isLoading={isLoading}
                    />
                </div>
            </AdaptiveCard>

            <Dialog
                isOpen={isCreateDialogOpen}
                closable={false}
                width={900}
                contentClassName="max-h-[92vh] overflow-y-auto"
                title="Add New Dish"
                onClose={() => setIsCreateDialogOpen(false)}
                onRequestClose={() => setIsCreateDialogOpen(false)}
            >
                <DishForm
                    isNew
                    categories={cuisineOptions}
                    disabled={isCreatingDish}
                    onFormSubmit={handleCreateDish}
                >
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                            type="button"
                            onClick={() => setIsCreateDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isCreatingDish}
                        >
                            Create Dish
                        </Button>
                    </div>
                </DishForm>
            </Dialog>
        </Container>
    )
}

export default DishList

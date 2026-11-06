import { useState } from 'react'
import { useParams } from 'react-router'
import { TbEdit, TbPhotoOff, TbClock, TbTag, TbCurrencyDollar } from 'react-icons/tb'
import { useDeleteDish, useUpdateDish, useUpdateDishBasic } from '@/utils/custom-hooks/useDish'
import { useGetCuisinesByRestaurant } from '@/utils/custom-hooks/useCuisine'
import { useDishStore } from '@/store/dishStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Pagination from '@/components/ui/Pagination'
import DishForm from './DishForm'
import DishAvailableStatusBadge from './DishAvailableStatusBadge'
import { LightboxModal } from './LightboxModal'
import type { DishFormOutput, DishFormInput } from '../types/dish.type'
import type { Dish } from '@/@types/dish'
import type { Cuisine } from '@/@types/restaurant'

type DishStatus = 'available' | 'unavailable'
type DishRow = Dish & { cuisine: Cuisine }

interface DishListCardProps {
    dishList: Dish[]
    dishListTotal: number
    isLoading: boolean
}

const DishListCard = ({ dishList, dishListTotal, isLoading }: DishListCardProps) => {
    const { restaurantId } = useParams()
    const tableData = useDishStore((state) => state.tableData)
    const setTableData = useDishStore((state) => state.setTableData)

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<string | null>(null)
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
    const [viewingDish, setViewingDish] = useState<DishRow | null>(null)
    const [editingDish, setEditingDish] = useState<DishRow | null>(null)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const { mutate: deleteDish } = useDeleteDish()
    const { mutate: updateDish } = useUpdateDish()
    const { mutate: updateDishBasic, isPending: isUpdatingDish } = useUpdateDishBasic()
    const { data: cuisinesData } = useGetCuisinesByRestaurant(restaurantId ?? '')

    const cuisineOptions = cuisinesData?.data.map((c) => ({ value: c.id, label: c.name })) || []

    const editingDefaultValues: DishFormInput | undefined = editingDish
        ? {
              name: editingDish.name,
              price: editingDish.price,
              description: editingDish.description || '',
              category: editingDish.cuisine?.id || '',
              coverImage: editingDish.coverImage as any,
              detailImages: (editingDish.detailImages as any) || [],
              available: editingDish.availableForOrder,
              preparationTime: editingDish.preparationTime || 0,
              deletedImageKeys: [],
          }
        : undefined

    const openEditDialog = (dish: DishRow) => {
        setViewingDish(null)
        setEditingDish(dish)
    }

    const handleUpdateDishBasic = (data: DishFormOutput) => {
        if (!editingDish) return

        const formData = new FormData()
        if (data.name?.trim()) formData.append('name', data.name.trim())
        if (data.price != null) formData.append('price', String(data.price))
        if (data.description !== undefined) formData.append('description', data.description ?? '')
        if (data.preparationTime != null) formData.append('preparationTime', String(data.preparationTime ?? 0))
        formData.append('availableForOrder', String(data.available))
        if (data.category) formData.append('cuisineId', data.category)

        if (data.coverImage instanceof File) formData.append('coverImage', data.coverImage)
        if (data.detailImages && data.detailImages.length > 0) {
            data.detailImages.forEach((img: any) => {
                if (img instanceof File) formData.append('detailImages[]', img)
            })
        }
        if ((data as any).deletedImageKeys && (data as any).deletedImageKeys.length > 0) {
            ;(data as any).deletedImageKeys.forEach((key: string) => {
                formData.append('deletedImageKeys', key)
                formData.append('deletedImageKeys[]', key)
            })
        }

        updateDishBasic(
            { dishId: editingDish.id, data: formData },
            {
                onSuccess: () => {
                    toast.push(<Notification type="success">Dish updated successfully</Notification>, { placement: 'top-center' })
                    setEditingDish(null)
                },
                onError: (error: any) => {
                    toast.push(<Notification type="danger">{error?.response?.data?.message || 'Failed to update dish'}</Notification>)
                },
            },
        )
    }

    const handleStatusChange = (id: string, newStatus: DishStatus) => {
        setStatusUpdatingId(id)
        updateDish(
            { dishId: id, data: { availableForOrder: newStatus === 'available' } },
            { onSettled: () => setStatusUpdatingId(null) },
        )
    }

    const confirmDelete = () => {
        deleteDish(toDeleteId!)
        setDeleteConfirmationOpen(false)
        setToDeleteId(null)
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-3 h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
                        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                ))}
            </div>
        )
    }

    if (dishList.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">No dishes found.</div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dishList.map((dish) => {
                    const dishRow = dish as DishRow
                    return (
                        <div
                            key={dish.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                                {dish.coverImage?.url ? (
                                    <img
                                        src={dish.coverImage.url}
                                        alt={dish.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <TbPhotoOff className="text-4xl text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <DishAvailableStatusBadge
                                        status={dish.availableForOrder ? 'available' : 'unavailable'}
                                        isLoading={statusUpdatingId === dish.id}
                                        onChange={(status) => handleStatusChange(dish.id, status)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <h5 className="line-clamp-1 text-base font-bold text-gray-900 dark:text-gray-100">
                                        {dish.name}
                                    </h5>
                                    <span className="shrink-0 text-sm font-bold text-primary">
                                        {dish.price.toLocaleString()} MMK
                                    </span>
                                </div>

                                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <TbTag className="text-sm" />
                                        {dishRow.cuisine?.name || '—'}
                                    </span>
                                    {dish.preparationTime && (
                                        <span className="flex items-center gap-1">
                                            <TbClock className="text-sm" />
                                            {dish.preparationTime} min
                                        </span>
                                    )}
                                </div>

                                {dish.description && (
                                    <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-500 dark:text-gray-400">
                                        {dish.description}
                                    </p>
                                )}

                                <div className="flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        className="flex-1"
                                        onClick={() => setViewingDish(dishRow)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        className="flex-1"
                                        icon={<TbEdit />}
                                        onClick={() => openEditDialog(dishRow)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-end">
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={dishListTotal}
                    onChange={(page) => setTableData((prev) => ({ ...prev, pageIndex: page }))}
                />
            </div>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Dish"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={confirmDelete}
            >
                <p>Are you sure you want to remove this dish? This action cannot be undone.</p>
            </ConfirmDialog>

            <Dialog
                isOpen={Boolean(viewingDish)}
                width={720}
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Dish Details"
                onClose={() => setViewingDish(null)}
                onRequestClose={() => setViewingDish(null)}
            >
                {viewingDish && (
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="text-xl font-bold sm:text-2xl">{viewingDish.name}</h3>
                                <div className="mt-2">
                                    <DishAvailableStatusBadge
                                        status={viewingDish.availableForOrder ? 'available' : 'unavailable'}
                                        onChange={() => undefined}
                                    />
                                </div>
                            </div>
                            <Button variant="solid" icon={<TbEdit />} onClick={() => openEditDialog(viewingDish)}>
                                Edit Dish
                            </Button>
                        </div>

                        {viewingDish.description && (
                            <p className="mt-4 text-content-secondary">{viewingDish.description}</p>
                        )}

                        <Card className="mt-6">
                            <h4 className="mb-4 font-semibold">Details</h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <TbCurrencyDollar className="text-gray-500" />
                                    <span>Price: {viewingDish.price.toLocaleString()} MMK</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbTag className="text-gray-500" />
                                    <span>Category: {viewingDish.cuisine.name}</span>
                                </div>
                                {viewingDish.preparationTime && (
                                    <div className="flex items-center gap-2">
                                        <TbClock className="text-gray-500" />
                                        <span>Prep time: {viewingDish.preparationTime} min</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="mt-5 sm:mt-6">
                            <h4 className="mb-4 font-semibold">Dish Image</h4>
                            {viewingDish.coverImage ? (
                                <img src={viewingDish.coverImage.url} alt={viewingDish.coverImage.key} className="max-h-72 w-full rounded-xl object-cover sm:max-h-96" />
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-700">No image</div>
                            )}
                        </Card>

                        <Card className="mt-5 sm:mt-6">
                            <h4 className="mb-4 font-semibold">Detail Images</h4>
                            {viewingDish.detailImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {viewingDish.detailImages.slice(0, 6).map((img, index) => {
                                        const isLastSlot = index === 5
                                        const hasMoreImages = viewingDish.detailImages.length > 6
                                        const extraCount = viewingDish.detailImages.length - 5
                                        return (
                                            <div key={img.key || index} className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-100" onClick={() => { setCurrentImageIndex(index); setIsLightboxOpen(true) }}>
                                                <img src={img.url} alt={img.key || `Detail ${index + 1}`} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                                                {isLastSlot && hasMoreImages && (
                                                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/60 text-lg font-semibold text-white transition-colors hover:bg-black/50 sm:text-xl">+{extraCount} more</div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-700"><TbPhotoOff className="text-3xl text-content-muted" /></div>
                            )}
                        </Card>

                        {isLightboxOpen && (
                            <LightboxModal images={viewingDish.detailImages} currentIndex={currentImageIndex} setCurrentIndex={setCurrentImageIndex} onClose={() => setIsLightboxOpen(false)} />
                        )}
                    </div>
                )}
            </Dialog>

            <Dialog
                isOpen={Boolean(editingDish)}
                closable={true}
                width={900}
                contentClassName="flex max-h-[92vh] flex-col overflow-y-auto"
                onClose={() => setEditingDish(null)}
                onRequestClose={() => setEditingDish(null)}
            >
                {editingDish && editingDefaultValues && (
                    <DishForm key={editingDish.id} isNew={false} categories={cuisineOptions} defaultValues={editingDefaultValues} disabled={isUpdatingDish} onFormSubmit={handleUpdateDishBasic}>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <Button type="button" variant="plain" onClick={() => setEditingDish(null)}>Cancel</Button>
                            <Button type="submit" variant="solid" loading={isUpdatingDish}>Save Changes</Button>
                        </div>
                    </DishForm>
                )}
            </Dialog>
        </>
    )
}

export default DishListCard

import { useState, useMemo } from 'react'
import type { FormEvent } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable, {
    OnSortParam,
} from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { NumericFormat } from 'react-number-format'
import {
    TbCurrencyDollar,
    TbTag,
    TbClock,
    TbEdit,
    TbPhotoOff,
} from 'react-icons/tb'
import { useDeleteDish, useUpdateDish } from '@/utils/custom-hooks/useDish'
import DishColumn from './DishColumn'
import ActionColumn from './ActionColumn'
import { Dish } from '@/@types/dish'
import { Cuisine } from '@/@types/restaurant'
import { useDishStore } from '@/store/dishStore'
import DishStatusBadge from './DishStatusBadge'
import DishAvailableStatusBadge from './DishAvailableStatusBadge'
import Dialog from '@/components/ui/Dialog'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { LightboxModal } from './LightboxModal'

type DishStatus = 'available' | 'unavailable'
type DishRow = Dish & { cuisine: Cuisine }

type DishEditForm = {
    name: string
    description: string
    price: string
    preparationTime: string
    availableForOrder: boolean
}

const DishListTable = ({
    dishList,
    dishListTotal,
    isLoading,
}: {
    dishList: Dish[]
    dishListTotal: number
    isLoading: boolean
}) => {
    // const {
    //     dishList,
    //     dishListTotal,
    //     // tableData,
    //     // setTableData,
    //     isLoading,
    //     // deleteMutation,
    // } = useDishList()
    const tableData = useDishStore((state) => state.tableData)
    const setTableData = useDishStore((state) => state.setTableData)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<string | null>(null)
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
        null,
    )

    const [viewingDish, setViewingDish] = useState<DishRow | null>(null)
    const [editingDish, setEditingDish] = useState<DishRow | null>(null)
    const [editForm, setEditForm] = useState<DishEditForm>({
        name: '',
        description: '',
        price: '',
        preparationTime: '',
        availableForOrder: true,
    })
    const [isUpdatingDish, setIsUpdatingDish] = useState(false)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const { mutate: deleteDish } = useDeleteDish()
    const { mutate: updateDish } = useUpdateDish()

    const openEditDialog = (dish: DishRow) => {
        setViewingDish(null)
        setEditingDish(dish)
        setEditForm({
            name: dish.name,
            description: dish.description || '',
            price: String(dish.price),
            preparationTime: String(dish.preparationTime || ''),
            availableForOrder: dish.availableForOrder,
        })
    }

    const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!editingDish || !editForm.name.trim()) return

        setIsUpdatingDish(true)
        updateDish(
            {
                dishId: editingDish.id,
                data: {
                    name: editForm.name.trim(),
                    description: editForm.description.trim(),
                    price: Number(editForm.price),
                    preparationTime: Number(editForm.preparationTime) || 0,
                    availableForOrder: editForm.availableForOrder,
                },
            },
            {
                onSuccess: () => {
                    setEditingDish(null)
                    setIsUpdatingDish(false)
                },
                onError: () => setIsUpdatingDish(false),
            },
        )
    }

    const confirmDelete = () => {
        deleteDish(toDeleteId!)
        setDeleteConfirmationOpen(false)
        setToDeleteId(null)

        // if (toDeleteId) {
        //     // deleteMutation.mutate(toDeleteId)
        //     setDeleteConfirmationOpen(false)
        //     setToDeleteId(null)
        // }
    }

    const columns: ColumnDef<DishRow>[] = useMemo(() => {
        const handleView = (dish: DishRow) => {
            setViewingDish(dish)
        }

        const handleEdit = (dish: DishRow) => {
            openEditDialog(dish)
        }

        const handleStatusChange = async (
            id: string,
            newStatus: DishStatus,
        ) => {
            setStatusUpdatingId(id)
            updateDish(
                {
                    dishId: id,
                    data: {
                        availableForOrder:
                            newStatus === 'available' ? true : false,
                    },
                },
                { onSettled: () => setStatusUpdatingId(null) },
            )
        }
        return [
            {
                header: 'Dish',
                accessorKey: 'name',
                cell: (props) => <DishColumn row={props.row.original} />,
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => (
                    <span className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={props.row.original.price}
                            prefix="MMK "
                        />
                    </span>
                ),
            },
            {
                header: 'Category',
                id: 'cuisine.name',
                cell: (props) => <span>{props.row.original.cuisine.name}</span>,
            },
            {
                header: 'Status',
                id: 'availableForOrder',
                cell: (props) => {
                    const { id, availableForOrder } = props.row.original
                    return (
                        <DishAvailableStatusBadge
                            status={
                                availableForOrder ? 'available' : 'unavailable'
                            }
                            isLoading={statusUpdatingId === id}
                            onChange={(newStatus: DishStatus) =>
                                handleStatusChange(id, newStatus)
                            }
                        />
                    )
                },
            },

            {
                header: 'PrepTime',
                accessorKey: 'preparationTime',
                cell: (props) => {
                    return (
                        <span>
                            {props.row.original.preparationTime ?? 'Unknown'}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() => handleView(props.row.original)}
                        onEdit={() => handleEdit(props.row.original)}
                        // onDelete={() => handleDelete(props.row.original.id)}
                    />
                ),
            },
        ]
    }, [statusUpdatingId, updateDish])

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const handleSelectChange = (size: number) => {
        setTableData((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }))
    }

    const handleSort = (sort: OnSortParam) => {
        setTableData((prev) => ({ ...prev, sort, pageIndex: 1 }))
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={dishList}
                loading={isLoading}
                pagingData={{
                    total: dishListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Dish"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={confirmDelete}
            >
                <p>
                    Are you sure you want to remove this dish? This action
                    cannot be undone.
                </p>
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
                                <h3 className="text-xl font-bold sm:text-2xl">
                                    {viewingDish.name}
                                </h3>
                                <div className="mt-2">
                                    <DishStatusBadge
                                        available={
                                            viewingDish.availableForOrder
                                        }
                                    />
                                </div>
                            </div>
                            <Button
                                variant="solid"
                                icon={<TbEdit />}
                                onClick={() => openEditDialog(viewingDish)}
                            >
                                Edit Dish
                            </Button>
                        </div>

                        {viewingDish.description && (
                            <p className="mt-4 text-content-secondary">
                                {viewingDish.description}
                            </p>
                        )}

                        <Card className="mt-6">
                            <h4 className="mb-4 font-semibold">Details</h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <TbCurrencyDollar className="text-gray-500" />
                                    <span>
                                        Price:{' '}
                                        {viewingDish.price.toLocaleString()} MMK
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbTag className="text-gray-500" />
                                    <span>
                                        Category: {viewingDish.cuisine.name}
                                    </span>
                                </div>
                                {viewingDish.preparationTime && (
                                    <div className="flex items-center gap-2">
                                        <TbClock className="text-gray-500" />
                                        <span>
                                            Prep time:{' '}
                                            {viewingDish.preparationTime} min
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="mt-5 sm:mt-6">
                            <h4 className="mb-4 font-semibold">Dish Image</h4>
                            {viewingDish.coverImage ? (
                                <img
                                    src={viewingDish.coverImage.url}
                                    alt={viewingDish.coverImage.key}
                                    className="max-h-72 w-full rounded-xl object-cover sm:max-h-96"
                                />
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-700">
                                    No image
                                </div>
                            )}
                        </Card>

                        <Card className="mt-5 sm:mt-6">
                            <h4 className="mb-4 font-semibold">Detail Images</h4>
                            {viewingDish.detailImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {viewingDish.detailImages
                                        .slice(0, 6)
                                        .map((img, index) => {
                                            const isLastSlot = index === 5
                                            const hasMoreImages =
                                                viewingDish.detailImages.length >
                                                6
                                            const extraCount =
                                                viewingDish.detailImages.length -
                                                5

                                            return (
                                                <div
                                                    key={img.key || index}
                                                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-gray-100"
                                                    onClick={() => {
                                                        setCurrentImageIndex(
                                                            index,
                                                        )
                                                        setIsLightboxOpen(true)
                                                    }}
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={
                                                            img.key ||
                                                            `Detail ${index + 1}`
                                                        }
                                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    />
                                                    {isLastSlot &&
                                                        hasMoreImages && (
                                                            <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/60 text-lg font-semibold text-white transition-colors hover:bg-black/50 sm:text-xl">
                                                                +{extraCount} more
                                                            </div>
                                                        )}
                                                </div>
                                            )
                                        })}
                                </div>
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-700">
                                    <TbPhotoOff className="text-3xl text-content-muted" />
                                </div>
                            )}
                        </Card>

                        {isLightboxOpen && (
                            <LightboxModal
                                images={viewingDish.detailImages}
                                currentIndex={currentImageIndex}
                                setCurrentIndex={setCurrentImageIndex}
                                onClose={() => setIsLightboxOpen(false)}
                            />
                        )}
                    </div>
                )}
            </Dialog>

            <Dialog
                isOpen={Boolean(editingDish)}
                closable={false}
                width={560}
                contentClassName="max-h-[90vh] overflow-y-auto"
                title="Edit Dish"
                onClose={() => setEditingDish(null)}
                onRequestClose={() => setEditingDish(null)}
            >
                <form className="space-y-5 p-4 sm:p-6" onSubmit={handleEditSubmit}>
                    <div className="rounded-xl bg-primary-subtle p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Editing menu item
                        </p>
                        <p className="mt-1 text-sm text-content-secondary">
                            Update the dish information below. The current category remains unchanged.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Dish name
                            </span>
                            <Input
                                value={editForm.name}
                                placeholder="Dish name"
                                invalid={!editForm.name.trim()}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        name: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Description
                            </span>
                            <Input
                                textArea
                                rows={4}
                                value={editForm.description}
                                placeholder="Describe the dish"
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Price (MMK)
                                </span>
                                <Input
                                    type="number"
                                    min={1}
                                    value={editForm.price}
                                    onChange={(event) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            price: event.target.value,
                                        }))
                                    }
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Preparation time (minutes)
                                </span>
                                <Input
                                    type="number"
                                    min={0}
                                    value={editForm.preparationTime}
                                    onChange={(event) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            preparationTime: event.target.value,
                                        }))
                                    }
                                />
                            </label>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                            <div>
                                <p className="text-sm font-semibold text-content-primary">
                                    Available for ordering
                                </p>
                                <p className="mt-1 text-xs text-content-muted">
                                    Customers can order this dish when enabled.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={editForm.availableForOrder}
                                className="h-5 w-5 accent-primary"
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        availableForOrder: event.target.checked,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end dark:border-gray-700">
                        <Button
                            type="button"
                            onClick={() => setEditingDish(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isUpdatingDish}
                            disabled={
                                !editForm.name.trim() ||
                                Number(editForm.price) < 1
                            }
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    )
}

export default DishListTable

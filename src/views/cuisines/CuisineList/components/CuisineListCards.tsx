import { useState } from 'react'
import dayjs from 'dayjs'
import {
    TbCalendar,
    TbChevronRight,
    TbEdit,
    TbInfoCircle,
    TbPhotoOff,
} from 'react-icons/tb'
import type { Cuisine, CuisineFormData } from '@/views/cuisines/types/cuisine.type'
import { useCuisineStore } from '@/store/cuisineStore'
import { useUpdateCuisineMutation } from '@/utils/custom-hooks/useCuisine'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import CuisineForm from '@/views/cuisines/components/CuisineForm'
import { Notification, toast } from '@/components/ui'

interface CuisineListCardsProps {
    data: Cuisine[]
    total: number
    loading: boolean
}

const CuisineListCards = ({
    data,
    total,
    loading,
}: CuisineListCardsProps) => {
    const tableData = useCuisineStore((state) => state.tableData)
    const setTableData = useCuisineStore((state) => state.setTableData)
    const [viewingCuisine, setViewingCuisine] = useState<Cuisine | null>(null)
    const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null)
    const { mutate: updateCuisine, isPending: isUpdating } =
        useUpdateCuisineMutation()

    const handleEditSubmit = (formData: CuisineFormData) => {
        if (!editingCuisine) return

        const body = new FormData()
        body.append('name', formData.name)
        if (formData.description) body.append('description', formData.description)

        if (formData.image instanceof File) {
            body.append('image', formData.image)
        } else {
            body.append(
                'existingImageUrl',
                typeof formData.image === 'string'
                    ? formData.image
                    : (formData.image as { url: string }).url,
            )
        }

        updateCuisine(
            { id: editingCuisine.id, data: body },
            {
                onSuccess: () => {
                    setEditingCuisine(null)
                    toast.push(
                        <Notification type="success" title="Success">
                            Cuisine updated successfully
                        </Notification>,
                        { placement: 'top-center' },
                    )
                },
                onError: (error: any) => {
                    toast.push(
                        <Notification type="danger" title="Error">
                            {error?.response?.data?.message ||
                                'Failed to update cuisine'}
                        </Notification>,
                    )
                },
            },
        )
    }

    if (loading) {
        return <CardSkeleton count={6} />
    }

    if (data.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">
                No cuisines found.
            </div>
        )
    }

    return (
        <>
            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.map((cuisine) => (
                    <div
                        key={cuisine.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="relative block h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {cuisine.image?.url ? (
                                <img
                                    src={cuisine.image.url}
                                    alt={cuisine.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col p-5 pt-4">
                            <h5 className="line-clamp-2 text-base font-bold text-gray-900 dark:text-gray-100">
                                {cuisine.name}
                            </h5>

                            {cuisine.description && (
                                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {cuisine.description}
                                </p>
                            )}

                            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Created:
                                </span>{' '}
                                {dayjs(cuisine.created_at).format('DD/MM/YYYY')}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<TbEdit />}
                                    onClick={() => setEditingCuisine(cuisine)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<TbChevronRight />}
                                    onClick={() => setViewingCuisine(cuisine)}
                                >
                                    View details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={total}
                    onChange={(page) =>
                        setTableData((prev) => ({
                            ...prev,
                            pageIndex: page,
                        }))
                    }
                />
            </div>
        </div>

        <Dialog
            isOpen={Boolean(viewingCuisine)}
            onClose={() => setViewingCuisine(null)}
            onRequestClose={() => setViewingCuisine(null)}
            width={600}
            contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
            title="Cuisine Details"
        >
            {viewingCuisine && (
                <div className="p-6">
                    {viewingCuisine.image?.url ? (
                        <div className="overflow-hidden rounded-xl">
                            <img
                                src={viewingCuisine.image.url}
                                alt={viewingCuisine.name}
                                className="h-52 w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                            <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                        </div>
                    )}

                    <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-gray-100">
                        {viewingCuisine.name}
                    </h3>

                    {viewingCuisine.description && (
                        <span className="mt-3 block text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {viewingCuisine.description}
                        </span>
                    )}

                    <div className="mt-5 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <TbCalendar className="flex-shrink-0" />
                            <span>
                                Created:{' '}
                                {dayjs(viewingCuisine.created_at).format(
                                    'DD MMM YYYY',
                                )}
                            </span>
                        </div>
                        {viewingCuisine.updated_at && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <TbInfoCircle className="flex-shrink-0" />
                                <span>
                                    Last updated:{' '}
                                    {dayjs(viewingCuisine.updated_at).format(
                                        'DD MMM YYYY',
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            variant="solid"
                            onClick={() => setViewingCuisine(null)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Dialog>

        <Dialog
            isOpen={Boolean(editingCuisine)}
            onClose={() => setEditingCuisine(null)}
            onRequestClose={() => setEditingCuisine(null)}
            width={900}
            contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
            title="Edit Cuisine"
        >
            {editingCuisine && (
                <CuisineForm
                    key={editingCuisine.id}
                    isNew={false}
                    compact
                    defaultValues={{
                        name: editingCuisine.name,
                        image: editingCuisine.image,
                        description: editingCuisine.description || '',
                    }}
                    onFormSubmit={handleEditSubmit}
                >
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="plain"
                            onClick={() => setEditingCuisine(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </div>
                </CuisineForm>
            )}
        </Dialog>
        </>
    )
}

export default CuisineListCards
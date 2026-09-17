import { useState } from 'react'
import dayjs from 'dayjs'
import {
    TbCalendar,
    TbChevronRight,
    TbEdit,
    TbInfoCircle,
    TbPhotoOff,
    TbTrash,
    TbRestore,
    TbLockOff,
    TbLockOpen,
} from 'react-icons/tb'
import type {
    Cuisine,
    CuisineFormData,
} from '@/views/cuisines/types/cuisine.type'
import { useCuisineStore } from '@/store/cuisineStore'
import {
    useUpdateCuisineMutation,
    useSoftDeleteCuisineMutation,
    useReactivateCuisineMutation,
} from '@/utils/custom-hooks/useCuisine'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import CuisineForm from '@/views/cuisines/components/CuisineForm'
import { Notification, toast } from '@/components/ui'

interface CuisineListCardsProps {
    data: Cuisine[]
    total: number
    loading: boolean
}

const isCuisineDeleted = (cuisine: any): boolean =>
    Boolean(cuisine?.deletedAt ?? cuisine?.deleted_at)

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback

const CuisineListCards = ({ data, total, loading }: CuisineListCardsProps) => {
    const tableData = useCuisineStore((state) => state.tableData)
    const setTableData = useCuisineStore((state) => state.setTableData)
    const [viewingCuisine, setViewingCuisine] = useState<Cuisine | null>(null)
    const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null)
    const [deactivateTarget, setDeactivateTarget] = useState<Cuisine | null>(null)
    const [reactivateTarget, setReactivateTarget] = useState<Cuisine | null>(null)
    const { mutate: updateCuisine, isPending: isUpdating } =
        useUpdateCuisineMutation()
    const { mutate: softDeleteCuisine, isPending: isSoftDeleting } =
        useSoftDeleteCuisineMutation()
    const { mutate: reactivateCuisine, isPending: isReactivating } =
        useReactivateCuisineMutation()

    const handleEditSubmit = (formData: CuisineFormData) => {
        if (!editingCuisine) return

        const body = new FormData()
        body.append('name', formData.name)
        if (formData.description)
            body.append('description', formData.description)

        if (formData.image instanceof File) {
            body.append('image', formData.image)
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

    const handleConfirmSoftDelete = () => {
        if (!deactivateTarget) return
        softDeleteCuisine(deactivateTarget.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Cuisine deactivated">
                        Cuisine soft deleted successfully — hidden from mobile listings.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setDeactivateTarget(null)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Deactivation failed">
                        {getErrorMessage(error, 'Could not deactivate cuisine.')}
                    </Notification>,
                )
            },
        })
    }

    const handleConfirmReactivate = () => {
        if (!reactivateTarget) return
        reactivateCuisine(reactivateTarget.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Cuisine reactivated">
                        Cuisine reactivated successfully — visible in mobile listings again.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setReactivateTarget(null)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Reactivation failed">
                        {getErrorMessage(error, 'Could not reactivate cuisine.')}
                    </Notification>,
                )
            },
        })
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
                    {data.map((cuisine: any) => {
                        const deleted = isCuisineDeleted(cuisine)
                        const deletedAt = cuisine.deletedAt ?? cuisine.deleted_at
                        const isBusy =
                            (isSoftDeleting && deactivateTarget?.id === cuisine.id) ||
                            (isReactivating && reactivateTarget?.id === cuisine.id)
                        return (
                            <div
                                key={cuisine.id}
                                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 ${deleted ? 'border-red-200 opacity-75 dark:border-red-900/40' : 'border-gray-200 dark:border-gray-700'}`}
                            >
                                <div className="relative block h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    {cuisine.image?.url ? (
                                        <img
                                            src={cuisine.image.url}
                                            alt={cuisine.name}
                                            className={`h-full w-full object-cover ${deleted ? 'opacity-60 grayscale-[0.25]' : ''}`}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute right-2 top-2">
                                        {deleted ? (
                                            <Tooltip title={deletedAt ? `Deactivated on ${dayjs(deletedAt).format('DD MMM YYYY HH:mm')}` : 'Deactivated'}>
                                                <Tag className="bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 gap-1">
                                                    <TbLockOff /> Deactivated
                                                </Tag>
                                            </Tooltip>
                                        ) : (
                                            <Tag className="bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 gap-1">
                                                <TbLockOpen /> Active
                                            </Tag>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5 pt-4">
                                    <h5 className={`line-clamp-2 text-base font-bold ${deleted ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
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
                                        {dayjs(cuisine.created_at).format(
                                            'DD/MM/YYYY',
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {!deleted && (
                                                <Button
                                                    size="sm"
                                                    variant="plain"
                                                    icon={<TbEdit />}
                                                    className="flex-1 justify-center min-w-0 sm:flex-none"
                                                    onClick={() =>
                                                        setEditingCuisine(cuisine)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {!deleted ? (
                                                <Button
                                                    size="sm"
                                                    variant="plain"
                                                    icon={<TbTrash />}
                                                    className="flex-1 justify-center min-w-0 text-red-500 hover:text-red-700 sm:flex-none"
                                                    loading={isBusy && isSoftDeleting}
                                                    disabled={isBusy}
                                                    onClick={() => setDeactivateTarget(cuisine)}
                                                >
                                                    Deactivate
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="plain"
                                                    icon={<TbRestore />}
                                                    className="flex-1 justify-center min-w-0 text-emerald-600 hover:text-emerald-700 sm:flex-none"
                                                    loading={isBusy && isReactivating}
                                                    disabled={isBusy}
                                                    onClick={() => setReactivateTarget(cuisine)}
                                                >
                                                    Restore
                                                </Button>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="plain"
                                            icon={<TbChevronRight />}
                                            className="w-full justify-center sm:w-auto sm:justify-start"
                                            onClick={() =>
                                                setViewingCuisine(cuisine)
                                            }
                                        >
                                            View details
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
                {viewingCuisine && (() => {
                    const vc: any = viewingCuisine
                    const deleted = isCuisineDeleted(vc)
                    const deletedAt = vc.deletedAt ?? vc.deleted_at
                    return (
                        <div className="p-6">
                            {vc.image?.url ? (
                                <div className="overflow-hidden rounded-xl">
                                    <img
                                        src={vc.image.url}
                                        alt={vc.name}
                                        className={`h-52 w-full object-cover ${deleted ? 'opacity-60' : ''}`}
                                    />
                                </div>
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                    <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                                </div>
                            )}

                            <div className="mt-5 flex items-start justify-between gap-3">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {vc.name}
                                </h3>
                                {deleted ? (
                                    <Tag className="bg-red-50 text-red-600 border-red-100 shrink-0 gap-1">
                                        <TbLockOff /> Deactivated
                                    </Tag>
                                ) : (
                                    <Tag className="bg-emerald-50 text-emerald-700 border-emerald-100 shrink-0 gap-1">
                                        <TbLockOpen /> Active
                                    </Tag>
                                )}
                            </div>
                            {deleted && deletedAt && (
                                <p className="mt-2 text-xs text-red-500">
                                    Deactivated on {dayjs(deletedAt).format('DD MMM YYYY HH:mm')} — hidden from mobile listings until reactivated.
                                </p>
                            )}

                            {vc.description && (
                                <span className="mt-3 block text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {vc.description}
                                </span>
                            )}

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <TbCalendar className="flex-shrink-0" />
                                    <span>
                                        Created:{' '}
                                        {dayjs(vc.created_at).format(
                                            'DD MMM YYYY',
                                        )}
                                    </span>
                                </div>
                                {vc.updated_at && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <TbInfoCircle className="flex-shrink-0" />
                                        <span>
                                            Last updated:{' '}
                                            {dayjs(
                                                vc.updated_at,
                                            ).format('DD MMM YYYY')}
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
                    )
                })()}
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

            <ConfirmDialog
                isOpen={Boolean(deactivateTarget)}
                type="danger"
                title="Deactivate cuisine?"
                onClose={() => !isSoftDeleting && setDeactivateTarget(null)}
                onRequestClose={() => !isSoftDeleting && setDeactivateTarget(null)}
                onCancel={() => setDeactivateTarget(null)}
                onConfirm={handleConfirmSoftDelete}
                cancelText="Cancel"
                confirmText={isSoftDeleting ? 'Deactivating...' : 'Deactivate'}
                confirmButtonProps={{ loading: isSoftDeleting, disabled: isSoftDeleting }}
                cancelButtonProps={{ disabled: isSoftDeleting }}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        Hide <strong className="text-gray-900 dark:text-gray-100">{deactivateTarget?.name}</strong> from mobile listings?
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>Cuisine will no longer appear in mobile cuisine listings.</li>
                        <li>You can restore it at any time via Restore.</li>
                    </ul>
                </div>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={Boolean(reactivateTarget)}
                type="success"
                title="Reactivate cuisine?"
                onClose={() => !isReactivating && setReactivateTarget(null)}
                onRequestClose={() => !isReactivating && setReactivateTarget(null)}
                onCancel={() => setReactivateTarget(null)}
                onConfirm={handleConfirmReactivate}
                cancelText="Cancel"
                confirmText={isReactivating ? 'Restoring...' : 'Restore'}
                confirmButtonProps={{ loading: isReactivating, disabled: isReactivating }}
                cancelButtonProps={{ disabled: isReactivating }}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        Restore <strong className="text-gray-900 dark:text-gray-100">{reactivateTarget?.name}</strong> to mobile listings?
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>Cuisine will reappear in mobile listings.</li>
                    </ul>
                </div>
            </ConfirmDialog>
        </>
    )
}

export default CuisineListCards

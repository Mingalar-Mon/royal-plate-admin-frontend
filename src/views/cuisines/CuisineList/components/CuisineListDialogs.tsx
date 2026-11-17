import dayjs from 'dayjs'
import {
    TbCalendar,
    TbInfoCircle,
    TbLockOff,
    TbLockOpen,
    TbPhotoOff,
} from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CuisineForm from '@/views/cuisines/components/CuisineForm'
import type { Cuisine } from '@/views/cuisines/types/cuisine.type'
import { isCuisineDeleted } from '../hooks/useCuisineListActions'
import type { useCuisineListActions } from '../hooks/useCuisineListActions'

type CuisineListDialogsProps = ReturnType<typeof useCuisineListActions>

const CuisineListDialogs = ({
    viewingCuisine,
    setViewingCuisine,
    editingCuisine,
    setEditingCuisine,
    deactivateTarget,
    setDeactivateTarget,
    reactivateTarget,
    setReactivateTarget,
    handleEditSubmit,
    handleConfirmSoftDelete,
    handleConfirmReactivate,
    isUpdating,
    isSoftDeleting,
    isReactivating,
}: CuisineListDialogsProps) => {
    return (
        <>
            <Dialog
                isOpen={Boolean(viewingCuisine)}
                onClose={() => setViewingCuisine(null)}
                onRequestClose={() => setViewingCuisine(null)}
                width={600}
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Cuisine Details"
            >
                {viewingCuisine &&
                    (() => {
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
                                        Deactivated on{' '}
                                        {dayjs(deletedAt).format(
                                            'DD MMM YYYY HH:mm',
                                        )}{' '}
                                        — hidden from mobile listings until
                                        reactivated.
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
                                                {dayjs(vc.updated_at).format(
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
                onRequestClose={() =>
                    !isSoftDeleting && setDeactivateTarget(null)
                }
                onCancel={() => setDeactivateTarget(null)}
                onConfirm={handleConfirmSoftDelete}
                cancelText="Cancel"
                confirmText={isSoftDeleting ? 'Deactivating...' : 'Deactivate'}
                confirmButtonProps={{
                    loading: isSoftDeleting,
                    disabled: isSoftDeleting,
                }}
                cancelButtonProps={{ disabled: isSoftDeleting }}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        Hide{' '}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {deactivateTarget?.name}
                        </strong>{' '}
                        from mobile listings?
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>
                            Cuisine will no longer appear in mobile cuisine
                            listings.
                        </li>
                        <li>You can restore it at any time via Restore.</li>
                    </ul>
                </div>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={Boolean(reactivateTarget)}
                type="success"
                title="Reactivate cuisine?"
                onClose={() => !isReactivating && setReactivateTarget(null)}
                onRequestClose={() =>
                    !isReactivating && setReactivateTarget(null)
                }
                onCancel={() => setReactivateTarget(null)}
                onConfirm={handleConfirmReactivate}
                cancelText="Cancel"
                confirmText={isReactivating ? 'Restoring...' : 'Restore'}
                confirmButtonProps={{
                    loading: isReactivating,
                    disabled: isReactivating,
                }}
                cancelButtonProps={{ disabled: isReactivating }}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        Restore{' '}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {reactivateTarget?.name}
                        </strong>{' '}
                        to mobile listings?
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>Cuisine will reappear in mobile listings.</li>
                    </ul>
                </div>
            </ConfirmDialog>
        </>
    )
}

export default CuisineListDialogs

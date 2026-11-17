import { useState } from 'react'
import type {
    Cuisine,
    CuisineFormData,
} from '@/views/cuisines/types/cuisine.type'
import {
    useUpdateCuisineMutation,
    useSoftDeleteCuisineMutation,
    useReactivateCuisineMutation,
} from '@/utils/custom-hooks/useCuisine'
import { Notification, toast } from '@/components/ui'

/** Tolerant deleted-flag check — the API may return either naming variant. */
export const isCuisineDeleted = (cuisine: any): boolean =>
    Boolean(cuisine?.deletedAt ?? cuisine?.deleted_at)

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback

/**
 * Shared action state for the cuisine list. Both the card view and the table
 * view drive the same dialogs/mutations through this hook, so the two views
 * behave identically.
 */
export const useCuisineListActions = () => {
    const [viewingCuisine, setViewingCuisine] = useState<Cuisine | null>(null)
    const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null)
    const [deactivateTarget, setDeactivateTarget] = useState<Cuisine | null>(
        null,
    )
    const [reactivateTarget, setReactivateTarget] = useState<Cuisine | null>(
        null,
    )

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
                        Cuisine soft deleted successfully — hidden from mobile
                        listings.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setDeactivateTarget(null)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Deactivation failed">
                        {getErrorMessage(
                            error,
                            'Could not deactivate cuisine.',
                        )}
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
                        Cuisine reactivated successfully — visible in mobile
                        listings again.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setReactivateTarget(null)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Reactivation failed">
                        {getErrorMessage(
                            error,
                            'Could not reactivate cuisine.',
                        )}
                    </Notification>,
                )
            },
        })
    }

    const isCuisineBusy = (cuisine: Cuisine | null | undefined) =>
        Boolean(
            cuisine &&
            ((isSoftDeleting && deactivateTarget?.id === cuisine.id) ||
                (isReactivating && reactivateTarget?.id === cuisine.id)),
        )

    return {
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
        isCuisineBusy,
    }
}

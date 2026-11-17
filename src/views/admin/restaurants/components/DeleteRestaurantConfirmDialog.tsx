import { useEffect, useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useDeleteRestaurantBySuperAdmin } from '@/utils/custom-hooks/useRestaurant'
import { getHardDeleteFailure } from '@/utils/helpers/restaurantHardDelete.helper'
import { TbAlertTriangle } from 'react-icons/tb'

export type DeleteRestaurantTarget = {
    id: string
    name: string
}

type DeleteRestaurantConfirmDialogProps = {
    restaurant: DeleteRestaurantTarget | null
    onClose: () => void
}

/**
 * Super-admin hard-delete confirmation.
 *
 * The endpoint requires the restaurant's current name to be supplied verbatim
 * (mismatch → 400), so the Delete button stays disabled until the admin types
 * an exact, case-sensitive match. The name we send is always the one fetched
 * from the API — never the raw input — so confirmation cannot drift from the
 * record actually being deleted.
 */
const DeleteRestaurantConfirmDialog = ({
    restaurant,
    onClose,
}: DeleteRestaurantConfirmDialogProps) => {
    const [typedName, setTypedName] = useState('')

    const { mutate: deleteRestaurant, isPending } =
        useDeleteRestaurantBySuperAdmin()

    // Reset the confirmation field every time a different restaurant is targeted
    // (including when the dialog closes and `restaurant` becomes null).
    useEffect(() => {
        setTypedName('')
    }, [restaurant?.id])

    const matches = Boolean(restaurant && typedName.trim() === restaurant.name)

    const handleConfirm = () => {
        if (!restaurant || !matches || isPending) return

        deleteRestaurant(
            { id: restaurant.id, restaurantName: restaurant.name },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Restaurant deleted">
                            <strong>{restaurant.name}</strong> and all of its
                            associated data were permanently deleted.
                        </Notification>,
                    )
                    onClose()
                },
                onError: (error: any) => {
                    const failure = getHardDeleteFailure(error)
                    toast.push(
                        <Notification type={failure.type} title="Delete failed">
                            {failure.message}
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <ConfirmDialog
            isOpen={Boolean(restaurant)}
            type="danger"
            title="Permanently delete restaurant?"
            cancelText="Cancel"
            confirmText={isPending ? 'Deleting...' : 'Delete permanently'}
            confirmButtonProps={{
                loading: isPending,
                disabled: isPending || !matches,
                customColorClass: () =>
                    '!bg-red-600 hover:!bg-red-700 !text-white',
            }}
            cancelButtonProps={{ disabled: isPending }}
            onClose={() => !isPending && onClose()}
            onRequestClose={() => !isPending && onClose()}
            onCancel={() => !isPending && onClose()}
            onConfirm={handleConfirm}
        >
            <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                    You are about to <strong>permanently delete</strong>{' '}
                    <strong className="text-gray-900 dark:text-gray-100">
                        {restaurant?.name || 'this restaurant'}
                    </strong>
                    . This is a hard delete and{' '}
                    <strong>cannot be undone</strong>.
                </p>

                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <TbAlertTriangle className="mt-0.5 shrink-0 text-base" />
                    <span>
                        The restaurant row and <strong>all</strong> of its data
                        will be removed: staff, dishes, ratings, blogs,
                        commission batches, reservations, orders, tables, the
                        restaurant profile, and every logo, image and dish photo
                        in storage.
                    </span>
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="delete-restaurant-name"
                        className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                    >
                        Type the restaurant name to confirm:
                    </label>
                    <p className="mt-1 select-all break-words rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                        {restaurant?.name}
                    </p>
                    <Input
                        id="delete-restaurant-name"
                        className="mt-2"
                        size="sm"
                        autoComplete="off"
                        placeholder="Enter the exact restaurant name"
                        value={typedName}
                        disabled={isPending}
                        invalid={typedName.length > 0 && !matches}
                        onChange={(e) => setTypedName(e.target.value)}
                    />
                    <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                        Case-sensitive and must match exactly. Leading and
                        trailing spaces are ignored.
                    </p>
                </div>
            </div>
        </ConfirmDialog>
    )
}

export default DeleteRestaurantConfirmDialog

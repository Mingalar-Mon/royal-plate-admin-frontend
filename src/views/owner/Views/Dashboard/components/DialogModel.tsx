import { ConfirmDialog } from '@/components/shared'
// import Button from '@/components/ui/Button'
// import Dialog from '@/components/ui/Dialog'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useDeleteRestaurant } from '@/utils/custom-hooks/useRestaurant'
// import { useDialogStore } from '@/views/owner/store/dialogStore'
import { useNavigate } from 'react-router'

const DialogModal = () => {
    const navigate = useNavigate()

    // const { isOpen, data, closeDialog } = useDialogStore()

    const { isDialogOpen, activeRestaurant, closeDialog, dialogView } =
        useRestaurantStore()

    const { mutate: deleteRestaurant, isPending: isDeleting } =
        useDeleteRestaurant()

    const handleClose = () => {
        if (isDeleting) return
        closeDialog()
    }

    const handleOk = () => {
        // Handle OK action here
        // console.log('Dialog restaurant id:', data.restaurantId)
        if (!activeRestaurant) return

        console.log('Dialog restaurant id:', activeRestaurant?.id)
        // navigate(`/restaurant/profile/create/${data.restaurantId}`)
        if (dialogView == 'CREATE_PROFILE') {
            navigate(
                `/restaurant/create-restaurant-profile/${activeRestaurant?.id}`,
            )
            closeDialog()
        } else if (dialogView == 'DELETE_CONFIRM') {
            deleteRestaurant(activeRestaurant.id, {
                onSettled: () => closeDialog(),
            })
        }
    }
    const isCreate = dialogView === 'CREATE_PROFILE'

    return (
        <ConfirmDialog
            isOpen={isDialogOpen}
            type={isCreate ? 'info' : 'danger'}
            title={
                isCreate ? 'Restaurant Profile Missing' : ' Delete Restaurant'
            }
            confirmText={isCreate ? 'Create' : 'Delete'}
            confirmButtonProps={{ loading: isDeleting }}
            cancelButtonProps={{ disabled: isDeleting }}
            onClose={handleClose}
            onRequestClose={handleClose}
            onConfirm={handleOk}
            onCancel={handleClose}
        >
            {dialogView === 'CREATE_PROFILE' ? (
                <>
                    {/* <h5 className="mb-4 text-amber-500">
                        Restaurant Profile Missing
                    </h5> */}
                    <div>
                        This restaurant does not have a complete profile yet.
                        {activeRestaurant && (
                            <p> Restaurant: {activeRestaurant.name}</p>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* <h5 className="mb-4 text-red-500">Delete Restaurant</h5> */}
                    <p>
                        Are you sure you want to delete{' '}
                        <b>{activeRestaurant?.name}</b>? This action cannot be
                        undone.
                    </p>
                </>
            )}
        </ConfirmDialog>
        /*
        <Dialog
            isOpen={isDialogOpen}
            // isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            {dialogView === 'CREATE_PROFILE' ? (
                <>
                    <h5 className="mb-4 text-amber-500">
                        Restaurant Profile Missing
                    </h5>
                    <div>
                        This restaurant does not have a complete profile yet.
                        {activeRestaurant && (
                            <p> Restaurant: {activeRestaurant.name}</p>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h5 className="mb-4 text-red-500">Delete Restaurant</h5>
                    <p>
                        Are you sure you want to delete{' '}
                        <b>{activeRestaurant?.name}</b>? This action cannot be
                        undone.
                    </p>
                </>
            )}

            <div className="text-right mt-6">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    className={
                        dialogView === 'DELETE_CONFIRM'
                            ? 'red-600'
                            : 'indigo-600'
                    }
                    onClick={handleOk}
                >
                    {dialogView === 'DELETE_CONFIRM' ? 'Delete' : 'Create'}
                </Button>
            </div>
        </Dialog>
        */
    )
}

export default DialogModal

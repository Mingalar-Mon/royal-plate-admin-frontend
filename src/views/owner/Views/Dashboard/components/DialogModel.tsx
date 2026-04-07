import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { useDialogStore } from '@/views/owner/store/dialogStore'
import { useNavigate } from 'react-router'

const DialogModal = () => {
    const navigate = useNavigate()

    const { isOpen, data, closeDialog } = useDialogStore()

    const handleClose = () => {
        closeDialog()
    }

    const handleOk = () => {
        // Handle OK action here
        console.log('Dialog restaurant id:', data.restaurantId)
        navigate(`/restaurant/profile/create/${data.restaurantId}`)
        closeDialog()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <h5 className="mb-4">Restaurant Profile Missing</h5>
            <div>
                This restaurant does not have a complete profile yet.
                {data && <p> Restaurant: {data.restaurantName}</p>}
            </div>
            <div className="text-right mt-6">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button variant="solid" onClick={handleOk}>
                    Create
                </Button>
            </div>
        </Dialog>
    )
}

export default DialogModal

import { HiBell, HiOutlineExclamation } from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

interface NotificationPermissionDialogProps {
    isOpen: boolean
    denied: boolean
    onEnable: () => void
    onDismiss: () => void
}

const NotificationPermissionDialog = ({
    isOpen,
    denied,
    onEnable,
    onDismiss,
}: NotificationPermissionDialogProps) => {
    return (
        <Dialog
            isOpen={isOpen}
            width={440}
            closable={false}
            onRequestClose={onDismiss}
        >
            <div className="px-6 pb-6 pt-2 flex flex-col items-center text-center">
                <div className="mb-4 mt-2">
                    {denied ? (
                        <Avatar
                            className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
                            shape="circle"
                            size={60}
                        >
                            <span className="text-3xl">
                                <HiOutlineExclamation />
                            </span>
                        </Avatar>
                    ) : (
                        <Avatar
                            className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                            shape="circle"
                            size={60}
                        >
                            <span className="text-3xl">
                                <HiBell />
                            </span>
                        </Avatar>
                    )}
                </div>
                <h5 className="mb-2">
                    {denied ? 'Notifications are Blocked' : 'Enable Notifications'}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                    {denied
                        ? 'You have blocked notifications for this site. To receive real-time updates, enable notifications in your browser settings.'
                        : 'Stay updated with real-time order and reservation alerts. Enable notifications to never miss an update.'}
                </p>
                <div className="flex justify-center gap-3 w-full">
                    {denied ? (
                        <Button variant="solid" onClick={onDismiss}>
                            Proceed Anyway
                        </Button>
                    ) : (
                        <>
                            <Button variant="plain" onClick={onDismiss}>
                                Not Now
                            </Button>
                            <Button variant="solid" onClick={onEnable}>
                                Enable Notifications
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Dialog>
    )
}

export default NotificationPermissionDialog
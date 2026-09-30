import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbPlus } from 'react-icons/tb'
import { getCommissionErrorMessage } from '@/services/CommissionService'
import { useCreateCommissionMutation } from '@/utils/custom-hooks/useCommission'
import CommissionForm from '../../components/CommissionForm'
import type { CommissionFormData } from '@/@types/commission'

interface CommissionCreateModalProps {
    isOpen: boolean
    onClose: () => void
    /** Pre-selects a restaurant, e.g. from the coverage panel. */
    restaurantId?: string
}

const CommissionCreateModal = ({
    isOpen,
    onClose,
    restaurantId,
}: CommissionCreateModalProps) => {
    const { mutate: createCommission, isPending } =
        useCreateCommissionMutation()

    const handleSubmit = (formData: CommissionFormData) => {
        createCommission(formData, {
            onSuccess: () => {
                onClose()
                toast.push(
                    <Notification
                        type="success"
                        title="Commission configuration created"
                    >
                        {formData.is_active
                            ? 'The new batch is now active and charging.'
                            : 'The batch was staged and is not charging yet.'}
                    </Notification>,
                )
            },
            onError: (error) => {
                toast.push(
                    <Notification
                        type="danger"
                        title="Could not create configuration"
                    >
                        {getCommissionErrorMessage(error)}
                    </Notification>,
                )
            },
        })
    }

    return (
        <Dialog
            isOpen={isOpen}
            width={880}
            contentClassName="max-h-[90vh] overflow-y-auto"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="space-y-4 p-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        New Commission Configuration
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Commission batches are immutable. Changing a rate later
                        means creating another batch, not editing this one.
                    </p>
                </div>

                <CommissionForm
                    // Remount when the preselected restaurant changes, so the
                    // select never shows a stale one from a previous open.
                    key={restaurantId ?? 'new'}
                    restaurantId={restaurantId}
                    onFormSubmit={handleSubmit}
                >
                    <Alert showIcon type="info" title="Heads up">
                        <p className="text-sm leading-relaxed">
                            Creating an active batch automatically deactivates
                            the restaurant&rsquo;s current active batch and
                            stamps its retirement date. Superseded batches stay
                            in the list as history.
                        </p>
                    </Alert>
                    <Alert
                        showIcon
                        type="warning"
                        title="Percentages are final"
                    >
                        <p className="text-sm leading-relaxed">
                            Once created, these percentages and flags cannot be
                            changed. The only field you can toggle later is the
                            active status.
                        </p>
                    </Alert>
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="plain" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            icon={<TbPlus />}
                            loading={isPending}
                        >
                            Create Batch
                        </Button>
                    </div>
                </CommissionForm>
            </div>
        </Dialog>
    )
}

export default CommissionCreateModal

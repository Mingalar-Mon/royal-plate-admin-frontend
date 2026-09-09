import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import StaffForm from '../../components/StaffForm'
import { useUpdateStaff } from '@/utils/custom-hooks/useStaff'
import type { Staff } from '@/services/RestaurantStaffService'
import type { StaffFormData } from '../../types/staff.type'

interface StaffEditModalProps {
    staff: Staff | null
    onClose: () => void
}

const StaffEditModal = ({ staff, onClose }: StaffEditModalProps) => {
    const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff()

    if (!staff) return null

    const defaultValues: StaffFormData = {
        name: staff.name,
        email: staff.email,
        role: staff.role,
        password: '',
    }

    const handleSubmit = (data: StaffFormData) => {
        // Clean out blank values so we don't overwrite passwords accidentally
        const cleanedData: any = {
            name: data.name,
            email: data.email,
            role: data.role,
        }

        if (data.password) cleanedData.password = data.password

        updateStaff(
            { id: staff.id, data: cleanedData },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success">
                            Staff updated
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                    onClose()
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger">
                            Failed to update staff
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <Dialog
            isOpen={Boolean(staff)}
            width={640}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6">
                <StaffForm
                    defaultValues={defaultValues}
                    isNew={false}
                    onFormSubmit={handleSubmit}
                >
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="plain" onClick={onClose}>
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
                </StaffForm>
            </div>
        </Dialog>
    )
}

export default StaffEditModal
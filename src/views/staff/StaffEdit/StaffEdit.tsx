import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import StaffForm from '../components/StaffForm'
import type { StaffFormData } from '../types/staff.type'

import {
    useStaff,
    useUpdateStaff,
    useDeleteStaff,
} from '@/utils/custom-hooks/useStaff'

const StaffEdit = () => {
    const { staffId, restaurantId } = useParams()

    // console.log('StaffEdit params:', { staffId, restaurantId }) // Debug log for route parameters
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const { data: staffResponse, isLoading } = useStaff(staffId!, {
        enabled: !!staffId && !isDeleting,
    })
    const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff()
    const { mutate: deleteStaff } = useDeleteStaff()
    const staff = staffResponse?.data

    if (isLoading) return <div className="p-8 text-center">Loading...</div>
    if (!staff) return <div className="p-8 text-center">Staff not found</div>

    const defaultValues: StaffFormData = {
        name: staff.name,
        email: staff.email,
        role: staff.role,
        password: '',
    }

    const handleSubmit = (data: StaffFormData) => {
        console.log('Form submitted with data:', data) // Debug log for form submission data
        // Clean out blank values so we don't overwrite passwords accidentally
        const cleanedData: any = {
            name: data.name,
            email: data.email,
            role: data.role,
        }

        if (data.password) cleanedData.password = data.password

        console.log('Submitting staff update with data:', cleanedData) // Debug log for form submission data

        updateStaff(
            { id: staffId!, data: cleanedData },
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
                    console.log(
                        'navigating /restaurants/${restaurantId}/staffs',
                    )
                    navigate(`/restaurants/${restaurantId}/staffs`)
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

    const handleDelete = () => {
        setIsDeleting(true)
        setDeleteConfirmationOpen(false)
        deleteStaff(staffId!, {
            onSuccess: async () => {
                // setIsDeleting(true)
                toast.push(
                    <Notification type="success">Staff deleted</Notification>,
                    {
                        placement: 'top-center',
                    },
                )

                await navigate(`/restaurants/${restaurantId}/staffs`, {
                    replace: true,
                })
            },
            onError: () => {
                setIsDeleting(false)
                toast.push(
                    <Notification type="danger">
                        Failed to delete staff
                    </Notification>,
                )
            },
        })

        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            <StaffForm
                defaultValues={defaultValues}
                isNew={false}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/staffs`)
                        }
                    >
                        Back to Staff
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500"
                            onClick={() => setDeleteConfirmationOpen(true)}
                        >
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </StaffForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Staff"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete this staff member? This
                    action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default StaffEdit

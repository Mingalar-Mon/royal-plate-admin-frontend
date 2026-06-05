import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import StaffForm from '../components/StaffForm'
import type { StaffFormData } from '../types/staff.type'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import { useCreateStaff } from '@/utils/custom-hooks/useStaff'
import { AdaptiveCard } from '@/components/shared'

const StaffCreate = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    // const [isSubmitting, setIsSubmitting] = useState(false)

    const { mutate: createStaff, isPending } = useCreateStaff()

    const handleSubmit = (data: StaffFormData) => {
        if (!restaurantId) return

        createStaff(
            {
                restaurantId: restaurantId,
                data: {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    password: data.password,
                },
            },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success">
                            Staff created successfully!
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    navigate(`/restaurants/${restaurantId}/staffs`, {
                        replace: true,
                    })
                },
                onError: (error: any) => {
                    console.error('Error creating staff member account:', error)
                    toast.push(
                        <Notification type="danger" title="Error">
                            {error?.response?.data?.message ||
                                'Failed to create staff account'}
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <AdaptiveCard>
            <StaffForm isNew={true} onFormSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/staff`)
                        }
                    >
                        Back to Staff
                    </Button>
                    <Button type="submit" variant="solid" loading={isPending}>
                        Create Staff
                    </Button>
                </div>
            </StaffForm>
        </AdaptiveCard>
    )
}

export default StaffCreate

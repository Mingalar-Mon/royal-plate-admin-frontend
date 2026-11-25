import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import { AdaptiveCard } from '@/components/shared'
import AdminForm, { MANUAL_ROLE } from '../components/AdminForm'
import type { AdminFormData } from '@/@types/admin'
import {
    getAdminApiErrorMessage,
    useAdminRoleOptions,
    useCreateAdmin,
} from '@/utils/custom-hooks/useAdmin'

const AdminCreate = () => {
    const navigate = useNavigate()
    const { data: roleOptions = [] } = useAdminRoleOptions()
    const { mutate: createAdmin, isPending } = useCreateAdmin()

    const handleSubmit = (data: AdminFormData) => {
        createAdmin(
            {
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                code: data.code,
                roleId:
                    data.roleId === MANUAL_ROLE
                        ? data.manualRoleId
                        : data.roleId || null,
            },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Admin created">
                            The admin account was created successfully.
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    navigate('/admin/admins', { replace: true })
                },
                onError: (error) => {
                    toast.push(
                        <Notification type="danger" title="Create failed">
                            {getAdminApiErrorMessage(
                                error,
                                'Failed to create admin.',
                            )}
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <AdaptiveCard>
            <AdminForm
                isNew
                roleOptions={roleOptions}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/admin/admins')}
                    >
                        Back to Admins
                    </Button>
                    <Button type="submit" variant="solid" loading={isPending}>
                        Create Admin
                    </Button>
                </div>
            </AdminForm>
        </AdaptiveCard>
    )
}

export default AdminCreate

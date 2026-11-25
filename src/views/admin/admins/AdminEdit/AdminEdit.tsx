import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Spinner from '@/components/ui/Spinner'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import AdminForm, { MANUAL_ROLE } from '../components/AdminForm'
import type { AdminFormData } from '@/@types/admin'
import {
    getAdminApiErrorMessage,
    useAdmin,
    useAdminRoleOptions,
    useDeleteAdmin,
    useUpdateAdmin,
} from '@/utils/custom-hooks/useAdmin'
import { useSessionUser } from '@/store/authStore'

const AdminEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const currentUserId = useSessionUser((state) => state.user.userId)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const { data: adminResponse, isLoading } = useAdmin(id || '')
    const { data: roleOptions = [] } = useAdminRoleOptions()
    const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin()
    const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin()

    const admin = adminResponse?.data
    const isSelf = Boolean(admin && currentUserId && admin.id === currentUserId)

    const defaultValues = useMemo<AdminFormData>(
        () => ({
            name: admin?.name ?? '',
            email: admin?.email ?? '',
            password: '',
            phone: admin?.phone ?? '',
            code: admin?.code ?? '',
            roleId: admin?.role?.id ?? '',
            manualRoleId: '',
        }),
        [admin],
    )

    if (isLoading) {
        return (
            <div className="flex min-h-48 items-center justify-center gap-3">
                <Spinner size={32} />
                <span className="text-sm text-gray-500">Loading admin...</span>
            </div>
        )
    }
    if (!admin) {
        return <div className="p-8 text-center">Admin not found</div>
    }

    const handleSubmit = (data: AdminFormData) => {
        const roleId =
            data.roleId === MANUAL_ROLE
                ? data.manualRoleId
                : data.roleId || null

        const payload: Parameters<typeof updateAdmin>[0]['data'] = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            code: data.code,
        }
        if (data.password) payload.password = data.password
        // The backend rejects clearing your own role, so don't send roleId
        // in that case; the UI also hides "No role" when editing yourself.
        if (!(isSelf && !roleId)) payload.roleId = roleId

        updateAdmin(
            { id: admin.id, data: payload },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Admin updated">
                            The admin account was updated successfully.
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    navigate('/admin/admins')
                },
                onError: (error) => {
                    toast.push(
                        <Notification type="danger" title="Update failed">
                            {getAdminApiErrorMessage(
                                error,
                                'Failed to update admin.',
                            )}
                        </Notification>,
                    )
                },
            },
        )
    }

    const handleDelete = () => {
        deleteAdmin(admin.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Admin deleted">
                        The admin account was deleted successfully.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setDeleteConfirmationOpen(false)
                navigate('/admin/admins', { replace: true })
            },
            onError: (error) => {
                setDeleteConfirmationOpen(false)
                toast.push(
                    <Notification type="danger" title="Delete failed">
                        {getAdminApiErrorMessage(
                            error,
                            'Failed to delete admin.',
                        )}
                    </Notification>,
                )
            },
        })
    }

    return (
        <>
            <AdminForm
                defaultValues={defaultValues}
                isNew={false}
                roleOptions={roleOptions}
                currentRole={admin.role}
                isSelf={isSelf}
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
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500"
                            disabled={isSelf}
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
            </AdminForm>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete admin?"
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
                confirmButtonProps={{
                    loading: isDeleting,
                    disabled: isDeleting,
                    customColorClass: () =>
                        '!bg-red-600 hover:!bg-red-700 !text-white',
                }}
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <strong>{admin.name}</strong>? This action cannot be undone.
                    Banners authored by this admin will also be removed.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default AdminEdit

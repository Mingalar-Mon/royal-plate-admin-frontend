import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbEdit, TbPlus, TbRefresh, TbSearch, TbTrash } from 'react-icons/tb'
import { useSessionUser } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import type { AdminDTO } from '@/@types/admin'
import {
    getAdminApiErrorMessage,
    useAdminList,
    useDeleteAdmin,
} from '@/utils/custom-hooks/useAdmin'

const AdminAdmins = () => {
    const navigate = useNavigate()
    const currentUserId = useSessionUser((state) => state.user.userId)
    const tableData = useAdminStore((state) => state.tableData)
    const setTableData = useAdminStore((state) => state.setTableData)

    const [search, setSearch] = useState(tableData.query)
    const [deleteTarget, setDeleteTarget] = useState<AdminDTO | null>(null)

    const { data, isLoading, isFetching, refetch } = useAdminList({
        page: tableData.pageIndex,
        limit: tableData.pageSize,
        search: tableData.query,
    })
    const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin()

    const updateQuery = useCallback(
        (value: string) => {
            setTableData((prev) => ({ ...prev, query: value, pageIndex: 1 }))
        },
        [setTableData],
    )
    const debouncedSearch = useDebounce(updateQuery, 400)

    const admins = data?.data ?? []
    const paginator = data?.paginator

    const columns: ColumnDef<AdminDTO>[] = useMemo(
        () => [
            {
                header: 'Admin',
                accessorKey: 'name',
                cell: (props) => {
                    const admin = props.row.original
                    return (
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {admin.name}
                                {currentUserId === admin.id && (
                                    <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                                        You
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {admin.email}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) =>
                    props.row.original.phone || (
                        <span className="text-gray-400">—</span>
                    ),
            },
            {
                header: 'Code',
                accessorKey: 'code',
                cell: (props) =>
                    props.row.original.code || (
                        <span className="text-gray-400">—</span>
                    ),
            },
            {
                header: 'Role',
                id: 'role',
                cell: (props) => {
                    const role = props.row.original.role
                    if (!role) {
                        return <span className="text-gray-400">No role</span>
                    }
                    return (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                            {role.name}
                        </span>
                    )
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => {
                    const admin = props.row.original
                    return (
                        <div className="flex items-center justify-end gap-3">
                            <Tooltip title="Edit admin">
                                <div
                                    className="cursor-pointer text-xl text-blue-500"
                                    onClick={() =>
                                        navigate(
                                            `/admin/admins/edit/${admin.id}`,
                                        )
                                    }
                                >
                                    <TbEdit />
                                </div>
                            </Tooltip>
                            <Tooltip
                                title={
                                    currentUserId === admin.id
                                        ? 'You cannot delete your own account'
                                        : 'Delete admin'
                                }
                            >
                                <div
                                    className={`text-xl ${
                                        currentUserId === admin.id
                                            ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                                            : 'cursor-pointer text-red-500 hover:text-red-700'
                                    }`}
                                    onClick={() => {
                                        if (currentUserId !== admin.id) {
                                            setDeleteTarget(admin)
                                        }
                                    }}
                                >
                                    <TbTrash />
                                </div>
                            </Tooltip>
                        </div>
                    )
                },
            },
        ],
        [currentUserId, navigate],
    )

    const handleDelete = () => {
        if (!deleteTarget) return
        deleteAdmin(deleteTarget.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Admin deleted">
                        <strong>{deleteTarget.name}</strong> was deleted
                        successfully.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setDeleteTarget(null)
            },
            onError: (error) => {
                toast.push(
                    <Notification type="danger" title="Delete failed">
                        {getAdminApiErrorMessage(
                            error,
                            'Failed to delete admin.',
                        )}
                    </Notification>,
                )
                setDeleteTarget(null)
            },
        })
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-primary text-xl font-bold">
                                Administrators
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage portal administrators. Only superadmins
                                can perform these actions.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="default"
                                icon={<TbRefresh className="h-4 w-4" />}
                                loading={isFetching && !isLoading}
                                onClick={() => refetch()}
                            >
                                Refresh
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                icon={<TbPlus className="h-4 w-4" />}
                                onClick={() => navigate('/admin/admins/create')}
                            >
                                Add Admin
                            </Button>
                        </div>
                    </div>

                    <Input
                        prefix={<TbSearch />}
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            debouncedSearch(e.target.value)
                        }}
                    />

                    <DataTable
                        instanceId="admin-admins"
                        columns={columns}
                        data={admins}
                        loading={isFetching}
                        pageSizes={[10, 25, 50, 100]}
                        pagingData={{
                            total: paginator?.totalItems ?? 0,
                            pageIndex: tableData.pageIndex,
                            pageSize: tableData.pageSize,
                        }}
                        onPaginationChange={(page) =>
                            setTableData((prev) => ({
                                ...prev,
                                pageIndex: page,
                            }))
                        }
                        onSelectChange={(size) =>
                            setTableData((prev) => ({
                                ...prev,
                                pageSize: size,
                                pageIndex: 1,
                            }))
                        }
                    />

                    {!isLoading && admins.length === 0 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            {tableData.query
                                ? 'No admins match your search.'
                                : 'No admins found.'}
                        </p>
                    )}
                </div>
            </AdaptiveCard>

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                type="danger"
                title="Delete admin?"
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
                confirmButtonProps={{
                    loading: isDeleting,
                    disabled: isDeleting,
                    customColorClass: () =>
                        '!bg-red-600 hover:!bg-red-700 !text-white',
                }}
                onClose={() => setDeleteTarget(null)}
                onRequestClose={() => setDeleteTarget(null)}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <strong>{deleteTarget?.name}</strong>? This action cannot be
                    undone.
                </p>
            </ConfirmDialog>
        </Container>
    )
}

export default AdminAdmins

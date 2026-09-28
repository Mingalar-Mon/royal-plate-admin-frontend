import { useMemo, useState } from 'react'
import { useUserTableStore } from '@/store/userStore'
import { ColumnDef } from '@tanstack/react-table'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ActionColumn from '@/views/order/components/ActionColumn'
import UserViewModal from './UserViewModal'
import { useSessionUser } from '@/store/authStore'
import { ADMIN } from '@/constants/roles.constant'
import {
    useReactivateUser,
    useSoftDeleteUser,
} from '@/utils/custom-hooks/useUser'
import {
    getUserActionFailure,
    getUserId,
    isUserActive,
    isUserDeactivated,
} from '@/utils/helpers/userLifecycle.helper'
import dayjs from 'dayjs'
import { TbRestore, TbTrash } from 'react-icons/tb'

interface UserListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const UserVerifiedBadge = ({ isVerified }: { isVerified: boolean }) => (
    <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isVerified
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
        }`}
    >
        {isVerified ? 'Verified' : 'Unverified'}
    </span>
)

const UserListTable = ({ data, total, loading }: UserListTableProps) => {
    const [viewingUser, setViewingUser] = useState<any | null>(null)
    const [deactivateTarget, setDeactivateTarget] = useState<any | null>(null)
    const [reactivateTarget, setReactivateTarget] = useState<any | null>(null)

    const tableData = useUserTableStore((state) => state.tableData)
    const setTableData = useUserTableStore((state) => state.setTableData)

    const { mutate: softDeleteUser, isPending: isSoftDeleting } =
        useSoftDeleteUser()
    const { mutate: reactivateUser, isPending: isReactivating } =
        useReactivateUser()

    // ✅ Both lifecycle endpoints are super admin only with no self-service
    // path, so owner/staff logins never see either trigger.
    const authority = useSessionUser((state) => state.user.authority) || []
    const isSuperAdmin = authority.some((role) =>
        String(role).toUpperCase().includes(ADMIN),
    )

    const handleConfirmDeactivate = () => {
        const userId = getUserId(deactivateTarget)
        if (!userId) return

        softDeleteUser(userId, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="User deactivated">
                        User account deactivated successfully. They can no
                        longer request an OTP or log in.
                    </Notification>,
                )
                setDeactivateTarget(null)
            },
            onError: (error: any) => {
                const failure = getUserActionFailure(error, 'deactivate')

                toast.push(
                    <Notification
                        type={failure.type}
                        title="Deactivation failed"
                    >
                        {failure.message}
                    </Notification>,
                )
            },
        })
    }

    const handleConfirmReactivate = () => {
        const userId = getUserId(reactivateTarget)
        if (!userId) return

        reactivateUser(userId, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="User reactivated">
                        User account reactivated successfully. They can request
                        an OTP and log in again.
                    </Notification>,
                )
                setReactivateTarget(null)
            },
            onError: (error: any) => {
                const failure = getUserActionFailure(error, 'reactivate')

                toast.push(
                    <Notification
                        type={failure.type}
                        title="Reactivation failed"
                    >
                        {failure.message}
                    </Notification>,
                )
            },
        })
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'User',
                accessorKey: 'name',
                cell: (props) => {
                    const user = props.row.original
                    const deactivated = isUserDeactivated(user)

                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                shape="circle"
                                size={40}
                                src={user.profile.url}
                            />
                            <div>
                                <div
                                    className={`font-semibold ${
                                        deactivated
                                            ? 'text-gray-400 line-through dark:text-gray-500'
                                            : 'text-gray-900 dark:text-gray-100'
                                    }`}
                                >
                                    {user.name || 'Anonymous User'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user.email || user.phone || '—'}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Contact Phone',
                id: 'phone',
                cell: (props) =>
                    props.row.original.phone || (
                        <span className="text-gray-400">—</span>
                    ),
            },
            {
                header: 'Gender',
                id: 'gender',
                cell: (props) => (
                    <span className="capitalize">
                        {props.row.original.gender || '—'}
                    </span>
                ),
            },
            {
                header: 'Verified',
                id: 'isVerified',
                cell: (props) => (
                    <UserVerifiedBadge
                        isVerified={props.row.original.isVerified}
                    />
                ),
            },
            {
                header: 'Orders',
                id: 'ordersCount',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.ordersCount || 0}
                    </span>
                ),
            },
            {
                header: 'Reservations',
                id: 'reservationsCount',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.reservationsCount || 0}
                    </span>
                ),
            },
            {
                header: 'Joined',
                id: 'created_at', // ✅ Aligned straight to your TypeORM snake_case entity column metadata
                cell: (props) =>
                    dayjs(props.row.original.createdAt).format('DD/MM/YYYY'),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const user = props.row.original
                    const userId = getUserId(user)
                    const isBusy =
                        (isSoftDeleting &&
                            getUserId(deactivateTarget) === userId) ||
                        (isReactivating &&
                            getUserId(reactivateTarget) === userId)

                    return (
                        <div className="flex items-center gap-2">
                            <ActionColumn onView={() => setViewingUser(user)} />
                            {/* ✅ Exactly one lifecycle action per row. Both
                                endpoints 400 on a third state — `status=inactive`
                                with a NULL deletedAt — which is why the trash is
                                gated on isUserActive, not just !deletedAt. */}
                            {isSuperAdmin && isUserActive(user) && (
                                <Tooltip title="Deactivate">
                                    <div
                                        className={`text-xl cursor-pointer ${isBusy ? 'opacity-50 pointer-events-none' : 'text-red-500 hover:text-red-700 dark:text-red-400'}`}
                                        onClick={() =>
                                            setDeactivateTarget(user)
                                        }
                                    >
                                        <TbTrash />
                                    </div>
                                </Tooltip>
                            )}
                            {isSuperAdmin && isUserDeactivated(user) && (
                                <Tooltip title="Reactivate">
                                    <div
                                        className={`text-xl cursor-pointer ${isBusy ? 'opacity-50 pointer-events-none' : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'}`}
                                        onClick={() =>
                                            setReactivateTarget(user)
                                        }
                                    >
                                        <TbRestore />
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                    )
                },
            },
        ],
        [
            isSuperAdmin,
            isSoftDeleting,
            isReactivating,
            deactivateTarget,
            reactivateTarget,
        ],
    )

    const handlePaginationChange = (page: number) =>
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    const handleSelectChange = (size: number) =>
        setTableData((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }))
    const handleSort = (sort: any) =>
        setTableData((prev) => ({ ...prev, sort, pageIndex: 1 }))

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={{
                    total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />

            <UserViewModal
                user={viewingUser}
                onClose={() => setViewingUser(null)}
            />

            <ConfirmDialog
                isOpen={Boolean(deactivateTarget)}
                type="danger"
                title="Deactivate user account?"
                cancelText="Cancel"
                confirmText={isSoftDeleting ? 'Deactivating...' : 'Deactivate'}
                confirmButtonProps={{
                    loading: isSoftDeleting,
                    disabled: isSoftDeleting,
                }}
                cancelButtonProps={{ disabled: isSoftDeleting }}
                onClose={() => !isSoftDeleting && setDeactivateTarget(null)}
                onRequestClose={() =>
                    !isSoftDeleting && setDeactivateTarget(null)
                }
                onCancel={() => setDeactivateTarget(null)}
                onConfirm={handleConfirmDeactivate}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        You are about to deactivate{' '}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {deactivateTarget?.name || 'this user'}
                        </strong>
                        {deactivateTarget?.email
                            ? ` (${deactivateTarget.email})`
                            : ''}
                        .
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>
                            The user will be unable to request an OTP or log in.
                        </li>
                        <li>
                            Orders, reservations, ratings and the profile avatar
                            are all kept.
                        </li>
                        <li>You can reactivate the account at any time.</li>
                        <li>
                            Existing tokens are <strong>not</strong> revoked — a
                            deactivated account keeps API access for the
                            remaining lifetime of any token it already holds.
                        </li>
                    </ul>
                </div>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={Boolean(reactivateTarget)}
                type="success"
                title="Reactivate user account?"
                cancelText="Cancel"
                confirmText={isReactivating ? 'Reactivating...' : 'Reactivate'}
                confirmButtonProps={{
                    loading: isReactivating,
                    disabled: isReactivating,
                }}
                cancelButtonProps={{ disabled: isReactivating }}
                onClose={() => !isReactivating && setReactivateTarget(null)}
                onRequestClose={() =>
                    !isReactivating && setReactivateTarget(null)
                }
                onCancel={() => setReactivateTarget(null)}
                onConfirm={handleConfirmReactivate}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        Restore{' '}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {reactivateTarget?.name || 'this user'}
                        </strong>
                        {reactivateTarget?.email
                            ? ` (${reactivateTarget.email})`
                            : ''}
                        ?
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>The user can request an OTP and log in again.</li>
                        <li>
                            Orders, reservations and ratings are preserved — the
                            account is restored, never recreated.
                        </li>
                        <li>
                            Only soft-deleted accounts can be restored here.
                        </li>
                    </ul>
                </div>
            </ConfirmDialog>
        </>
    )
}

export default UserListTable

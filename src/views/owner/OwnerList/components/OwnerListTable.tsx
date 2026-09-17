import { useMemo, useState } from 'react'
import { useOwnerStore } from '@/store/ownerStore'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Tooltip from '@/components/ui/Tooltip'
import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import OwnerViewModal from './OwnerViewModal'
import OwnerEditModal from './OwnerEditModal'
import {
    useSoftDeleteOwner,
    useReactivateOwner,
} from '@/utils/custom-hooks/useOwner'
import dayjs from 'dayjs'
import {
    TbEye,
    TbEdit,
    TbTrash,
    TbRestore,
    TbLockOff,
    TbLockOpen,
} from 'react-icons/tb'

interface OwnerListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const isOwnerDeleted = (owner: any): boolean => {
    if (!owner) return false
    // Backend may return deletedAt / deleted_at / deleted_at column variant
    return Boolean(owner.deletedAt ?? owner.deleted_at ?? owner.deletedAtTimestamp)
}

const getDeleteErrorMessage = (error: any): string => {
    const data: any = error?.response?.data
    if (data?.message) return data.message
    if (typeof data === 'string') return data
    if (error?.message) return error.message
    return 'Could not deactivate the owner. Please try again.'
}

const getReactivateErrorMessage = (error: any): string => {
    const data: any = error?.response?.data
    if (data?.message) return data.message
    if (typeof data === 'string') return data
    if (error?.message) return error.message
    return 'Could not reactivate the owner. Please try again.'
}

const OwnerListTable = ({ data, total, loading }: OwnerListTableProps) => {
    const [viewingOwner, setViewingOwner] = useState<any | null>(null)
    const [editingOwner, setEditingOwner] = useState<any | null>(null)
    const [softDeleteTarget, setSoftDeleteTarget] = useState<any | null>(null)
    const [reactivateTarget, setReactivateTarget] = useState<any | null>(null)

    const tableData = useOwnerStore((state) => state.tableData)
    const setTableData = useOwnerStore((state) => state.setTableData)

    const { mutate: softDeleteOwner, isPending: isSoftDeleting } =
        useSoftDeleteOwner()
    const { mutate: reactivateOwner, isPending: isReactivating } =
        useReactivateOwner()

    const handleConfirmSoftDelete = () => {
        if (!softDeleteTarget) return
        softDeleteOwner(softDeleteTarget.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Owner deactivated">
                        Owner account soft deleted successfully. The owner and
                        their staff can no longer log in.
                    </Notification>,
                )
                setSoftDeleteTarget(null)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Deactivation failed">
                        {getDeleteErrorMessage(error)}
                    </Notification>,
                )
            },
        })
    }

    const handleConfirmReactivate = () => {
        if (!reactivateTarget) return
        reactivateOwner(reactivateTarget.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Owner reactivated">
                        Owner account reactivated successfully. Login has been
                        restored.
                    </Notification>,
                )
                setReactivateTarget(null)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Reactivation failed">
                        {getReactivateErrorMessage(error)}
                    </Notification>,
                )
            },
        })
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                size: 220,
                minSize: 180,
                cell: (props) => {
                    const deleted = isOwnerDeleted(props.row.original)
                    return (
                        <span
                            className={`whitespace-nowrap font-semibold ${deleted ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                        >
                            {props.row.original.name}
                        </span>
                    )
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => {
                    const deleted = isOwnerDeleted(props.row.original)
                    return (
                        <span
                            className={`font-medium ${deleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}
                        >
                            {props.row.original.email}
                        </span>
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
                header: 'Owner Code',
                id: 'code',
                cell: (props) => (
                    <span className="font-mono text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900/40">
                        {props.row.original.code || '—'}
                    </span>
                ),
            },
            {
                header: 'Restaurants',
                id: 'restaurantsCount',
                size: 110,
                cell: (props) => (
                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                        {props.row.original.restaurants?.length || 0}
                    </span>
                ),
            },
            {
                header: 'Status',
                id: 'status',
                size: 130,
                cell: (props) => {
                    const deleted = isOwnerDeleted(props.row.original)
                    const deletedAt =
                        props.row.original.deletedAt ??
                        props.row.original.deleted_at
                    if (deleted) {
                        return (
                            <Tooltip
                                title={
                                    deletedAt
                                        ? `Deactivated on ${dayjs(deletedAt).format('DD MMM YYYY HH:mm')}`
                                        : 'Deactivated'
                                }
                            >
                                <Tag className="bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/30 gap-1">
                                    <TbLockOff className="text-sm" />
                                    Deactivated
                                </Tag>
                            </Tooltip>
                        )
                    }
                    return (
                        <Tag className="bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30 gap-1">
                            <TbLockOpen className="text-sm" />
                            Active
                        </Tag>
                    )
                },
            },
            {
                header: 'Joined',
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {dayjs(props.row.original.created_at).format(
                            'DD/MM/YYYY',
                        )}
                    </span>
                ),
            },
            {
                header: '',
                id: 'action',
                size: 110,
                cell: (props) => {
                    const owner = props.row.original
                    const deleted = isOwnerDeleted(owner)
                    const isBusy =
                        (isSoftDeleting && softDeleteTarget?.id === owner.id) ||
                        (isReactivating && reactivateTarget?.id === owner.id)

                    return (
                        <div className="flex items-center gap-2">
                            <Tooltip title="View">
                                <div
                                    className="text-xl cursor-pointer text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                                    onClick={() => setViewingOwner(owner)}
                                >
                                    <TbEye />
                                </div>
                            </Tooltip>

                            {!deleted && (
                                <Tooltip title="Edit">
                                    <div
                                        className="text-xl cursor-pointer text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        onClick={() => setEditingOwner(owner)}
                                    >
                                        <TbEdit />
                                    </div>
                                </Tooltip>
                            )}

                            {!deleted ? (
                                <Tooltip title="Deactivate">
                                    <div
                                        className={`text-xl cursor-pointer ${isBusy ? 'opacity-50 pointer-events-none' : 'text-red-500 hover:text-red-700 dark:text-red-400'}`}
                                        onClick={() => setSoftDeleteTarget(owner)}
                                    >
                                        <TbTrash />
                                    </div>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Reactivate">
                                    <div
                                        className={`text-xl cursor-pointer ${isBusy ? 'opacity-50 pointer-events-none' : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'}`}
                                        onClick={() => setReactivateTarget(owner)}
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
        [isSoftDeleting, isReactivating, softDeleteTarget, reactivateTarget],
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
            <OwnerViewModal
                owner={viewingOwner}
                onClose={() => setViewingOwner(null)}
            />
            <OwnerEditModal
                owner={editingOwner}
                onClose={() => setEditingOwner(null)}
            />

            <ConfirmDialog
                isOpen={Boolean(softDeleteTarget)}
                type="danger"
                title="Deactivate owner account?"
                onClose={() => !isSoftDeleting && setSoftDeleteTarget(null)}
                onRequestClose={() => !isSoftDeleting && setSoftDeleteTarget(null)}
                onCancel={() => setSoftDeleteTarget(null)}
                onConfirm={handleConfirmSoftDelete}
                cancelText="Cancel"
                confirmText={isSoftDeleting ? 'Deactivating...' : 'Deactivate'}
                confirmButtonProps={{
                    loading: isSoftDeleting,
                    disabled: isSoftDeleting,
                }}
                cancelButtonProps={{ disabled: isSoftDeleting }}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        You are about to soft-deactivate{' '}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {softDeleteTarget?.name}
                        </strong>{' '}
                        ({softDeleteTarget?.email}).
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>Owner and their staff will be unable to log in.</li>
                        <li>Restaurants owned by this account will be hidden from the mobile listing.</li>
                        <li>You can reactivate the account at any time.</li>
                    </ul>
                </div>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={Boolean(reactivateTarget)}
                type="success"
                title="Reactivate owner account?"
                onClose={() => !isReactivating && setReactivateTarget(null)}
                onRequestClose={() => !isReactivating && setReactivateTarget(null)}
                onCancel={() => setReactivateTarget(null)}
                onConfirm={handleConfirmReactivate}
                cancelText="Cancel"
                confirmText={isReactivating ? 'Reactivating...' : 'Reactivate'}
                confirmButtonProps={{
                    loading: isReactivating,
                    disabled: isReactivating,
                }}
                cancelButtonProps={{ disabled: isReactivating }}
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        Restore access for{' '}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {reactivateTarget?.name}
                        </strong>{' '}
                        ({reactivateTarget?.email})?
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <li>Owner and staff will be able to log in again.</li>
                        <li>Restaurants will reappear on the mobile listing.</li>
                    </ul>
                </div>
            </ConfirmDialog>
        </>
    )
}

export default OwnerListTable

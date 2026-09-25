import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppSettingStore } from '@/store/appSettingStore'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Tag from '@/components/ui/Tag'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { ActionLink } from '@/components/shared'
import ActionColumn from '@/views/banners/components/ActionColumn'
import dayjs from 'dayjs'
import {
    useDeleteAppSettingMutation,
    useUpdateAppSettingStatus,
} from '@/utils/custom-hooks/useAppSetting'
import { stripHtmlTags } from '@/utils/helpers/blogContent.helper'
import AppSettingViewModal from './AppSettingViewModal'
import type { AppSetting } from '@/@types/appSetting'

const typeTagColor: Record<AppSetting['type'], string> = {
    TEXT: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/30',
    PHONE: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30',
    HTML: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/30',
}

interface AppSettingListTableProps {
    data: AppSetting[]
    total: number
    loading: boolean
}

const AppSettingListTable = ({
    data,
    total,
    loading,
}: AppSettingListTableProps) => {
    const navigate = useNavigate()
    const [deleteTarget, setDeleteTarget] = useState<AppSetting | null>(null)
    const [viewingSetting, setViewingSetting] = useState<AppSetting | null>(
        null,
    )
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(
        null,
    )

    const tableData = useAppSettingStore((state) => state.tableData)
    const setTableData = useAppSettingStore((state) => state.setTableData)

    const { mutate: deleteAppSetting } = useDeleteAppSettingMutation()
    const { mutate: updateStatus } = useUpdateAppSettingStatus()

    const handleDelete = () => {
        if (deleteTarget) {
            deleteAppSetting(deleteTarget.id)
        }
        setDeleteTarget(null)
    }

    const handleStatusToggle = (setting: AppSetting, nextStatus: boolean) => {
        setUpdatingStatusId(setting.id)
        updateStatus(
            { id: setting.id, isActive: nextStatus },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Status updated">
                            {setting.key} is now{' '}
                            {nextStatus ? 'active' : 'inactive'}. The change is
                            reflected in the mobile app immediately.
                        </Notification>,
                    )
                },
                onError: () => {
                    toast.push(
                        <Notification
                            type="danger"
                            title="Status update failed"
                        >
                            Could not update the setting status. Please try
                            again.
                        </Notification>,
                    )
                },
                onSettled: () => setUpdatingStatusId(null),
            },
        )
    }

    const columns: ColumnDef<AppSetting>[] = useMemo(
        () => [
            {
                header: 'Key',
                accessorKey: 'key',
                cell: (props) => (
                    <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {props.row.original.key}
                    </span>
                ),
            },
            {
                header: 'Value',
                accessorKey: 'value',
                cell: (props) => {
                    const setting = props.row.original
                    const raw = setting.value || ''
                    if (setting.type === 'PHONE' && raw) {
                        return (
                            <ActionLink
                                href={`tel:${raw}`}
                                className="block max-w-[280px] truncate"
                            >
                                {raw}
                            </ActionLink>
                        )
                    }
                    const preview = stripHtmlTags(raw) || '(empty value)'
                    return (
                        <span className="block max-w-[280px] truncate text-gray-600 dark:text-gray-400">
                            {preview}
                        </span>
                    )
                },
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <Tag className={typeTagColor[props.row.original.type]}>
                        {props.row.original.type}
                    </Tag>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const setting = props.row.original
                    return (
                        <Switcher
                            checked={setting.isActive}
                            checkedContent={
                                <span className="inline-block w-16 text-xs font-semibold">
                                    Active
                                </span>
                            }
                            unCheckedContent={
                                <span className="inline-block w-16 text-xs font-semibold">
                                    Inactive
                                </span>
                            }
                            isLoading={updatingStatusId === setting.id}
                            onChange={(checked) =>
                                handleStatusToggle(setting, checked)
                            }
                        />
                    )
                },
            },
            {
                header: 'Created',
                accessorKey: 'createdAt',
                cell: (props) =>
                    dayjs(props.row.original.createdAt).format('DD/MM/YYYY'),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() => setViewingSetting(props.row.original)}
                        onEdit={() =>
                            navigate(`/settings/edit/${props.row.original.id}`)
                        }
                        onDelete={() => setDeleteTarget(props.row.original)}
                    />
                ),
            },
        ],
        [updatingStatusId],
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
            <ConfirmDialog
                isOpen={!!deleteTarget}
                type="danger"
                title="Delete Setting"
                onClose={() => setDeleteTarget(null)}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <strong className="font-semibold">
                        {deleteTarget?.key}
                    </strong>
                    ? This will remove the setting from the app immediately and
                    cannot be undone.
                </p>
            </ConfirmDialog>
            <AppSettingViewModal
                setting={viewingSetting}
                onClose={() => setViewingSetting(null)}
            />
        </>
    )
}

export default AppSettingListTable

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppVersionStore } from '@/store/appVersionStore'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ActionLink } from '@/components/shared'
import ActionColumn from '@/views/banners/components/ActionColumn'
import { useDeleteAppVersionMutation } from '@/utils/custom-hooks/useAppVersion'
import dayjs from 'dayjs'
import type { AppVersion } from '@/@types/appVersion'

interface AppVersionListTableProps {
    data: AppVersion[]
    total: number
    loading: boolean
}

const AppVersionListTable = ({
    data,
    total,
    loading,
}: AppVersionListTableProps) => {
    const navigate = useNavigate()
    const [deleteTarget, setDeleteTarget] = useState<AppVersion | null>(null)

    const tableData = useAppVersionStore((state) => state.tableData)
    const setTableData = useAppVersionStore((state) => state.setTableData)

    const { mutate: deleteAppVersion } = useDeleteAppVersionMutation()

    const handleDelete = () => {
        if (deleteTarget) {
            deleteAppVersion(deleteTarget.id)
        }
        setDeleteTarget(null)
    }

    const columns: ColumnDef<AppVersion>[] = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.title}
                    </span>
                ),
            },
            {
                header: 'Body',
                accessorKey: 'body',
                cell: (props) => {
                    const body = props.row.original.body || ''
                    return (
                        <span className="block max-w-[280px] truncate">
                            {body}
                        </span>
                    )
                },
            },
            {
                header: 'Version Code',
                accessorKey: 'versionCode',
                cell: (props) => (
                    <span className="font-mono text-xs">
                        {props.row.original.versionCode}
                    </span>
                ),
            },
            {
                header: 'Version Name',
                accessorKey: 'versionName',
                cell: (props) => (
                    <span className="font-mono text-xs">
                        {props.row.original.versionName}
                    </span>
                ),
            },
            {
                header: 'Play Store',
                accessorKey: 'playStoreLink',
                cell: (props) => (
                    <ActionLink
                        href={props.row.original.playStoreLink}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer hover:underline"
                    >
                        Open
                    </ActionLink>
                ),
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
                        onView={() =>
                            navigate(`/app-versions/${props.row.original.id}`)
                        }
                        onEdit={() =>
                            navigate(
                                `/app-versions/edit/${props.row.original.id}`,
                            )
                        }
                        onDelete={() => setDeleteTarget(props.row.original)}
                    />
                ),
            },
        ],
        [navigate],
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
                title="Delete App Version"
                onClose={() => setDeleteTarget(null)}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to permanently delete this app
                    version? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default AppVersionListTable

import { useMemo, useState } from 'react'
import { useOwnerStore } from '@/store/ownerStore'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ActionColumn from '@/views/order/components/ActionColumn'
import OwnerViewModal from './OwnerViewModal'
import OwnerEditModal from './OwnerEditModal'
import dayjs from 'dayjs'

interface OwnerListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const OwnerListTable = ({ data, total, loading }: OwnerListTableProps) => {
    const [viewingOwner, setViewingOwner] = useState<any | null>(null)
    const [editingOwner, setEditingOwner] = useState<any | null>(null)

    const tableData = useOwnerStore((state) => state.tableData)
    const setTableData = useOwnerStore((state) => state.setTableData)

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                size: 250,
                minSize: 200,
                cell: (props) => (
                    <span className="whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">
                        {props.row.original.name}
                    </span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {props.row.original.email}
                    </span>
                ),
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
                header: 'Restaurants Count',
                id: 'restaurantsCount',
                cell: (props) => (
                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                        {props.row.original.restaurants.length || 0}
                    </span>
                ),
            },
            {
                header: 'Joined',
                accessorKey: 'created_at', // ✅ Map straight to your active TypeORM column property metadata
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
                cell: (props) => (
                    <ActionColumn
                        onView={() => setViewingOwner(props.row.original)}
                        onEdit={() => setEditingOwner(props.row.original)}
                        viewClassName="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        editClassName="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    />
                ),
            },
        ],
        [],
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
        </>
    )
}

export default OwnerListTable

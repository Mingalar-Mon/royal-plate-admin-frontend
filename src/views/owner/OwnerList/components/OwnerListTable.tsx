import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useOwnerStore } from '@/store/ownerStore'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ActionColumn from '@/views/order/components/ActionColumn' // Adjust path if needed
import dayjs from 'dayjs'

interface OwnerListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const OwnerListTable = ({ data, total, loading }: OwnerListTableProps) => {
    const navigate = useNavigate()

    const tableData = useOwnerStore((state) => state.tableData)
    const setTableData = useOwnerStore((state) => state.setTableData)

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => (
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {props.row.original.name}
                    </span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
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
                    <span className="font-mono text-xs bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border dark:border-gray-700">
                        {props.row.original.code || '—'}
                    </span>
                ),
            },
            {
                header: 'Restaurants',
                id: 'restaurantsCount',
                cell: (props) => (
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        {props.row.original.restaurants.length || 0}
                    </span>
                ),
            },
            {
                header: 'Joined',
                accessorKey: 'created_at', // ✅ Map straight to your active TypeORM column property metadata
                cell: (props) =>
                    dayjs(props.row.original.created_at).format('DD/MM/YYYY'),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    console.log('PROPS: ', props)
                    return (
                        <ActionColumn
                            onView={() =>
                                navigate(`/owners/${props.row.original.id}`)
                            }
                            onEdit={() => {
                                console.log('On edit got clicked')
                                navigate(
                                    `/owners/edit-owner/${props.row.original.id}`,
                                )
                            }}
                        />
                    )
                },
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
    )
}

export default OwnerListTable

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { useTableList } from '@/utils/custom-hooks/useTable'
import TableTypeBadge from '../../components/TableTypeBadge'
import TableStatusBadge from '../../components/TableStatusBadge'
import ActionColumn from '@/views/order/components/ActionColumn'
import type { Table, TableQueries } from '../../types/table.type'
import { useTableStore } from '@/store/tableStore'

interface TableListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const TableListTable = ({ data, total, loading }: TableListTableProps) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    const tableData = useTableStore((state) => state.tableData)
    const setTableData = useTableStore((state) => state.setTableData)

    const columns: ColumnDef<Table>[] = useMemo(
        () => [
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <TableTypeBadge type={props.row.original.type} />
                ),
            },
            {
                header: 'Capacity',
                accessorKey: 'capacity',
                cell: (props) => `${props.row.original.capacity} persons`,
            },
            {
                header: 'Duration (min)',
                accessorKey: 'durationMinutes',
                cell: (props) => props.row.original.durationMinutes || '—',
            },
            {
                header: 'Fee (MMK)',
                accessorKey: 'tableFee',
                cell: (props) =>
                    props.row.original.tableFee?.toLocaleString() || '—',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => (
                    <TableStatusBadge status={props.row.original.status} />
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
                            navigate(
                                `/restaurants/${restaurantId}/tables/${props.row.original.id}`,
                            )
                        }
                        onEdit={() =>
                            navigate(
                                `/restaurants/${restaurantId}/tables/edit/${props.row.original.id}`,
                            )
                        }
                    />
                ),
            },
        ],
        [restaurantId, navigate],
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

export default TableListTable

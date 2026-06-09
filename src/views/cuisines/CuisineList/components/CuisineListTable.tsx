import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import dayjs from 'dayjs'

import ActionColumn from '@/views/order/components/ActionColumn'
import CuisineImage from '../components/CuisineImage'
import type { Cuisine } from '@/views/cuisines/types/cuisine.type'
import { useCuisineStore } from '@/store/cuisineStore'

interface CuisineListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const CuisineListTable = ({ data, total, loading }: CuisineListTableProps) => {
    const navigate = useNavigate()

    const tableData = useCuisineStore((state) => state.tableData)
    const setTableData = useCuisineStore((state) => state.setTableData)

    // const tableData =
    // const { cuisines, total, tableData, setTableData, isLoading } =
    //     useCuisineList()

    const columns: ColumnDef<Cuisine>[] = useMemo(
        () => [
            {
                header: 'Image',
                id: 'image',
                cell: (props) => (
                    <CuisineImage
                        src={props.row.original.image}
                        name={props.row.original.name}
                    />
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.name}
                    </span>
                ),
            },
            {
                header: 'Description',
                id: 'description',
                cell: (props) => props.row.original.description || '—',
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (props) =>
                    dayjs(props.row.original.created_at).format('DD/MM/YYYY'),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() =>
                            navigate(`/cuisines/${props.row.original.id}`)
                        }
                        onEdit={() =>
                            navigate(`/cuisines/edit/${props.row.original.id}`)
                        }
                        // onDelete={() => {}}
                    />
                ),
            },
        ],
        [navigate],
    )

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const handleSelectChange = (size: number) => {
        setTableData((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }))
    }

    const handleSort = (sort: any) => {
        setTableData((prev) => ({ ...prev, sort, pageIndex: 1 }))
    }

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

export default CuisineListTable

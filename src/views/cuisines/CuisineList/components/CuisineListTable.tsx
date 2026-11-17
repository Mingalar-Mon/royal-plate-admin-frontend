import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { TbEye, TbEdit, TbTrash, TbRestore } from 'react-icons/tb'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import Tag from '@/components/ui/Tag'
import CuisineImage from '../components/CuisineImage'
import type { Cuisine } from '@/views/cuisines/types/cuisine.type'
import { useCuisineStore } from '@/store/cuisineStore'
import { isCuisineDeleted } from '../hooks/useCuisineListActions'

interface CuisineListTableProps {
    data: Cuisine[]
    total: number
    loading: boolean
    onView: (cuisine: Cuisine) => void
    onEdit: (cuisine: Cuisine) => void
    onDeactivate: (cuisine: Cuisine) => void
    onRestore: (cuisine: Cuisine) => void
    isCuisineBusy: (cuisine: Cuisine | null | undefined) => boolean
}

const CuisineListTable = ({
    data,
    total,
    loading,
    onView,
    onEdit,
    onDeactivate,
    onRestore,
    isCuisineBusy,
}: CuisineListTableProps) => {
    const tableData = useCuisineStore((state) => state.tableData)
    const setTableData = useCuisineStore((state) => state.setTableData)

    const columns: ColumnDef<Cuisine>[] = useMemo(
        () => [
            {
                header: 'Image',
                id: 'image',
                cell: (props) => (
                    <CuisineImage
                        src={props.row.original.image?.url}
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
                cell: (props) => (
                    <span
                        className="line-clamp-2 max-w-xs"
                        title={props.row.original.description || ''}
                    >
                        {props.row.original.description || '—'}
                    </span>
                ),
            },
            {
                header: 'Status',
                id: 'status',
                cell: (props) => {
                    const deleted = isCuisineDeleted(props.row.original)
                    return deleted ? (
                        <Tag className="bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 gap-1">
                            Deactivated
                        </Tag>
                    ) : (
                        <Tag className="bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 gap-1">
                            Active
                        </Tag>
                    )
                },
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
                cell: (props) => {
                    const cuisine = props.row.original
                    const deleted = isCuisineDeleted(cuisine)
                    const isBusy = isCuisineBusy(cuisine)

                    return (
                        <div className="flex items-center justify-start gap-3">
                            <Tooltip title="View">
                                <div
                                    className={`text-xl cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={() => onView(cuisine)}
                                >
                                    <TbEye />
                                </div>
                            </Tooltip>
                            {!deleted && (
                                <Tooltip title="Edit">
                                    <div
                                        className={`text-xl cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
                                        onClick={() => onEdit(cuisine)}
                                    >
                                        <TbEdit />
                                    </div>
                                </Tooltip>
                            )}
                            {!deleted ? (
                                <Tooltip title="Deactivate">
                                    <div
                                        className={`text-xl cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
                                        onClick={() => onDeactivate(cuisine)}
                                    >
                                        <TbTrash />
                                    </div>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Restore">
                                    <div
                                        className={`text-xl cursor-pointer text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
                                        onClick={() => onRestore(cuisine)}
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
        [onView, onEdit, onDeactivate, onRestore, isCuisineBusy],
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

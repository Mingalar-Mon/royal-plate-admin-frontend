import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import DataTable, { OnSortParam } from '@/components/shared/DataTable'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { useDeleteStaff } from '@/utils/custom-hooks/useStaff'
import StaffRoleBadge from './StaffRoleBadge'
import ActionColumn from './ActionColumn'
import type { RestaurantStaff } from '../../types/staff.type'
import { Staff } from '@/services/RestaurantStaffService'
import { useStaffStore } from '@/store/staffStore'

const StaffListTable = ({
    staffList,
    total,
    // tableData,
    // setTableData,
    isLoading,
}: {
    staffList: Staff[]
    total: number
    // tableData: TableQueries
    // setTableData: Dispatch<SetStateAction<TableQueries>>
    isLoading: boolean
}) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { staffList, total, tableData, setTableData, isLoading } =
    //     useStaffList(restaurantId!)

    const tableData = useStaffStore((state) => state.tableData)
    const setTableData = useStaffStore((state) => state.setTableData)

    const { mutate: deleteStaff } = useDeleteStaff()

    const columns: ColumnDef<RestaurantStaff>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => (
                    <div className="font-semibold">
                        {props.row.original.name}
                    </div>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Role',
                id: 'role',
                cell: (props) => (
                    <StaffRoleBadge role={props.row.original.role} />
                ),
            },
            {
                header: 'Joined',
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
                            navigate(
                                `/restaurants/${restaurantId}/staff/detail/${props.row.original.id}`,
                            )
                        }
                        onEdit={() =>
                            navigate(
                                `/restaurants/${restaurantId}/staff/edit/${props.row.original.id}`,
                            )
                        }
                        onDelete={() => deleteStaff(props.row.original.id)}
                    />
                ),
            },
        ],
        [restaurantId, navigate, deleteStaff],
    )

    const handlePaginationChange = (page: number) => {
        // const newData = cloneDeep(tableData)
        // newData.pageIndex = page
        setTableData((prev) => ({
            ...prev,
            pageIndex: page,
        }))
    }

    const handleSelectChange = (size: number) => {
        const newData = cloneDeep(tableData)
        newData.pageSize = size
        newData.pageIndex = 1
        setTableData((prev) => ({
            ...prev,
            pageSize: size,
            pageIndex: 1,
        }))
    }

    const handleSort = (sortModel: OnSortParam) => {
        // const newData = cloneDeep(tableData)
        // newData.sort = sort
        setTableData((prev) => ({
            ...prev,
            sort: sortModel,
        }))
    }

    return (
        <DataTable
            columns={columns}
            data={staffList}
            loading={isLoading}
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

export default StaffListTable

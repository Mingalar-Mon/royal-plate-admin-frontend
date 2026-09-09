import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable, { OnSortParam } from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { useDeleteStaff } from '@/utils/custom-hooks/useStaff'
import StaffRoleBadge from './StaffRoleBadge'
import ActionColumn from './ActionColumn'
import StaffDetailModal from './StaffDetailModal'
import StaffEditModal from './StaffEditModal'
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
    const [viewingStaff, setViewingStaff] = useState<Staff | null>(null)
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null)

    const tableData = useStaffStore((state) => state.tableData)
    const setTableData = useStaffStore((state) => state.setTableData)

    const { mutate: deleteStaff, isPending: isDeleting } = useDeleteStaff()

    const handleDelete = () => {
        if (!staffToDelete) return

        deleteStaff(staffToDelete.id, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success">Staff deleted</Notification>,
                    {
                        placement: 'top-center',
                    },
                )
                setStaffToDelete(null)
            },
            onError: () => {
                toast.push(
                    <Notification type="danger">
                        Failed to delete staff
                    </Notification>,
                )
                setStaffToDelete(null)
            },
        })
    }

    const columns: ColumnDef<Staff>[] = useMemo(
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
                        onView={() => setViewingStaff(props.row.original)}
                        onEdit={() => setEditingStaff(props.row.original)}
                        onDelete={() => setStaffToDelete(props.row.original)}
                        isDeleting={isDeleting}
                    />
                ),
            },
        ],
        [deleteStaff, isDeleting],
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
        <>
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
            <StaffDetailModal
                staff={viewingStaff}
                onClose={() => setViewingStaff(null)}
                onEdit={(staff) => {
                    setViewingStaff(null)
                    setEditingStaff(staff)
                }}
            />
            <StaffEditModal
                staff={editingStaff}
                onClose={() => setEditingStaff(null)}
            />
            <ConfirmDialog
                isOpen={Boolean(staffToDelete)}
                type="danger"
                title="Delete Staff"
                confirmText="Delete"
                confirmButtonProps={{ loading: isDeleting }}
                onClose={() => setStaffToDelete(null)}
                onRequestClose={() => setStaffToDelete(null)}
                onCancel={() => setStaffToDelete(null)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <span className="font-semibold">
                        {staffToDelete?.name}
                    </span>
                    ? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default StaffListTable

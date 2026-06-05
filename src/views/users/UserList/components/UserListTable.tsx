import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useUserTableStore } from '@/store/userStore'
import { ColumnDef } from '@tanstack/react-table'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import ActionColumn from '@/views/order/components/ActionColumn'
import dayjs from 'dayjs'

interface UserListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const UserVerifiedBadge = ({ isVerified }: { isVerified: boolean }) => (
    <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isVerified
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
        }`}
    >
        {isVerified ? 'Verified' : 'Unverified'}
    </span>
)

const UserListTable = ({ data, total, loading }: UserListTableProps) => {
    const navigate = useNavigate()

    // ✅ Tap state variables directly inside the component slot boundaries
    const tableData = useUserTableStore((state) => state.tableData)
    const setTableData = useUserTableStore((state) => state.setTableData)

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'User',
                accessorKey: 'name',
                cell: (props) => (
                    <div className="flex items-center gap-3">
                        <Avatar
                            shape="circle"
                            size={40}
                            src={props.row.original.profile.url}
                        />
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {props.row.original.name || 'Anonymous User'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {props.row.original.email ||
                                    props.row.original.phone ||
                                    '—'}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                header: 'Contact Phone',
                id: 'phone',
                cell: (props) =>
                    props.row.original.phone || (
                        <span className="text-gray-400">—</span>
                    ),
            },
            {
                header: 'Gender',
                id: 'gender',
                cell: (props) => (
                    <span className="capitalize">
                        {props.row.original.gender || '—'}
                    </span>
                ),
            },
            {
                header: 'Verified',
                id: 'isVerified',
                cell: (props) => (
                    <UserVerifiedBadge
                        isVerified={props.row.original.isVerified}
                    />
                ),
            },
            {
                header: 'Orders',
                id: 'ordersCount',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.ordersCount || 0}
                    </span>
                ),
            },
            {
                header: 'Reservations',
                id: 'reservationsCount',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.reservationsCount || 0}
                    </span>
                ),
            },
            {
                header: 'Joined',
                id: 'created_at', // ✅ Aligned straight to your TypeORM snake_case entity column metadata
                cell: (props) =>
                    dayjs(props.row.original.createdAt).format('DD/MM/YYYY'),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() =>
                            navigate(`/users/${props.row.original.id}`)
                        }
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

export default UserListTable

import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useBannerStore } from '@/store/bannerStore'
import { ColumnDef } from '@tanstack/react-table'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import ActionColumn from '../../components/ActionColumn'
import dayjs from 'dayjs'
import { TbPictureInPicture } from 'react-icons/tb'
import BannerTypeBadge from '../../components/BannerTypeBadge'

interface BannerListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const BannerListTable = ({ data, total, loading }: BannerListTableProps) => {
    const navigate = useNavigate()

    const tableData = useBannerStore((state) => state.tableData)
    const setTableData = useBannerStore((state) => state.setTableData)

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Image',
                accessorKey: 'imageUrl',
                enableSorting: false, // Drop default pointer arrows from media cells
                cell: (props) => (
                    <Avatar
                        shape="round"
                        size={50}
                        src={props.row.original.image.url}
                        icon={<TbPictureInPicture />}
                    />
                ),
            },
            {
                header: 'Linked Restaurant ID',
                accessorKey: 'linkToRestaurant',
                cell: (props) => (
                    <span className="font-mono text-xs">
                        {props.row.original.linkToRestaurant}
                    </span>
                ),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <BannerTypeBadge type={props.row.original.type} />
                ),
            },
            {
                header: 'Author',
                accessorKey: 'authorAdmin.name',
                cell: (props) => (
                    <span>
                        {props.row.original.authorAdmin?.name || 'System Admin'}
                    </span>
                ),
            },
            {
                header: 'Created',
                accessorKey: 'created_at', // ✅ Maps directly to your backend Postgres column entity timestamp
                cell: (props) =>
                    dayjs(props.row.original.created_at).format('DD/MM/YYYY'),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() =>
                            navigate(`/banners/${props.row.original.id}`)
                        }
                        onEdit={() =>
                            navigate(`/banners/edit/${props.row.original.id}`)
                        }
                        onDelete={() => {}}
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

export default BannerListTable

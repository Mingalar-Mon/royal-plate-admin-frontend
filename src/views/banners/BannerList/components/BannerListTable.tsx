import { useMemo, useState } from 'react'
import { useBannerStore } from '@/store/bannerStore'
import { ColumnDef } from '@tanstack/react-table'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import ActionColumn from '../../components/ActionColumn'
import dayjs from 'dayjs'
import { TbPictureInPicture } from 'react-icons/tb'
import BannerTypeBadge from '../../components/BannerTypeBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import BannerViewModal from './BannerViewModal'
import BannerEditModal from './BannerEditModal'
import { useDeleteBannerMutation } from '@/utils/custom-hooks/useBanner'

interface BannerListTableProps {
    data: any[]
    total: number
    loading: boolean
}

const BannerListTable = ({ data, total, loading }: BannerListTableProps) => {
    const tableData = useBannerStore((state) => state.tableData)
    const setTableData = useBannerStore((state) => state.setTableData)

    const { mutate: deleteBanner, isPending: isDeleting } =
        useDeleteBannerMutation()
    const [deletingBanner, setDeletingBanner] = useState<any | null>(null)
    const [viewingBanner, setViewingBanner] = useState<any | null>(null)
    const [editingBanner, setEditingBanner] = useState<any | null>(null)

    const handleCloseDeleteDialog = () => {
        if (isDeleting) return
        setDeletingBanner(null)
    }

    const handleDelete = () => {
        if (!deletingBanner) return
        deleteBanner(deletingBanner.id, {
            onSettled: () => setDeletingBanner(null),
        })
    }

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
                header: 'Restaurant',
                accessorKey: 'restaurantProfile.restaurant.name',
                cell: (props) => {
                    const { restaurantProfile, linkToRestaurant } =
                        props.row.original
                    return (
                        <span>
                            {restaurantProfile
                                ? restaurantProfile.restaurant?.name || '—'
                                : linkToRestaurant}
                        </span>
                    )
                },
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
                        onView={() => setViewingBanner(props.row.original)}
                        onEdit={() => setEditingBanner(props.row.original)}
                        onDelete={() => setDeletingBanner(props.row.original)}
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
            <ConfirmDialog
                isOpen={Boolean(deletingBanner)}
                type="danger"
                title="Delete Banner"
                confirmText="Delete"
                onClose={handleCloseDeleteDialog}
                onCancel={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                confirmButtonProps={{ loading: isDeleting }}
                cancelButtonProps={{ disabled: isDeleting }}
            >
                <p>
                    Are you sure you want to permanently delete this{' '}
                    <strong>{deletingBanner?.type}</strong> banner? This
                    action cannot be undone.
                </p>
            </ConfirmDialog>
            <BannerViewModal
                banner={viewingBanner}
                onClose={() => setViewingBanner(null)}
            />
            <BannerEditModal
                banner={editingBanner}
                onClose={() => setEditingBanner(null)}
            />
        </>
    )
}

export default BannerListTable

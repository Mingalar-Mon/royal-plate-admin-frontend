import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import dayjs from 'dayjs'

import { useDeleteBlogMutation } from '@/utils/custom-hooks/useBlog'
import ActionColumn from '@/views/order/components/ActionColumn'
import type { Blog } from '../../types/blog.type'
import { useBlogStore } from '@/store/blogStore'

interface BlogListTableProps {
    data: any[]
    total: number
    loading: boolean
}
const BlogListTable = ({ data, total, loading }: BlogListTableProps) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { blogs, total, tableData, setTableData, isLoading } = useBlogList(
    //     restaurantId!,
    // )
    const tableData = useBlogStore((state) => state.tableData)
    const setTableData = useBlogStore((state) => state.setTableData)
    const { mutate: deleteBlog } = useDeleteBlogMutation()

    const columns: ColumnDef<Blog>[] = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => (
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {props.row.original.title}
                    </div>
                ),
            },
            {
                header: 'Author',
                accessorKey: 'authorOwner',
                enableSorting: false,
                cell: (props) => {
                    const blog = props.row.original
                    if (blog.authorOwner) return blog.authorOwner.name
                    if (blog.authorStaff)
                        return `${blog.authorStaff.name} (${blog.authorStaff.role})`
                    return '—'
                },
            },
            {
                header: 'Linked Dish',
                accessorKey: 'linkedDish',
                cell: (props) => props.row.original.linkedDish?.name || '—',
            },
            {
                header: 'Views',
                accessorKey: 'viewCount',
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
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
                                `/restaurants/${restaurantId}/blogs/${props.row.original.id}`,
                            )
                        }
                        onEdit={() =>
                            navigate(
                                `/restaurants/${restaurantId}/blogs/edit/${props.row.original.id}`,
                            )
                        }
                        onDelete={() =>
                            deleteBlog({
                                blogId: props.row.original.id,
                                restaurantId: props.row.original.restaurant.id,
                            })
                        }
                    />
                ),
            },
        ],
        [restaurantId, navigate, deleteBlog],
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

export default BlogListTable

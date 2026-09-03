import { useState } from 'react'
import { useParams } from 'react-router'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import {
    TbCalendarEvent,
    TbChevronRight,
    TbEdit,
    TbEye,
    TbLink,
    TbPhotoOff,
    TbTrash,
    TbUser,
} from 'react-icons/tb'
import { useBlogStore } from '@/store/blogStore'
import {
    useDeleteBlogMutation,
    useUpdateBlogMutation,
} from '@/utils/custom-hooks/useBlog'
import { useGetDishes } from '@/utils/custom-hooks/useDish'
import type { Blog, BlogFormData } from '../../types/blog.type'
import { linkifyUrlsInHtml } from '@/utils/helpers/blogContent.helper'
import BlogForm from '../../components/BlogForm'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Pagination from '@/components/ui/Pagination'
import { Notification, toast } from '@/components/ui'

interface Props {
    data: Blog[]
    total: number
    loading: boolean
}

const BlogListCards = ({ data, total, loading }: Props) => {
    const { restaurantId } = useParams()
    const tableData = useBlogStore((state) => state.tableData)
    const setTableData = useBlogStore((state) => state.setTableData)
    const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlogMutation()
    const { mutate: updateBlog, isPending: isUpdating } =
        useUpdateBlogMutation()
    const { dishes } = useGetDishes({
        restaurantId: restaurantId || '',
        params: { pageIndex: 1, pageSize: 100, query: '' },
    })
    const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null)
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
    const [viewingBlog, setViewingBlog] = useState<Blog | null>(null)

    const dishesOptions =
        dishes?.map((d: any) => ({
            value: d.id,
            label: d.name,
        })) || []

    const handleDelete = () => {
        if (!deletingBlog || !restaurantId) return

        deleteBlog(
            { blogId: deletingBlog.id, restaurantId },
            {
                onSuccess: () => {
                    setDeletingBlog(null)
                    toast.push(
                        <Notification type="success" title="Success">
                            Blog post deleted successfully
                        </Notification>,
                        { placement: 'top-center' },
                    )
                },
                onError: (error: any) => {
                    toast.push(
                        <Notification type="danger" title="Error">
                            {error?.response?.data?.message ||
                                'Failed to delete blog post'}
                        </Notification>,
                    )
                },
            },
        )
    }

    const handleCloseDeleteDialog = () => {
        if (isDeleting) return
        setDeletingBlog(null)
    }

    const handleUpdateBlog = (formData: BlogFormData) => {
        if (!editingBlog || !restaurantId) return

        const body = new FormData()
        body.append('title', formData.title)
        body.append('content', linkifyUrlsInHtml(formData.content))

        if (formData.linkedDishId)
            body.append('linkedDishId', formData.linkedDishId)

        if (formData.imageUrls && formData.imageUrls.length > 0) {
            formData.imageUrls.forEach((img) => {
                if (img instanceof File) {
                    body.append('blogImages', img)
                } else if (typeof img === 'string') {
                    body.append('existingImageUrls[]', img)
                } else if (img?.url) {
                    body.append('existingImageUrls[]', img.url)
                }
            })
        }

        if (
            (formData as any).deletedImageKeys &&
            (formData as any).deletedImageKeys.length > 0
        ) {
            ;(formData as any).deletedImageKeys.forEach((key: string) => {
                body.append('deletedImageKeys[]', key)
            })
        }

        updateBlog(
            { blogId: editingBlog.id, restaurantId, data: body as any },
            {
                onSuccess: () => {
                    setEditingBlog(null)
                    toast.push(
                        <Notification type="success" title="Success">
                            Blog post updated successfully
                        </Notification>,
                        { placement: 'top-center' },
                    )
                },
                onError: (error: any) => {
                    toast.push(
                        <Notification type="danger" title="Error">
                            {error?.response?.data?.message ||
                                'Failed to update blog post'}
                        </Notification>,
                    )
                },
            },
        )
    }

    if (loading) {
        return <CardSkeleton count={6} />
    }

    if (data.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">
                No posts found.
            </div>
        )
    }

    const editingDefaultValues: Partial<BlogFormData> | undefined =
        editingBlog
            ? {
                  title: editingBlog.title,
                  content: editingBlog.content,
                  imageUrls: editingBlog.image || [],
                  linkedDishId: editingBlog.linkedDish?.id || undefined,
                  deletedImageKeys: [],
              }
            : undefined

    const viewingImages = viewingBlog?.image || []

    return (
        <>
            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.map((blog) => {
                        const coverImage = blog.image?.[0]?.url
                        const author = blog.authorOwner
                            ? blog.authorOwner.name
                            : blog.authorStaff
                              ? `${blog.authorStaff.name} (${blog.authorStaff.role})`
                              : '—'

                        return (
                            <div
                                key={blog.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <button
                                    type="button"
                                    className="relative block h-40 w-full overflow-hidden bg-gray-100 text-left dark:bg-gray-700"
                                    onClick={() => setViewingBlog(blog)}
                                >
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={blog.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                </button>

                                <div className="flex flex-1 flex-col p-5 pt-4">
                                    <button
                                        type="button"
                                        className="text-left"
                                        onClick={() => setViewingBlog(blog)}
                                    >
                                        <h5 className="line-clamp-2 text-base font-bold text-gray-900 hover:text-primary dark:text-gray-100 dark:hover:text-primary-mild">
                                            {blog.title}
                                        </h5>
                                    </button>

                                    <div className="mt-3 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                                        <p className="truncate">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                Author:
                                            </span>{' '}
                                            {author}
                                        </p>
                                        {blog.linkedDish && (
                                            <p className="truncate">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Linked dish:
                                                </span>{' '}
                                                {blog.linkedDish.name}
                                            </p>
                                        )}
                                    </div>

                                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        {blog.content}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <TbEye className="text-base" />
                                            {blog.viewCount}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <TbCalendarEvent className="text-base" />
                                            {dayjs(blog.createdAt).format('DD/MM/YYYY')}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="plain"
                                                icon={<TbEdit />}
                                                onClick={() => setEditingBlog(blog)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="plain"
                                                className="text-red-500 hover:text-red-600"
                                                icon={<TbTrash />}
                                                onClick={() => setDeletingBlog(blog)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="plain"
                                            icon={<TbChevronRight />}
                                            onClick={() => setViewingBlog(blog)}
                                        >
                                            View details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-end">
                    <Pagination
                        pageSize={tableData.pageSize}
                        currentPage={tableData.pageIndex}
                        total={total}
                        onChange={(page) =>
                            setTableData((prev) => ({
                                ...prev,
                                pageIndex: page,
                            }))
                        }
                    />
                </div>
            </div>

            <Dialog
                isOpen={Boolean(editingBlog)}
                onClose={() => setEditingBlog(null)}
                onRequestClose={() => setEditingBlog(null)}
                width={900}
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Edit Post"
            >
                {editingBlog && (
                    <BlogForm
                        key={editingBlog.id}
                        isNew={false}
                        defaultValues={editingDefaultValues}
                        availableDishes={dishesOptions}
                        availableAuthors={[]}
                        onFormSubmit={handleUpdateBlog}
                    >
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={() => setEditingBlog(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isUpdating}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </BlogForm>
                )}
            </Dialog>

            <Dialog
                isOpen={Boolean(viewingBlog)}
                onClose={() => setViewingBlog(null)}
                onRequestClose={() => setViewingBlog(null)}
                width={720}
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Blog Details"
            >
                {viewingBlog && (
                    <div className="p-6">
                        {viewingImages.length > 0 ? (
                            <div className="space-y-3">
                                <div className="overflow-hidden rounded-xl">
                                    <img
                                        src={viewingImages[0].url}
                                        alt={viewingBlog.title}
                                        className="h-56 w-full object-cover"
                                    />
                                </div>
                                {viewingImages.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {viewingImages.map((img, i) => (
                                            <img
                                                key={img.key || i}
                                                src={img.url}
                                                alt=""
                                                className="h-20 w-28 flex-shrink-0 rounded-lg object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                            </div>
                        )}

                        <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-gray-100">
                            {viewingBlog.title}
                        </h3>

                        <div className="mt-4 space-y-2 border-b border-gray-100 text-sm dark:border-gray-700">
                            <div className="flex justify-between gap-3 border-b border-gray-100 py-3 dark:border-gray-700">
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <TbUser /> Author
                                </span>
                                <span className="font-medium">
                                    {viewingBlog.authorOwner
                                        ? viewingBlog.authorOwner.name
                                        : viewingBlog.authorStaff
                                          ? `${viewingBlog.authorStaff.name} (${viewingBlog.authorStaff.role})`
                                          : '—'}
                                </span>
                            </div>
                            {viewingBlog.linkedDish && (
                                <div className="flex justify-between gap-3 border-b border-gray-100 py-3 dark:border-gray-700">
                                    <span className="flex items-center gap-1.5 text-gray-500">
                                        <TbLink /> Linked dish
                                    </span>
                                    <span className="font-medium">
                                        {viewingBlog.linkedDish.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between gap-3 border-b border-gray-100 py-3 dark:border-gray-700">
                                <span className="text-gray-500">Views</span>
                                <span className="font-medium">
                                    {viewingBlog.viewCount}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3 py-3">
                                <span className="text-gray-500">Created</span>
                                <span className="font-medium">
                                    {dayjs(viewingBlog.createdAt).format(
                                        'DD MMM YYYY, HH:mm',
                                    )}
                                </span>
                            </div>
                        </div>

                        {viewingBlog.content && (
                            <article
                                className="prose prose-md sm:prose-lg dark:prose-invert max-w-none mt-5 text-gray-700 leading-relaxed dark:text-gray-300"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        viewingBlog.content,
                                    ),
                                }}
                            />
                        )}
                    </div>
                )}
            </Dialog>

            <ConfirmDialog
                isOpen={Boolean(deletingBlog)}
                type="danger"
                title="Delete Blog Post"
                onClose={handleCloseDeleteDialog}
                onCancel={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                confirmButtonProps={{ loading: isDeleting }}
                cancelButtonProps={{ disabled: isDeleting }}
            >
                <p>
                    Are you sure you want to permanently delete{' '}
                    <strong>"{deletingBlog?.title}"</strong>? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default BlogListCards
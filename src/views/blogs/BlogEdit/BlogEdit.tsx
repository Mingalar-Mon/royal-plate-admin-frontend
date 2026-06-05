import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    // useBlog,
    // useUpdateBlog,
    // useDeleteBlog,
    useGetBlogDetailQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} from '@/utils/custom-hooks/useBlog' // Your unified hooks path
import { useGetDishes } from '@/utils/custom-hooks/useDish'
import { useStaffStore } from '@/store/staffStore' // Adjust paths to match your systems
import { useRestaurantStore } from '@/store/restaurantStore'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import BlogForm from '../components/BlogForm'
import type { BlogFormData } from '../types/blog.type'
import { useSessionUser } from '@/store/authStore'
import { OWNER, STAFF } from '@/constants/roles.constant'

const BlogEdit = () => {
    const { restaurantId, blogId } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    // const restaurantId = useRestaurantStore(
    //     (state) => state.activeRestaurant?.id,
    // )

    // 1. Fetch real details and operational mutations directly from your hooks

    console.log('restaurantId: ', restaurantId, 'blogId: ', blogId)
    const { data: blogResponse, isLoading: isLoadingBlog } =
        useGetBlogDetailQuery(blogId!, restaurantId!)
    const { mutate: updateBlog, isPending: isUpdating } =
        useUpdateBlogMutation()
    const { mutate: deleteBlog } = useDeleteBlogMutation()
    const session = useSessionUser((state) => state.user)

    // 2. Hydrate dropdown menus dynamically with production records instead of mock arrays
    const { dishes } = useGetDishes({
        restaurantId: restaurantId || '',
        params: { pageIndex: 1, pageSize: 100, query: '' },
    })

    // Assuming your system fetches staff lists for options. Fallback to owner if required.
    const dishesOptions =
        dishes?.map((d: any) => ({
            value: d.id,
            label: d.name,
        })) || []

    if (isLoadingBlog) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    const blog = blogResponse?.data // Unpack your TypeORM backend response wrapper safely
    if (!blog) return <div className="p-8 text-center">Blog post not found</div>

    console.log('Blog: ', blog.linkedDish.id)
    // 3. Map complex relational data models directly to form schema primitives
    const defaultValues: Partial<BlogFormData> = {
        title: blog.title,
        content: blog.content,
        imageUrls: blog.image || [],
        // authorType: blog.authorOwner ? 'owner' : 'staff',

        linkedDishId: blog.linkedDish?.id || undefined,
        deletedImageKeys: [],
    }

    const handleSubmit = (formData: BlogFormData) => {
        console.log('Handle submit fn got fired')
        // Build multipart FormData since your service pipes binary array streams if required
        const body = new FormData()
        body.append('title', formData.title)
        body.append('content', formData.content)

        body.append('restaurantId', restaurantId!)
        body.append('authorId', session.userId as string)
        body.append(
            'authorType',
            (session.authority as string[]).includes(OWNER) ? OWNER : STAFF,
        )

        if (formData.linkedDishId)
            body.append('linkedDishId', formData.linkedDishId)

        // 1. Process image URLs or binary file lists cleanly
        if (formData.imageUrls && formData.imageUrls.length > 0) {
            formData.imageUrls.forEach((img) => {
                if (img instanceof File) {
                    // New additions are sent as raw files to Multer fields
                    body.append('blogImages', img)
                } else if (typeof img === 'string') {
                    body.append('existingImageUrls[]', img)
                } else if (img?.url) {
                    body.append('existingImageUrls[]', img.url)
                }
            })
        }

        // 2. Append keys for items removed in the image UI grid slot
        if (
            (formData as any).deletedImageKeys &&
            (formData as any).deletedImageKeys.length > 0
        ) {
            ;(formData as any).deletedImageKeys.forEach((key: string) => {
                body.append('deletedImageKeys[]', key)
            })
        }

        console.log('Submitting blog with body:', body)

        // Append text-based image arrays cleanly into the request body object structures
        // body.append('imageUrls', JSON.stringify(formData.imageUrls))

        updateBlog(
            { blogId: blogId!, restaurantId: restaurantId!, data: body as any },
            {
                onSuccess: () => {
                    navigate(`/restaurants/${restaurantId}/blogs`)
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

    const handleDelete = () => {
        deleteBlog(
            { blogId: blogId!, restaurantId: restaurantId! },
            {
                onSuccess: () => {
                    navigate(`/restaurants/${restaurantId}/blogs`)
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
        setDeleteConfirmationOpen(false)
    }

    return (
        <AdaptiveCard>
            <BlogForm
                defaultValues={defaultValues}
                isNew={false}
                availableDishes={dishesOptions}
                // Pass staff arrays down dynamically once your personnel list endpoints are added
                availableAuthors={[]}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/blogs`)
                        }
                    >
                        Back to Blogs
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleteConfirmationOpen(true)}
                        >
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isUpdating} // Uses your mutation tracking status natively
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </BlogForm>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Blog Post"
                onClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete the blog post{' '}
                    <strong>{blog.title}</strong>? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </AdaptiveCard>
    )
}

export default BlogEdit

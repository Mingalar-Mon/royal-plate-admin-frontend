import { useNavigate, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import BlogForm from '../components/BlogForm'

import {
    // useCreateBlog,
    useCreateBlogMutation,
} from '@/utils/custom-hooks/useBlog'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useGetDishes } from '@/utils/custom-hooks/useDish'
import { BlogFormData } from '../types/blog.type'
// import { useSessionUser } from '@/store/authStore'

const BlogCreate = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()

    // 1. Consume production React Query mutations hooks directly
    const { mutate: createBlog, isPending } = useCreateBlogMutation()

    // const session = useSessionUser((state) => state.user)

    // 2. Fetch real data instead of passing mock collections arrays
    const { dishes } = useGetDishes({
        restaurantId: restaurantId!,
        params: { pageIndex: 1, pageSize: 100, query: '' },
    })
    const dishesOptions =
        dishes?.map((d: any) => ({
            value: d.id,
            label: d.name,
        })) || []

    const handleSubmit = (data: BlogFormData) => {
        console.log('Handle submit fn got fired.')
        const body = new FormData()
        body.append('title', data.title)
        body.append('content', data.content)
        // body.append('restaurantId', restaurantId!)

        // body.append('authorId', session.userId as string)
        // body.append(
        //     'authorType',
        //     (session.authority as string[]).includes(OWNER) ? OWNER : STAFF,
        // )

        if (data.linkedDishId) body.append('linkedDishId', data.linkedDishId)

        // Append raw binary assets for multiple uploads via your images sections
        // if (data.imageUrls && data.imageUrls.length > 0) {
        //     data.imageUrls.forEach((file: File) =>
        //         body.append('blogImages', file),
        //     )
        // }

        // 1. Process image URLs or binary file lists cleanly
        if (data.imageUrls && data.imageUrls.length > 0) {
            data.imageUrls.forEach((img) => {
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
            (data as any).deletedImageKeys &&
            (data as any).deletedImageKeys.length > 0
        ) {
            ;(data as any).deletedImageKeys.forEach((key: string) => {
                body.append('deletedImageKeys[]', key)
            })
        }

        console.log('Submitting blog with body:', body)

        createBlog(
            { restaurantId: restaurantId!, formData: body },
            {
                onSuccess: () => navigate(`/restaurants/${restaurantId}/blogs`),
            },
        )
    }

    return (
        <AdaptiveCard>
            <BlogForm
                isNew={true}
                availableDishes={dishesOptions}
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
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isPending} // Direct usage of mutation pending states
                    >
                        Publish Post
                    </Button>
                </div>
            </BlogForm>
        </AdaptiveCard>
    )
}

export default BlogCreate

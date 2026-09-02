import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import BlogListActionTools from './components/BlogListActionTools'
import BlogListTableTools from './components/BlogListTableTools'
import BlogListCards from './components/BlogListCards'
import { useBlogStore } from '@/store/blogStore'
import { useGetBlogListQuery } from '@/utils/custom-hooks/useBlog'
import { useParams } from 'react-router'

const BlogList = () => {
    const { restaurantId } = useParams()

    const tableData = useBlogStore((state) => state.tableData)

    const { data, isLoading, refetch } = useGetBlogListQuery(
        restaurantId!,
        tableData,
    )

    const blogsList = data?.data || []
    const blogsTotal = data?.paginator?.totalItems || 0
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3 className='text-primary'>Blog Posts</h3>
                        <BlogListActionTools onRefresh={refetch} />
                    </div>
                    <BlogListTableTools />
                    <BlogListCards
                        data={blogsList}
                        total={blogsTotal}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default BlogList

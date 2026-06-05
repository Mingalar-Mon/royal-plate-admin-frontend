import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import { CSVLink } from 'react-csv'
import { useBlogList } from '@/utils/custom-hooks/useBlog'

const BlogListActionTools = ({ data }: { data: any[] }) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { blogs } = useBlogList(restaurantId!)

    return (
        <div className="flex gap-3">
            <CSVLink filename="blogs.csv" data={data}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() =>
                    navigate(`/restaurants/${restaurantId}/blogs/create`)
                }
            >
                New Post
            </Button>
        </div>
    )
}

export default BlogListActionTools

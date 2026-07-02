import Button from '@/components/ui/Button'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'

const BlogListActionTools = ({ onRefresh }: { onRefresh: () => void }) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { blogs } = useBlogList(restaurantId!)

    return (
        <div className="flex gap-3">
            {/* <CSVLink filename="blogs.csv" data={data}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() =>
                    navigate(`/restaurants/${restaurantId}/blogs/create`)
                }
            >
                New Post
            </Button>
            <Button icon={<TbRefresh />} onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    )
}

export default BlogListActionTools

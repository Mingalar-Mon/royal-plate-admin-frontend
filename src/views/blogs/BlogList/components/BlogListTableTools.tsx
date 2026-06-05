import BlogListSearch from './BlogListSearch'
import { useBlogList } from '@/utils/custom-hooks/useBlog'
import { useParams } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { useBlogStore } from '@/store/blogStore'

const BlogListTableTools = () => {
    const { restaurantId } = useParams()
    // const { tableData, setTableData } = useBlogList(restaurantId!)
    const setTableData = useBlogStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        // const newData = cloneDeep(tableData)
        // newData.query = val
        // newData.pageIndex = 1
        setTableData((prev) => ({ ...prev, query: val, pageIndex: 1 }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <BlogListSearch onSearch={handleSearch} />
        </div>
    )
}

export default BlogListTableTools

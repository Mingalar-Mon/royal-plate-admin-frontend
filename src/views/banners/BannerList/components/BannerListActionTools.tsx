import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { CSVLink } from 'react-csv'
import useBannerList from '../hooks/useBanners'

const BannerListActionTools = ({ data }: { data: any[] }) => {
    const navigate = useNavigate()
    // const { banners } = useBannerList()

    return (
        <div className="flex gap-3">
            {/* <CSVLink filename="banners.csv" data={data}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() => navigate('/banners/create')}
            >
                Add Banner
            </Button>
        </div>
    )
}

export default BannerListActionTools

import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { CSVLink } from 'react-csv'

const CuisineListActionTools = ({ onRefresh }: { onRefresh: () => void }) => {
    const navigate = useNavigate()
    // const { cuisines } = useCuisineList()

    return (
        <div className="flex gap-3">
            {/* <CSVLink filename="cuisines.csv" data={cuisines}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() => navigate('/cuisines/create')}
            >
                Add Cuisine
            </Button>
            <Button
                variant="default"
                icon={<TbRefresh className="text-xl" />}
                onClick={onRefresh}
            >
                Refresh
            </Button>
        </div>
    )
}

export default CuisineListActionTools

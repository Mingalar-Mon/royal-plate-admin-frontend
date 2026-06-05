import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { CSVLink } from 'react-csv'
import { useCuisineList } from '@/utils/custom-hooks/useCuisine'

const CuisineListActionTools = () => {
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
        </div>
    )
}

export default CuisineListActionTools

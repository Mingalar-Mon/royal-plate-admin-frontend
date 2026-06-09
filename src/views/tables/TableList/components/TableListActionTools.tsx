import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import { CSVLink } from 'react-csv'
import { useTableList } from '@/utils/custom-hooks/useTable'

const TableListActionTools = ({ data }: { data: any[] }) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { tables } = useTableList(restaurantId!)

    return (
        <div className="flex gap-3">
            {/* <CSVLink filename="tables.csv" data={data}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() =>
                    navigate(`/restaurants/${restaurantId}/tables/create`)
                }
            >
                Add Table
            </Button>
        </div>
    )
}

export default TableListActionTools

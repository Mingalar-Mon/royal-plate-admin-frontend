import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import { CSVLink } from 'react-csv'
import { useDishList } from '@/utils/custom-hooks/useDish'
import { Cuisine } from '@/@types/restaurant'
import { Dish } from '@/@types/dish'

const DishListActionTools = ({ onRefresh }: { onRefresh: () => void }) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { dishList } = useDishList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/*             
            <CSVLink filename="menu-list.csv" data={dishList}>
                <Button icon={<TbCloudDownload className="text-xl" />}>
                    Export
                </Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate(`/dishes/create/${restaurantId}`)}
            >
                Add Dish
            </Button>
            <Button icon={<TbRefresh />} onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    )
}

export default DishListActionTools

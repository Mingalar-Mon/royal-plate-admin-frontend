import Button from '@/components/ui/Button'
import { TbPlus, TbRefresh } from 'react-icons/tb'
// import { useRestaurantStore } from '../../../store/restaurantStore'
// import { apiGetRestaurants } from '../../../services/restaurantServices'
// import { useSWRConfig } from 'swr'
// import { restaurantAPI } from '@/views/owner/api/restaurant'
import { useNavigate } from 'react-router'

const RestaurantHeader = ({
    onRefresh,
    isRefreshing,
}: {
    onRefresh: () => void
    isRefreshing: boolean
}) => {
    // const { mutate } = useSWRConfig()
    // const { openDialog, setRestaurants } = useRestaurantStore()
    const navigate = useNavigate()

    const handleAddRestaurant = () => {
        return navigate(`/restaurant/create-restaurant`)
    }

    /*
    const handleRefresh = async () => {
        // Manually refetch data
        onRefresh()

        
        const data = await apiGetRestaurants()
        console.log('Refreshed restaurants:', data)
        setRestaurants(data)
        mutate('/api/restaurants') // Also update SWR cache
        
    }

*/

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h3 className='text-primary'>Restaurant Dashboard</h3>
                <p className="text-gray-500">
                    Manage all restaurants in one place
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    icon={<TbRefresh />}
                    onClick={onRefresh}
                    loading={isRefreshing}
                >
                    Refresh
                </Button>
                <Button
                    size="sm"
                    variant="solid"
                    icon={<TbPlus />}
                    onClick={handleAddRestaurant}
                >
                    Add Restaurant
                </Button>
            </div>
        </div>
    )
}

export default RestaurantHeader

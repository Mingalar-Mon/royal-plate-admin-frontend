import RestaurantCard from './RestaurnatCard'
import type { Restaurant } from '../../../ScrumBoard/types'
import { useRestaurantStore } from '@/views/owner/store/restaurantStore'
import DialogModal from './DialogModel'

interface RestaurantGridProps {
    restaurants: Restaurant[]
}

const RestaurantGrid = ({ restaurants }: RestaurantGridProps) => {
    if (restaurants.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <p className="text-gray-500">No restaurants found</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Click "Add Restaurant" to get started
                    </p>
                </div>
            </div>
        )
    }
    const { dialogOpen } = useRestaurantStore()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {restaurants.map((restaurant) => {
                return (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                    />
                )
            })}
        </div>
    )
}

export default RestaurantGrid

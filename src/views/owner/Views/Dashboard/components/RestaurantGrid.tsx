import RestaurantCard from './RestaurnatCard'

import { Restaurant } from '@/@types/restaurant'

interface RestaurantGridProps {
    // restaurants: Restaurant[]
    restaurants?: Restaurant[]
}

const RestaurantGrid = ({ restaurants }: RestaurantGridProps) => {
    if (!restaurants || restaurants.length === 0) {
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

    const spacing =
        restaurants.length > 2 ? 'justify-items-center' : 'justify-items-start'

    return (
        // @md:grid-cols-2 @lg:grid-cols-3  @xl:grid-cols-4
        <div className="@container w-full ">
            <div
                className={`grid grid-cols-1 @[40rem]:grid-cols-2 @[60rem]:grid-cols-3 @[85rem]:grid-cols-4 ${spacing} gap-6 mt-4 `}
            >
                {restaurants.map((restaurant) => {
                    return (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default RestaurantGrid

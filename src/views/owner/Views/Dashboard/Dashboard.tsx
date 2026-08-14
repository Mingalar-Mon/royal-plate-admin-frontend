import Skeleton from '@/components/ui/Skeleton'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import RestaurantHeader from './components/RestaurantHeader'
import RestaurantGrid from './components/RestaurantGrid'
// import { useRestaurantStore } from '../../store/restaurantStore'
// import { useRestaurantStore } from '@/store/restaurantStore'

import DialogModal from './components/DialogModel'
import { useGetRestaurants } from '@/utils/custom-hooks/useRestaurant'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useEffect } from 'react'

const RestaurantDashboard = () => {
    // const { restaurants, setRestaurants, setError } = useRestaurantStore()
    // const { openProfileDialog } = useRestaurantStore()

    const {
        data: restaurantsFromAPI,
        isLoading,
        isFetching,

        error,
        refetch,
    } = useGetRestaurants()

    const setActiveRestaurant = useRestaurantStore(
        (state) => state.setActiveRestaurant,
    )

    useEffect(() => {
        setActiveRestaurant(null)
    }, [setActiveRestaurant])

    const showSpinner = isLoading || isFetching

    // console.log('restaurant from api: ', restaurantsFromAPI)
    // const restaurants = restaurantsFromAPI?.data;

    // useEffect(() => {
    //     if (restaurantsFromAPI) {
    //         setRestaurants(restaurantsFromAPI.data)
    //     }
    //     if (error) {
    //         setError(error.message)
    //     }
    // }, [restaurantsFromAPI, setRestaurants, error, setError])

    if (error) {
        console.error('Error loading restaurants:', error)
        return (
            <div className="text-red-500 p-4 text-center">
                Failed to load restaurants: {error.message}
            </div>
        )
    }

    return (
        <AdaptiveCard className="h-full" bodyClass="h-full flex flex-col">
            <RestaurantHeader isRefreshing={isFetching} onRefresh={refetch} />

            {showSpinner ? (
                <div className="grid grid-cols-1 gap-4 py-16 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="rounded border border-gray-200 dark:border-gray-700"
                            width="100%"
                            height={140}
                        />
                    ))}
                </div>
            ) : (
                <>
                    {/* {console.log(restaurants)} */}
                    <RestaurantGrid restaurants={restaurantsFromAPI?.data} />
                    <DialogModal />
                </>
            )}
        </AdaptiveCard>
    )
}

export default RestaurantDashboard

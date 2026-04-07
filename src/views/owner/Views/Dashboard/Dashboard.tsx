import { Suspense, lazy, useEffect } from 'react'
import useSWR from 'swr'
import Dialog from '@/components/ui/Dialog'
import Spinner from '@/components/ui/Spinner'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import RestaurantHeader from './components/RestaurantHeader'
import RestaurantGrid from './components/RestaurantGrid'
import { useRestaurantStore } from '../../store/restaurantStore'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import { useGetRestaurants } from '../../hooks/useRestaurant'
import DialogModal from './components/DialogModel'

const RestaurantDashboard = () => {
    const { restaurants, setRestaurants, setLoading, setError } =
        useRestaurantStore()

    // // SWR data fetching (pattern from Scrum Board)
    // const { isLoading, error } = useSWR(
    //     '/api/restaurant/get-restaurants',
    //     () => apiGetRestaurants<RestaurantsResponse>(),
    //     {
    //         revalidateOnFocus: false,
    //         revalidateIfStale: false,
    //         onSuccess: (data) => {
    //             console.log('Fetched restaurants:', data)
    //             setRestaurants(data)
    //         },
    //         onError: (err) => {
    //             setError(err.message)
    //         },
    //     },
    // )

    const { data: restaurantsFromAPI, isLoading, error } = useGetRestaurants()

    useEffect(() => {
        if (restaurantsFromAPI) {
            setRestaurants(restaurantsFromAPI)
        }
    }, [restaurantsFromAPI, setRestaurants])

    // Update loading state
    if (isLoading !== isLoading) setLoading(isLoading)
    if (error) {
        console.error('Error loading restaurants:', error)
        setError(error.message)
    }

    const layoutType = useThemeStore((state) => state.layout.type)

    return (
        <PostLoginLayout layoutType={layoutType}>
            <AdaptiveCard className="h-full" bodyClass="h-full flex flex-col">
                <RestaurantHeader />

                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <Spinner size={40} />
                    </div>
                ) : (
                    <>
                        {/* {console.log(restaurants)} */}
                        <RestaurantGrid restaurants={restaurants} />
                        <DialogModal />
                    </>
                )}
            </AdaptiveCard>
        </PostLoginLayout>
    )
}

export default RestaurantDashboard

// <PostLoginLayout layoutType={layoutType}>
//     <AdaptiveCard className="h-full" bodyClass="h-full flex flex-col">

//     </AdaptiveCard>
// </PostLoginLayout>
// const { data: restaurants, isLoading, isError } = useGetRestaurants()

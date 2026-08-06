import {
    apiCreateRestaurantProfile,
    apiDeleteRestaurantProfile,
    apiGetRestaurantProfile,
    apiUpdateRestaurantProfile,
} from '@/services/RestaurantProfileService'
// import { apiUpdateRestaurant } from '@/services/RestaurantService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetRestaurantProfile = (restaurantProfileId: string) => {
    console.log('restuarantProfileId: ', restaurantProfileId)
    return useQuery({
        queryKey: ['restaurant-profile', restaurantProfileId],
        queryFn: () => apiGetRestaurantProfile(restaurantProfileId),
        enabled: !!restaurantProfileId,
    })
}

export const useCreateRestaurantProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiCreateRestaurantProfile,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] }),
        onError: (error: unknown) => {
            console.log('Error creating restaurant profile: ', error)
        },
    })
}

export const useUpdateRestaurantProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateRestaurantProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] })
        },
    })
}

export const useDeleteRestaurantProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteRestaurantProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] })
        },
        onError: (error: unknown) => {
            console.log('Error deleting restaurant profile: ', error)
        },
    })
}
// export const useGetRestaurantProfile = (restaurantProfileId: string) => {
//     return useQuery({
//         queryKey: ['restaurant-profile', restaurantProfileId],
//         queryFn: async () => {
//             const response =
//                 await restaurantProfileAPI.getProfileByRestaurantId(
//                     restaurantProfileId,
//                 )
//             console.log('Restaurant Profile Response =', response)
//             return response.data as RestaurantProfile
//         },
//         enabled: !!restaurantProfileId,
//     })
// }

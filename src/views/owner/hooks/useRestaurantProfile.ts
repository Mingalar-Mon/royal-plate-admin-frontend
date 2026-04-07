import { Variables } from './../../../configs/preset-theme-schema.config'
import { NotificationUI } from '@/components/ui/Notification'
import { restaurantAPI } from './../api/restaurant'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { restaurantAPI } from '../api/restaurant'
import { RestaurantProfile } from '../Views/RestaurantProfile/types/restaurantProfile.type'
import { restaurantProfileAPI } from '../api/restaurantProfile'
import { toast } from '@/components/ui'

export const useGetRestaurantProfile = (restaurantProfileId: string) => {
    return useQuery({
        queryKey: ['restaurant-profile', restaurantProfileId],
        queryFn: async () => {
            const response =
                await restaurantProfileAPI.getProfileByRestaurantId(
                    restaurantProfileId,
                )
            console.log('Restaurant Profile Response =', response)
            return response.data as RestaurantProfile
        },
        enabled: !!restaurantProfileId,
    })
}

export const useGetAllCuisines = () => {
    return useQuery({
        queryKey: ['cuisine'],
        queryFn: async () => {
            const response = await restaurantAPI.getCuisines()
            // console.log('Cuisine from api: ', response)
            return response.data
        },
    })
}

export const useGetAllPaymentMethods = () => {
    return useQuery({
        queryKey: ['payment-methods'],
        queryFn: async () => {
            const response = await restaurantAPI.getPaymentMethods()
            console.log('Paymentmehtods from api: ', response)
            return response.data
        },
    })
}

export const useCreateRestaurantProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            restaurantId,
            data,
        }: {
            restaurantId: string
            data: any
        }) => {
            return restaurantProfileAPI.createProfile(restaurantId, data)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['restaurant-profile', variables.restaurantId],
            })
        },
        onError: (error: any) => {
            console.log(error)
        },
    })
}

export const useUpdateRestaurantProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ profileId, data }: { profileId: string; data: any }) => {
            console.log('ProfileId: ', profileId)
            console.log('Data to be updated: ', data)

            return restaurantProfileAPI.updateProfile(profileId, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] })
            queryClient.invalidateQueries({ queryKey: ['cuisines'] })
            queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
        },
        onError: (error) => {
            console.log('Error updating restaurant profile: ', error)
        },
    })
}

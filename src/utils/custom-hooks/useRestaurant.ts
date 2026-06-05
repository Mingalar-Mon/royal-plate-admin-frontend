import { Restaurant } from '@/@types/restaurant'
import { Notification, toast } from '@/components/ui'
import {
    apiCreateRestaurant,
    apiDeleteRestaurant,
    apiGetRestaurant,
    apiGetRestaurants,
    apiUpdateRestaurant,
    apiGetRestaurantList,
} from '@/services/RestaurantService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetRestaurants = () => {
    const userId = useSessionUser((state) => state.user.userId)
    return useQuery({
        queryKey: ['restaurants', userId],
        queryFn: () => apiGetRestaurants(),
        enabled: !!userId,
    })
}

export const useGetRestaurantList = () => {
    return useQuery({
        queryKey: ['restaurant'],
        queryFn: () => apiGetRestaurantList(),
    })
}

export const useGetRestaurant = (id: string) => {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: () => apiGetRestaurant(id),
        enabled: !!id,
    })
}

export const useCreateRestaurant = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateRestaurant,
        onSuccess: async (response) => {
            console.log('Response from api create restaurant: ', response)
            await queryClient.invalidateQueries({ queryKey: ['restaurants'] })
        },
        onError: (error: unknown) => {
            console.log('Error creating restaurant: ', error)
        },
    })
}

export const useUpdateRestaurant = () => {
    interface updateRequest {
        restaurantId: string
        data: Partial<Restaurant>
    }

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: any) => {
            console.log(
                'Updating the restaurant with the following data\n',
                data,
            )

            /**
             * create restaurant controller doesn't accept owner, staff, owenerId, staffIds,
             * thus, we must exclude them
             *
             * TODO: change this to DTO
             */
            // const { owner, staff, ownerId, staffIds, ...refinedData } = data

            return apiUpdateRestaurant({ id, data })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })
        },
        onError: (error: unknown) => {
            console.log('Error updating restaurant: ', error)
        },
    })
}

export const useDeleteRestaurant = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => apiDeleteRestaurant(id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ['restaurants', 'restaurant', response.data.id],
            })
            toast.push(
                Notification({
                    title: 'Success',
                    type: 'success',
                    children: 'Updated successfully',
                }),
            )
        },
        onError: (error: unknown) => {
            console.log('Error creating restaurant: ', error)
        },
    })
}

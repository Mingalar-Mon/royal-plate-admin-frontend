import { restaurantAPI } from './../api/restaurant'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from '@/components/ui/toast'

// Type definitions
export interface Restaurant {
    id: string
    name: string
    address: string
    imageUrl: string[]
    startingPrice: number
    endingPrice: number
    latitude: number
    longitude: number
    owner: {
        id: string
        name: string
        email: string
    }
    staff: Array<{
        id: string
        name: string
        email: string
    }>
}

export const useGetRestaurants = () => {
    return useQuery({
        queryKey: ['restaurants'],
        queryFn: async () => {
            const response = await restaurantAPI.getRestaurants()
            console.log(response)
            return response.data as Restaurant[]
        },
    })
}

export const useGetRestaurant = (id: string) => {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: async () => {
            const response = await restaurantAPI.getRestaurant(id)
            return response
        },
        enabled: !!id,
    })
}

export const useCreateRestaurant = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Partial<Restaurant>) => {
            const result = await restaurantAPI.createRestaurant(data)
            return result
        },
        onSuccess: () => {
            // invalidate and refetch restaurant list since there is changes to restaurant list
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })
            console.log('success')
        },
        onError: (error: any) => {
            console.log(error)
        },
    })
}

export const useUpdateRestaurant = () => {
    const queryClient = useQueryClient()
    interface updateRequest {
        id: string
        data: Partial<Restaurant>
    }
    console.log('IN the useUPdate restaurant')

    return useMutation({
        mutationFn: ({ id, data }: updateRequest) => {
            console.log('Updating the restaurant : ', id, 'with data: ', data)
            // const { owner, staff, ownerId, staffIds, ...refinedData } = data
            // TODO: change this to DTO
            return restaurantAPI.updateRestaurant(id, data)
        },

        onSuccess: (_, variables) => {
            console.log('Restaurant id', variables.id)
            // changes to restaurant list => invalidate existing data
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })
            queryClient.invalidateQueries({
                queryKey: ['restaurant', variables.id],
            })
            // TODO: model - success

            toast.push('success')
        },
        onError: (error) => {
            // model fail
            toast.push('Update failed')

            console.log(error)
        },
    })
}

export const useDeleteRestaurant = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => restaurantAPI.deleteRestaurant(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })

            toast.push('Successfully deleted restaurant')
        },
        onError: (error) => {
            console.log('Error deleting restaurant', error)
            toast.push('Error deleting a restaurant')
        },
    })
}

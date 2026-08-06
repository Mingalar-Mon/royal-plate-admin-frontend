import { GetCuisineResponse } from '@/@types/cuisine'
import {
    apiGetCuisines,
    apiGetCuisineDetail,
    apiCreateCuisine,
    apiDeleteCuisine,
    apiUpdateCuisine,
} from '@/services/CuisineService'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockCuisines } from '../mock/cuisineData'
// import type {
//     Cuisine,
//     CuisineFormData,
//     TableQueries,
// } from '../types/cuisine.types'
import { CuisineQueries } from '@/store/cuisineStore'

export const useGetCuisines = (params: CuisineQueries) => {
    // console.log('Params: ', params)
    return useQuery<GetCuisineResponse>({
        queryKey: ['cuisines', params],
        queryFn: () => apiGetCuisines(params),
    })
}
export const useCuisineDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ['cuisine', id],
        queryFn: () => apiGetCuisineDetail(id),
        enabled: !!id,
    })
}

export const useCreateCuisineMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateCuisine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuisines'] })
        },
    })
}

export const useUpdateCuisineMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            apiUpdateCuisine(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cuisines'] })
            queryClient.invalidateQueries({
                queryKey: ['cuisine', variables.id],
            })
        },
    })
}

export const useDeleteCuisineMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteCuisine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cuisines'] })
        },
    })
}

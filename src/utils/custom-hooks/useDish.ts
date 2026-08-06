import {
    apiCreateDish,
    apiDeleteDish,
    apiGetDish,
    apiGetDishes,
    apiUpdateDish,
} from '@/services/DishService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay } from '../helpers/mock.helper'
// import { mockDishes } from '../mock/orderData'
import { mockDishes } from '../mock/dishData'
import {
    // Dish,
    TableQueries,
    FilterFormData,
} from '@/views/dishes/types/dish.type'
import { useState } from 'react'
import { useParams } from 'react-router'
import { DishQueries } from '@/store/dishStore'

let dishData = [...mockDishes]

// export const useGetDishes = (restaurantId: string) => {
//     return useQuery({
//         queryKey: ['dishes'],
//         queryFn: () => apiGetDishes(restaurantId),
//     })
// }
export type GetDishesParams = TableQueries &
    Partial<FilterFormData> & { restaurantId: string }
export const useGetDishes = ({
    restaurantId,
    params,
}: {
    restaurantId: string
    params: DishQueries
}) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['dishes', params],
        queryFn: () => apiGetDishes({ restaurantId, params }),
        enabled: !!restaurantId,
    })

    return {
        dishes: data?.data || [],
        total: data?.paginator.totalItems || 0,
        isLoading,
        refetch,
    }

    // // CALL API
    // const response = await apiGetDishes(params)

    // return {
    //     success: response.success,
    //     data: response.data,
    //     total: response.paginator.totalItems,
    // }

    // // mock
    // await delay(300)
    // let filtered = [...mockDishes]
    // if (params.query) {
    //     const lowerCaseQuery = params.query.toLowerCase()
    //     filtered = filtered.filter(
    //         (dish) =>
    //             dish.name.includes(lowerCaseQuery) ||
    //             dish.description
    //                 ?.toLowerCase()
    //                 .includes(lowerCaseQuery),
    //     )
    // }

    // if (params.status) {
    //     filtered = filtered.filter((dish) =>
    //         params.status === 'available'
    //             ? dish.available
    //             : !dish.available,
    //     )
    // }

    // if (params.category && params.category.length > 0) {
    //     filtered = filtered.filter((dish) =>
    //         params.category?.includes(dish.category),
    //     )
    // }

    // if (params.minPrice) {
    //     filtered = filtered.filter(
    //         (dish) => dish.price >= Number(params.minPrice),
    //     )
    // }

    // if (params.maxPrice) {
    //     filtered = filtered.filter(
    //         (dish) => dish.price <= Number(params.maxPrice),
    //     )
    // }

    // // sorting
    // // ================ STUDY THIS LATER =====================
    // if (params.sort?.key) {
    //     filtered.sort((a, b) => {
    //         const aVal = a[params.sort!.key as keyof Dish] as
    //             | number
    //             | string
    //         const bVal = b[params.sort!.key as keyof Dish] as
    //             | number
    //             | string
    //         if (typeof aVal === 'number' && typeof bVal === 'number') {
    //             return params.sort!.order === 'asc'
    //                 ? aVal - bVal
    //                 : bVal - aVal
    //         }
    //         return 0
    //     })
    // }

    // const start = (params.pageIndex - 1) * params.pageSize
    // const paginated = filtered.slice(start, start + params.pageSize)

    // return {
    //     success: true,
    //     data: paginated,
    //     total: filtered.length,
    // }

    // enabled: !!restaurantId,
    // })
}

export const useGetDish = (dishId: string) => {
    // call api
    return useQuery({
        queryKey: ['dish', dishId],
        queryFn: () => apiGetDish(dishId),
    })
    // mock
    /*
    return useQuery({
        queryKey: ['dish', dishId],
        queryFn: async () => {
            await delay(700)
            const dish = dishData.find((dish) => dishId === dish.id)
            if (!dish) throw new Error('Dish not found')

            return dish
        },
        enabled: !!dishId,
    })
        */
}

/*
const updateDish = async ({
    dishId,
    data,
}: {
    dishId: string
    data: Partial<DishFormData>
}) => {
    await delay(600)
    const index = dishData.findIndex((dish) => dish.id === dishId)
    if (index === -1) throw new Error('Dish not found')
    dishData[index] = { ...dishData[index], ...data }
    return dishData[index]
}
    */

export const useUpdateDish = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateDish,
        onSuccess: (_, variables) => {
            return (
                queryClient.invalidateQueries({ queryKey: ['dishes'] }),
                queryClient.invalidateQueries({
                    queryKey: ['dish', variables.dishId],
                })
            )
        },
    })
}

const deleteDish = async (dishId: string) => {
    await delay(500)
    dishData = dishData.filter((dish) => dish.id !== dishId)
    return { success: true }
}

export const useDeleteDish = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteDish,
        // mutationFn: deleteDish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] })
        },
    })
}

/*
const createDish = async (data: DishFormData) => {
    await delay(600)
    const newDish: Dish = {
        id: String(Date.now()),
        ...data,
        imageUrl: data.imageUrl || '',
    }
    dishData.push(newDish)

    return newDish
}
    */

export const useCreateDish = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateDish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishes'] })
        },
    })
}

export const useDishList = () => {
    const { restaurantId } = useParams()
    // if (!restaurantId) {
    //     console.error('Restaurant id is needed to fetch data')
    //     return
    // }
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 10,
        query: '',
    })

    const [filterData, setFilterData] = useState<Partial<FilterFormData>>({})

    // const { data, isLoading, refetch } = useQuery({
    //     queryKey: ['dishes', tableData, filterData],
    //     queryFn: () => fetchDishes({ ...tableData, ...filterData }),
    // })
    const { data, isLoading } = useGetDishes({
        restaurantId: restaurantId || '',

        pageIndex: tableData.pageIndex,
        pageSize: tableData.pageSize,
        query: tableData.query,
    })
    console.log('Data: ', data)

    const dishList = data?.data || []
    // const dishList = data || []
    const dishListTotal = data?.total || 0

    return {
        dishList,
        dishListTotal,
        tableData,
        setTableData,
        filterData,
        setFilterData,
        isLoading,
    }
}

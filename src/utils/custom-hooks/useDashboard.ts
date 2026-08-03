import { useQuery } from '@tanstack/react-query'
import {
    apiGetDashboardEDA,
    apiGetTopSaleDishes,
    apiGetTopCustomers,
} from '@/services/DashboardService'

export const useGetDashboardEDA = (restaurantId: string) => {
    return useQuery({
        queryKey: ['dashboard-eda', restaurantId],
        queryFn: () => apiGetDashboardEDA(restaurantId),
        enabled: !!restaurantId,
    })
}

export const useGetTopSaleDishes = (restaurantId: string, limit = 10) => {
    return useQuery({
        queryKey: ['dashboard-top-sale-dishes', restaurantId, limit],
        queryFn: () => apiGetTopSaleDishes(restaurantId, limit),
        enabled: !!restaurantId,
    })
}

export const useGetTopCustomers = (restaurantId: string, limit = 10) => {
    return useQuery({
        queryKey: ['dashboard-top-customers', restaurantId, limit],
        queryFn: () => apiGetTopCustomers(restaurantId, limit),
        enabled: !!restaurantId,
    })
}

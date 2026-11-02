import { useState, useEffect, createElement } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Notification, toast } from '@/components/ui'
import {
    apiGetReservation,
    apiGetReservations,
    apiUpdateReservationStatus,
} from '@/services/ReservationService'
import type { ReservationQueries } from '@/store/reservationStore'

// ================ GET RESERVATION (Direct API call, no TanStack) =====================
export const useReservation = (id: string) => {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchReservation = async () => {
        if (!id) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            const response = await apiGetReservation(id)
            setData(response)
        } catch (err) {
            setError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReservation()
    }, [id])

    return { data, isLoading, error, refetch: fetchReservation }
}

export const useUpdateReservationStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: apiUpdateReservationStatus,
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            queryClient.invalidateQueries({
                queryKey: ['reservation', variables.reservationId],
            })
            toast.push(
                createElement(
                    Notification,
                    { type: 'success', title: 'Reservation updated' },
                    response.message ||
                        'Reservation status updated successfully.',
                ),
                { placement: 'top-center' },
            )
        },
        onError: (error: any) => {
            toast.push(
                createElement(
                    Notification,
                    { type: 'danger', title: 'Unable to update reservation' },
                    error?.response?.data?.message ||
                        'The reservation status could not be updated.',
                ),
                { placement: 'top-center' },
            )
        },
    })
}

export const useReservations = ({
    restaurantId,
    params,
}: {
    restaurantId?: string
    params: ReservationQueries
}) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['reservations', restaurantId, params],
        queryFn: () =>
            apiGetReservations({
                restaurantId: restaurantId!,
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                status: params.status || undefined,
                search: params.query || undefined,
                dateFrom: params.dateFrom || undefined,
                dateTo: params.dateTo || undefined,
                sort: params.sort || undefined,
            }),
        enabled: !!restaurantId,
    })

    return {
        reservations: data?.data || [],
        total: data?.paginator.totalItems || 0,
        isLoading,
        refetch,
    }
}

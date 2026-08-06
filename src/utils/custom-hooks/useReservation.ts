import { Variables } from './../../configs/preset-theme-schema.config'
import { mockReservations } from '../mock/reservationData'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
    Reservation,
    TableQueries,
} from '@/views/reservations/types/reservation.type'
import { delay } from '../helpers/mock.helper'
import {
    apiGetReservation,
    apiGetReservations,
    apiUpdateReservationStatus,
} from '@/services/ReservationService'
import { ReservationQueries } from '@/store/reservationStore'

let reservationsData = [...mockReservations]

// Simulated API functions
const fetchReservation = async (id: string): Promise<Reservation> => {
    // 🔁 Replace with: apiClient.get(`/reservations/${id}`)
    await delay(300)
    const found = reservationsData.find((r) => r.id === id)
    if (!found) throw new Error('Reservation not found')
    return found
}

export const useReservation = (id: string) => {
    return useQuery({
        queryKey: ['reservation', id],
        queryFn: () => apiGetReservation(id),
        // queryFn: () => fetchReservation(id),
        enabled: !!id,
    })
}
const fetchReservations = async (params: TableQueries) => {
    // 🔁 Replace with: apiClient.get('/reservations', { params })
    await delay(500)
    let filtered = [...reservationsData]
    if (params.query) {
        const q = params.query.toLowerCase()
        filtered = filtered.filter(
            (r) =>
                r.user.name.toLowerCase().includes(q) ||
                r.user.email?.toLowerCase().includes(q) ||
                r.user.phone?.includes(q),
        )
    }
    if (params.status && params.status !== 'all') {
        filtered = filtered.filter((r) => r.status === params.status)
    }
    if (params.dateFrom) {
        filtered = filtered.filter((r) => r.reservationDate >= params.dateFrom!)
    }
    if (params.dateTo) {
        filtered = filtered.filter((r) => r.reservationDate <= params.dateTo!)
    }
    if (params.sort?.key) {
        filtered.sort((a, b) => {
            const aVal = a[params.sort!.key as keyof Reservation]
            const bVal = b[params.sort!.key as keyof Reservation]
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return params.sort!.order === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal)
            }
            return 0
        })
    }
    const start = (params.pageIndex - 1) * params.pageSize
    const paginated = filtered.slice(start, start + params.pageSize)
    return { list: paginated, total: filtered.length }
}

export const useUpdateReservationStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiUpdateReservationStatus,
        onSuccess: (_, variables) => {
            ;(queryClient.invalidateQueries({ queryKey: ['reservations'] }),
                queryClient.invalidateQueries({
                    queryKey: ['reservation', variables.reservationId],
                }))
        },
    })
    // 🔁 PATCH /reservations/${id}/status
    // await delay(400)
    // const index = reservationsData.findIndex((r) => r.id === id)
    // if (index === -1) throw new Error('Reservation not found')
    // reservationsData[index].status = status as any
    // return reservationsData[index]
}

export const useReservations = ({
    restaurantId,
    params,
}: {
    restaurantId?: string
    params: ReservationQueries
}) => {
    // const [tableData, setTableData] = useState<TableQueries>({
    //     pageIndex: 1,
    //     pageSize: 10,
    //     query: '',
    //     status: '',
    //     dateFrom: '',
    //     dateTo: '',
    // })

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
        // queryFn: () => fetchReservations(tableData),
        enabled: !!restaurantId, // if needed
    })

    // const updateStatus = useMutation({
    //     mutationFn: useUpdateReservationStatus().mutate,
    //     onSuccess: () => refetch(),
    // })

    return {
        reservations: data?.data || [],
        total: data?.paginator.totalItems || 0,
        // tableData,
        // setTableData,
        isLoading,
        // updateStatus,
        refetch,
    }
}

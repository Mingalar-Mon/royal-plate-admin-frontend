import { createElement } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Notification, toast } from '@/components/ui'
import {
    apiDeleteRatingOwnerResponse,
    apiGetRatings,
    apiSaveRatingOwnerResponse,
} from '@/services/RatingService'
import type { RatingQueries } from '@/store/ratingStore'

export const useRatings = ({
    restaurantId,
    params,
}: {
    restaurantId?: string
    params: RatingQueries
}) => {
    const response = params.response === 'all' ? undefined : params.response
    const query = useQuery({
        queryKey: ['ratings', restaurantId, params],
        queryFn: () =>
            apiGetRatings({
                restaurantId: restaurantId!,
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                response,
                search: params.query || undefined,
                sort: params.sort,
            }),
        enabled: Boolean(restaurantId),
    })

    return {
        ratings: query.data?.data || [],
        total: query.data?.paginator?.totalItems || 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        refetch: query.refetch,
    }
}

const showRatingNotification = (
    type: 'success' | 'danger',
    title: string,
    message: string,
) => {
    toast.push(
        createElement(Notification, { type, title }, message),
        { placement: 'top-center' },
    )
}

export const useSaveRatingOwnerResponse = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiSaveRatingOwnerResponse,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['ratings'] })
            showRatingNotification(
                'success',
                'Reply published',
                response.message || 'Your response was saved and the reviewer was notified.',
            )
        },
        onError: (error: any) => {
            showRatingNotification(
                'danger',
                'Unable to publish reply',
                error?.response?.data?.message || 'Please try again.',
            )
        },
    })
}

export const useDeleteRatingOwnerResponse = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteRatingOwnerResponse,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['ratings'] })
            showRatingNotification(
                'success',
                'Response removed',
                response.message || 'Your response was cleared.',
            )
        },
        onError: (error: any) => {
            showRatingNotification(
                'danger',
                'Unable to remove response',
                error?.response?.data?.message || 'Please try again.',
            )
        },
    })
}

import { create } from 'zustand'
import {
    apiGetNotificationCount,
    apiMarkAllNotificationsRead,
} from '@/services/NotificationService'

interface NotificationStoreState {
    unreadReviewCount: number
    setUnreadReviewCount: (count: number) => void
    incrementUnreadReviewCount: () => void
    fetchUnreadReviewCount: (restaurantId: string) => Promise<void>
    markUnreadReviewsRead: (restaurantId: string) => Promise<void>
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
    unreadReviewCount: 0,
    setUnreadReviewCount: (count) => set({ unreadReviewCount: count }),
    incrementUnreadReviewCount: () =>
        set((state) => ({ unreadReviewCount: state.unreadReviewCount + 1 })),
    fetchUnreadReviewCount: async (restaurantId: string) => {
        try {
            const resp = await apiGetNotificationCount(restaurantId, 'rating')
            set({ unreadReviewCount: resp.count })
        } catch {
            set({ unreadReviewCount: 0 })
        }
    },
    markUnreadReviewsRead: async (restaurantId: string) => {
        try {
            await apiMarkAllNotificationsRead(restaurantId, 'rating')
        } catch {
            // Count refetch below still aligns the badge with the server.
        }
        try {
            const resp = await apiGetNotificationCount(restaurantId, 'rating')
            set({ unreadReviewCount: resp.count })
        } catch {
            set({ unreadReviewCount: 0 })
        }
    },
}))

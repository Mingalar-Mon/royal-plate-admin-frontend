export type NotificationItem = {
    id: string
    category: 'order' | 'reservation'
    eventType: 'created' | 'updated' | 'cancelled' | 'confirmed' | 'completed'
    title: string
    body: string
    referenceId: string
    actorName: string | null
    actorImage: string | null
    isRead: boolean
    created_at: string
}

export type GetNotificationListResponse = {
    success: boolean
    paginator: {
        totalItems: number
        currentPage: number
        totalPages: number
        pageSize: number
    }
    data: NotificationItem[]
}

export type GetUnreadCountResponse = {
    success: boolean
    count: number
}

export type MarkReadResponse = {
    success: boolean
    message: string
}
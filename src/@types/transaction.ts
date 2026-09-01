export type TransactionType = 'order' | 'reservation'

export type TransactionItem = {
    referenceId: string
    type: TransactionType
    totalPrice: number
    subTotal: number | null
    commission_fee: number | null
    commissionBatch: {
        id: string
        code: string
        percentage: string
        is_active: boolean
        deactivated_date: string | null
        created_at: string
        updated_at: string
    } | null
    orderNumber?: string // present when type === 'order'
    reservationNumber?: string // present when type === 'reservation'
    created_at: string // ISO 8601
}

export type TransactionSummary = {
    totalPrice: number
    subTotal: number
    commission_fee: number
}

export type GetTransactionsResponse = {
    success: boolean
    paginator: {
        totalItems: number
        currentPage: number
        totalPages: number
        pageSize: number
    }
    data: TransactionItem[]
    summary: TransactionSummary
    message: string
}

export type TransactionQueries = {
    page: number
    limit: number
    // Selected period formatted as 'YYYY-MM' (e.g. '2026-09').
    // Empty string means no date filter (all transactions).
    month: string
}
import type { CommissionBasis } from './commission'

export type TransactionType = 'order' | 'reservation'

/**
 * Snapshot of the configuration that was in force when the reference was
 * created. Percentages stay `string` because they are `numeric` columns.
 */
export type TransactionCommissionBatch = {
    id: string
    code: string
    perOrder: boolean
    perReservation: boolean
    orderPercent: string | null
    reservationPercent: string | null
    reservationBasis: CommissionBasis
    is_active: boolean
    deactivated_date: string | null
    created_at: string
    updated_at: string
}

export type TransactionItem = {
    referenceId: string
    type: TransactionType
    totalPrice: number
    subTotal: number | null
    commission_fee: number | null
    /** The amount the rate was applied to. */
    commissionBase: string | null
    /** The rate as a fraction — "0.1" means 10%. */
    commissionRate: string | null
    commissionBatch: TransactionCommissionBatch | null
    orderNumber?: string // present when type === 'order'
    reservationNumber?: string // present when type === 'reservation'
    created_at: string // ISO 8601
    isSettle: boolean
    netAmount: number
}

export type TransactionSummary = {
    totalPrice: number
    subTotal: number
    commission_fee: number
    netAmount: number
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
    fromDate: string
    toDate: string
    restaurantId: string
}

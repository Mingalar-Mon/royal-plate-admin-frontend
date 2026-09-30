import type { CommissionBasis } from './commission'

export type TransactionType = 'order' | 'reservation'

/**
 * The configuration that was in force when the reference was created. Only
 * `id` and `code` are guaranteed by the list endpoint — treat the rest as
 * best-effort and never branch on it being present.
 */
export type TransactionCommissionBatch = {
    id: string
    code: string
    perOrder?: boolean
    perReservation?: boolean
    orderPercent?: string | null
    reservationPercent?: string | null
    reservationBasis?: CommissionBasis
    is_active?: boolean
    deactivated_date?: string | null
    created_at?: string
    updated_at?: string
}

/**
 * Every decimal arrives as a JSON string — Postgres `numeric` has no lossless
 * JSON representation. Parse with `Number()` before arithmetic.
 */
export type TransactionItem = {
    referenceId: string
    type: TransactionType
    totalPrice: string
    subTotal: string | null
    commission_fee: string | null
    /** The amount the rate was applied to. */
    commissionBase: string | null
    /** The rate as a fraction — "0.1" means 10%. */
    commissionRate: string | null
    /** Always `subTotal - commission_fee`, whatever the basis. */
    netAmount: string | null
    commissionBatch: TransactionCommissionBatch | null
    orderNumber?: string // present when type === 'order'
    reservationNumber?: string // present when type === 'reservation'
    created_at: string // ISO 8601
    isSettle: boolean
}

/** Computed over the full filtered set, not just the current page. */
export type TransactionSummary = {
    totalPrice: string
    subTotal: string
    commission_fee: string
    netAmount: string
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

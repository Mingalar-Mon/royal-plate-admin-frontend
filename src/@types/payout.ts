/**
 * A settled batch of ledger rows. All decimals are JSON strings, and the
 * eight `breakdown` columns are `null` on payouts created before the
 * per-scope commission split — `null` means "not recorded", not zero.
 */
export type PayoutBatch = {
    id: string
    code: string
    restaurant: {
        id: string
        name: string
    }
    fromDate: string
    toDate: string
    totalPrice: string
    subTotal: string
    commission_fee: string
    netAmount: string
    orderCount: number | null
    reservationCount: number | null
    orderSubTotal: string | null
    reservationSubTotal: string | null
    orderCommission: string | null
    reservationCommission: string | null
    orderNetAmount: string | null
    reservationNetAmount: string | null
    created_at: string
    updated_at: string
}

export type PayoutBatchesResponse = {
    success: boolean
    paginator: {
        totalItems: number
        currentPage: number
        totalPages: number
        pageSize: number
    }
    data: PayoutBatch[]
    message: string
}

export type PayoutQueries = {
    page: number
    limit: number
    restaurantId: string
}

/**
 * The figures `POST /transaction/payout` will persist, computed server-side
 * from the same query the settle uses. Always preview before settling —
 * never sum the ledger client-side.
 */
export type PayoutPreview = {
    restaurantId: string
    fromDate: string
    toDate: string
    code: string
    /** Echoed back verbatim into the create call. */
    totals: {
        totalPrice: string
        subTotal: string
        commission_fee: string
        netAmount: string
    }
    /**
     * Orders and reservations carry different rates — and reservations may
     * be charged on the table fee alone — so one blended figure cannot
     * explain a payout that mixes both.
     */
    breakdown: {
        orderCount: number
        reservationCount: number
        orderSubTotal: string
        reservationSubTotal: string
        orderCommission: string
        reservationCommission: string
        orderNetAmount: string
        reservationNetAmount: string
    }
    /** Rows this payout will settle. */
    itemCount: number
    /** In-range rows a previous payout already took — excluded from this one. */
    alreadySettled: number
}

export type PayoutPreviewResponse = {
    success: boolean
    data: PayoutPreview
    message: string
}

export type PostPayoutResponse = {
    success: boolean
    data: PayoutBatch
    message: string
}

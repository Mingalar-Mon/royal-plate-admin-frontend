export type CommissionBatch = {
    id: string
    code: string
    percentage: string
}

export type PayoutSettledReference = {
    id: string
    tax?: string
    totalPrice?: string
    subTotal?: string
    commission_fee?: string
    netAmount?: string
    isSettle?: boolean
    commissionBatch?: CommissionBatch | null
}

export type PayoutItem = {
    id: string
    created_at: string
    order: (PayoutSettledReference & { orderNumber?: string }) | null
    reservation: (PayoutSettledReference & {
        reservationNumber?: string
        reservationDate?: string
    }) | null
}

export type PayoutBatch = {
    id: string
    code: string
    fromDate: string
    toDate: string
    totalPrice: string
    subTotal: string
    commission_fee: string
    netAmount: string
    created_at: string
    updated_at: string
    restaurant: {
        id: string
        name: string
    }
    payoutItems: PayoutItem[]
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
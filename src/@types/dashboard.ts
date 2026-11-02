export type DashboardEDAData = {
    todayPendingOrder: number
    todayComfirmedOrder: number
    todayPendingReservation: number
    todayComfirmedReservation: number
    todayCompletedOrder: number
    todayCompletedOrderTotalPrice: number
    todayCompletedReservation: number
    todayCompletedReservationTotalPrice: number
}

export type GetDashboardEDADataResponse = {
    success: boolean
    data: DashboardEDAData
    message: string
}

export type TopSaleDish = {
    dishId: string
    dishName: string
    coverImageUrl: string
    price: number
    description: string
    totalQuantity: number
}

export type GetTopSaleDishesResponse = {
    success: boolean
    data: TopSaleDish[]
    message: string
}

export type TopCustomer = {
    userId: string
    name: string
    email: string
    phone: string
    totalOrders: number
}

export type TopReservationCustomer = {
    userId: string
    name: string
    email: string
    phone: string
    totalReservations: number
}

export type GetTopCustomersResponse = {
    success: boolean
    data: {
        mostOrderedCustomers: TopCustomer[]
        mostReservationCustomers: TopReservationCustomer[]
    }
    message: string
}

export type OwnerOverviewRestaurant = {
    restaurantId: string
    restaurantName: string
    totalPrice: number
    subTotal: number
    commission_fee: number
    netAmount: number
    orderCount: number
    reservationCount: number
}

export type OwnerOverviewData = {
    ownerId: string
    ownerName: string
    ownerEmail: string
    ownerPhone: string
    restaurantCount: number
    totalPrice: number
    subTotal: number
    commission_fee: number
    netAmount: number
    orderCount: number
    reservationCount: number
    restaurants: OwnerOverviewRestaurant[]
}

export type OwnerOverviewSummary = {
    totalPrice: number
    subTotal: number
    commission_fee: number
    netAmount: number
    orderCount: number
    reservationCount: number
}

export type OwnerOverviewPaginator = {
    totalItems: number
    currentPage: number
    totalPages: number
    pageSize: number
}

export type GetOwnerOverviewResponse = {
    success: boolean
    paginator: OwnerOverviewPaginator
    summary: OwnerOverviewSummary
    data: OwnerOverviewData[]
    message: string
}

export type OwnerOverviewFilters = {
    ownerId?: string
    search?: string
    fromDate?: string
    toDate?: string
    page?: number
    limit?: number
    sortBy?:
        | 'totalPrice'
        | 'netAmount'
        | 'commission_fee'
        | 'orderCount'
        | 'reservationCount'
        | 'ownerName'
    sortOrder?: 'ASC' | 'DESC'
}

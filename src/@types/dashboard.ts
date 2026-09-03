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

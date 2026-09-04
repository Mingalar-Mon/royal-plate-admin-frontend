export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'seated'
    | 'completed'
    | 'no_show'
    | 'rejected'
    | 'canceled'

export interface User {
    id: string
    name: string
    email?: string
    phone?: string
    profileImage?: string
}

export interface Table {
    id: string
    type: string
    capacity: number
}

export interface Reservation {
    id: string
    reservationDate: string // YYYY-MM-DD
    startingTime: string // ISO datetime
    endingTime: string
    status: ReservationStatus
    remark?: string | null
    user: User
    table: Table
    reservationItems?: {
        id: string
        quantity: number
        unitPrice: number
        dish: { id: string; name: string }
    }[]
    created_at: string
    updated_at: string
}

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: { order: 'asc' | 'desc' | ''; key: string | number }
    query?: string
    status?: ReservationStatus | ''
    dateFrom?: string
    dateTo?: string
}

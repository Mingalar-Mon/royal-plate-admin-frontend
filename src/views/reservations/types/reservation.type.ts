export type ReservationStatus =
    | 'confirmed'
    | 'pending'
    | 'canceled'
    | 'complete'

export interface User {
    id: string
    name: string
    email?: string
    phone?: string
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
    remark?: string
    user: User
    table: Table
    dishes?: { id: string; name: string }[]
    createdAt: string
    updatedAt: string
}

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: { order: 'asc' | 'desc'; key: string }
    query?: string
    status?: string
    dateFrom?: string
    dateTo?: string
}

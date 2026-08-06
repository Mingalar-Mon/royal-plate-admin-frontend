export type StaffRole = 'manager' | 'staff' | 'cashier' | 'chef'

export interface RestaurantStaff {
    id: string
    name: string
    email: string
    role: StaffRole
    restaurantId: string
    created_at: string
    updated_at: string
}

export interface StaffFormData {
    name: string
    email: string
    role: StaffRole
    password?: string // only for create
}

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: { order: 'asc' | 'desc'; key: string }
    query?: string
    role?: string
}

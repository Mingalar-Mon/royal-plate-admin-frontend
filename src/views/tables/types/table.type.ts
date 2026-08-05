export type TableType = 'vip' | 'standard' | 'family'
export type TableStatus = 'active' | 'inactive' | 'maintenance'

export interface Table {
    id: string
    type: TableType
    capacity: number
    durationMinutes?: number
    tableFee?: number
    status: TableStatus
    services?: string[]
    restaurantId: string
    created_at: string
    updated_at: string
}

export interface TableFormData {
    type: TableType
    capacity: number
    durationMinutes?: number
    tableFee?: number
    status: TableStatus
    services?: string[]
}

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: { order: 'asc' | 'desc'; key: string }
    query?: string
    type?: string
    status?: string
}

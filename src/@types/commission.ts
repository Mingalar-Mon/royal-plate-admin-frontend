import { z } from 'zod'

export interface Commission {
    id: string
    percentage: number
    is_active?: boolean
    restaurantId?: string
    restaurantName?: string
    restaurant?: {
        id?: string
        name?: string
    }
    createdAt?: string
    updatedAt?: string
    created_at?: string
    updated_at?: string
}

export interface CommissionQuery {
    status?: boolean
    page: number
    limit: number
    sortKey: string
    sortOrder: 'ASC' | 'DESC' | 'asc' | 'desc'
    search: string
    fromDate?: Date
    toDate?: Date
}

export interface CommissionFormData {
    percentage: number
}

export const commissionValidationSchema = z.object({
    percentage: z.coerce
        .number<string | number>()
        .min(0, { message: 'Percentage cannot be less than 0' })
        .max(100, { message: 'Percentage cannot be greater than 100' }),
})

export type CommissionFormInput = z.input<typeof commissionValidationSchema>
export type CommissionFormOutput = z.output<typeof commissionValidationSchema>

export type CommissionListResponse = {
    success: boolean
    data: Commission[]
    paginator: {
        totalItems: number
        totalPages: number
        pageSize: number
        currentPage: number
    }
    message: string
}

export type CommissionCreateResponse = {
    success: boolean
    data: Commission
    message: string
}

import { z } from 'zod'

export interface Dish {
    id: string
    name: string
    description?: string
    price: number
    category?: string
    imageUrl?: string
    available: boolean
}

export interface OrderItem {
    dishId: string
    name: string
    quantity: number
    unitPrice: number
    subtotal: number
    notes?: string
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery'

export const orderValidationSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    customerPhone: z.string().min(1, 'Phone number is required'),
    orderType: z.enum(['dine_in', 'takeaway', 'delivery']),
    items: z
        .array(
            z.object({
                dishId: z.string(),
                name: z.string(),
                quantity: z.number().min(1),
                unitPrice: z.number(),
                subtotal: z.number(),
                notes: z.string().optional(),
            }),
        )
        .min(1, 'At least one dish is required'),
    specialInstructions: z.string().optional(),
    subtotal: z.number(),
    tax: z.number(), //.default(0)
    total: z.number(),
    paymentMethod: z.string().optional(),
    restaurantId: z.string().uuid(),
})

export type OrderFormSchema = z.infer<typeof orderValidationSchema>

export interface Order extends OrderFormSchema {
    id: string
    orderNumber: string
    status:
        | 'pending'
        | 'confirmed'
        | 'preparing'
        | 'ready'
        | 'completed'
        | 'rejected'
        | 'no_show'
        | 'canceled'
    date: number // newly added
    createdAt: string
    updatedAt: string
}

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: {
        order: 'asc' | 'desc'
        key: string
    }
    query?: string
    status?: string
}

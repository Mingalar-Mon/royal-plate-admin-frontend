import z from 'zod'

export interface Dish {
    id: string
    name: string
    description?: string
    price: number
    category: string
    imageUrl?: string
    available: boolean
    // optional fields for UI table
    sales?: number
    salesPercentage?: number
}

export const dishValidationSchema = z.object({
    name: z.string().min(1, 'Dish name is required'),
    price: z.coerce
        .number<string | number>()
        .min(1, 'Price must be at least 1'), // coerce handles string input from HTML
    category: z.string().min(1, 'Please select a cuisine category'),
    // Images are Files on create, but might be strings (URLs) on edit
    coverImage: z
        .union([
            z.instanceof(File),
            z.object({ key: z.string(), url: z.string() }),
            z.string(), // fall back url
        ])
        .optional(),
    detailImages: z
        .array(
            z.union([
                z.instanceof(File),
                z.object({ key: z.string(), url: z.string() }),
            ]),
        )
        .optional(),
    // coverImage: z
    //     .union([z.instanceof(File), z.string()])
    //     .refine((val) => !!val, {
    //         message: 'Cover image is required',
    //     }),
    // detailImages: z.array(z.union([z.instanceof(File), z.string()])).optional(),
    available: z.boolean().default(true),
    description: z.string().optional(),
    preparationTime: z.coerce.number().optional(),
    deletedImageKeys: z.array(z.string()).default([]),
})

export type DishFormData = z.infer<typeof dishValidationSchema>
export type DishFormInput = z.input<typeof dishValidationSchema>
export type DishFormOutput = z.output<typeof dishValidationSchema>

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: {
        order: 'asc' | 'desc'
        key: string
    }
    query?: string
    status?: string
    category?: string[]
    minPrice?: number
    maxPrice?: number
}

export interface FilterFormData {
    minPrice: number | string
    maxPrice: number | string
    status: string
    category: string[]
}

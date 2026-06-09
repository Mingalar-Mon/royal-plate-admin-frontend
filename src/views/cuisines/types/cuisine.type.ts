import { z } from 'zod'

export interface Cuisine {
    id: string
    name: string
    image: string
    description?: string
    created_at: string
    updated_at: string
}

// export interface CuisineFormData {
//     name: string
//     image: string
//     description?: string
// }

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: { order: 'asc' | 'desc'; key: string }
    query?: string
}

export const cuisineValidationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    // Accepts a binary File on create or an object map on edit
    image: z
        .union([
            z.instanceof(File),
            z.object({ key: z.string(), url: z.string() }),
            z.string(), // Fallback support
        ])
        .refine((val) => !!val, { message: 'Cuisine image is required' }),
    description: z.string().optional(),
})

export type CuisineFormData = z.infer<typeof cuisineValidationSchema>

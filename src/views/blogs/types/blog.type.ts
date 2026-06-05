import { z } from 'zod'

export interface Blog {
    id: string
    title: string
    content: string // markdown or rich text
    imageUrls: string[] // up to 5 images
    restaurantId: string
    authorOwner?: { id: string; name: string }
    authorStaff?: { id: string; name: string; role: string }
    linkedDish?: { id: string; name: string; price?: number }
    viewCount: number
    createdAt: string
    updatedAt: string
}

// export interface BlogFormData {
//     title: string
//     content: string
//     imageUrls: string[]
//     authorType: 'owner' | 'staff'
//     authorId?: string
//     linkedDishId?: string
// }

export const blogValidationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    // Accepts local File objects or structured objects representing existing cloud assets
    imageUrls: z
        .array(
            z.union([
                z.instanceof(File),
                z.object({ key: z.string(), url: z.string() }),
                z.string(), // Fallback string token matching primitive setups
            ]),
        )
        .max(5, 'Maximum 5 images allowed')
        .default([]),
    // imageUrls: z.array(z.string()).max(5, 'Maximum 5 images').default([]),
    // authorType: z.enum(['owner', 'staff']),
    // authorId: z.string().min(1, 'Please select an author'),
    linkedDishId: z.string().optional(),
    deletedImageKeys: z.array(z.string()).default([]),
})

export type BlogFormData = z.infer<typeof blogValidationSchema>

export interface TableQueries {
    pageIndex: number
    pageSize: number
    sort?: { order: 'asc' | 'desc'; key: string }
    query?: string
}

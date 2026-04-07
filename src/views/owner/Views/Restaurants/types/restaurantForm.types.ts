import { z } from 'zod'

export const restaurantValidationSchema = z.object({
    name: z.string().min(1, 'Restaurant name is required'),
    address: z.string().min(1, 'Address is required'),
    startingPrice: z.number().min(0, 'Starting price must be positive'),
    endingPrice: z.number().min(0, 'Ending price must be positive'),
    latitude: z
        .union([
            z.number(),
            z.string().transform((val) => (val === '' ? null : Number(val))),
        ])
        .nullable()
        .optional(),
    longitude: z
        .union([
            z.number(),
            z.string().transform((val) => (val === '' ? null : Number(val))),
        ])
        .nullable()
        .optional(),
    imageUrls: z
        .array(z.string())
        .min(3, 'Select at least 3 images')
        .default([]),
    staffIds: z.array(z.string()).default([]),
})

export type RestaurantFormSchema = z.infer<typeof restaurantValidationSchema>

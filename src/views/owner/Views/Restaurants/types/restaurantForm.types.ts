import { z } from 'zod'

export const restaurantValidationSchema = z.object({
    name: z.string().min(1, 'Restaurant name is required'),
    address: z.string().min(1, 'Address is required'),
    startingPrice: z.preprocess(
        (val) => Number(val),
        z.number().min(0, 'Starting price must be positive'),
    ),
    endingPrice: z.preprocess(
        (val) => Number(val),
        z.number().min(0, 'Ending price must be positive'),
    ),
    tax: z.preprocess(
        (val) => Number(val),
        z
            .number()
            .min(0, 'percentage cannot be over 0')
            .max(100, 'percentage cannot be over 100.'),
    ),
    latitude: z.preprocess(
        (val) => (val ? Number(val) : null),
        z.number().nullable().optional(),
    ),
    longitude: z.preprocess(
        (val) => (val ? Number(val) : null),
        z.number().nullable().optional(),
    ),

    /*
    startingPrice: z.coerce.number().min(0, 'Starting price must be positive'),
    endingPrice: z.coerce.number().min(0, 'Ending price must be positive'),
    tax: z.coerce
        .number()
        .min(0, 'percentage cannot be over 0')
        .max(100, 'percentage cannot be over 100.'),
    latitude: z.coerce.number().nullable().optional(),
    */
    // z
    //     .union([
    //         z.number(),
    //         z.string().transform((val) => (val === '' ? null : Number(val))),
    //     ])
    //     .nullable()
    //     .optional(),
    /*
    longitude: z.coerce.number().nullable().optional(),
    */
    // z
    //     .union([
    //         z.number(),
    //         z.string().transform((val) => (val === '' ? null : Number(val))),
    //     ])
    //     .nullable()
    logoImage: z.union([
        z.instanceof(File),
        z.object({ key: z.string(), url: z.string() }),
        z.string(),
    ]),
    images: z
        .array(
            z.union([
                z.instanceof(File),
                z.object({
                    key: z.string(),
                    url: z.string(),
                }),
            ]),
        )
        .min(3, 'Select at least 3 images'),

    deletedImageKeys: z.array(z.string()).default([]),
    // .default([]),
    staffIds: z.array(z.string()), //.default([]),
})

export type RestaurantFormSchema = z.infer<typeof restaurantValidationSchema>

export type RestaurantFormOutput = z.output<typeof restaurantValidationSchema>
export type RestaurantFormInput = z.input<typeof restaurantValidationSchema>

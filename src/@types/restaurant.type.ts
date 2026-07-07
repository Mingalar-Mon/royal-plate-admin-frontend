import { z } from 'zod'

export const restaurantValidationSchema = z.object({
    name: z.string().min(1, 'Restaurant name is required'),
    address: z.string().min(1, 'Address is required'),

    startingPrice: z.preprocess(
        (val: string | number | undefined | null) =>
            val === '' || val === null ? undefined : val,
        z.coerce
            .number({ error: 'Starting price is required.' })
            .min(1, 'Starting price must be positive'),
    ),

    // z.coerce
    //     .number<string | number>({error: "Starting price is required."})
    //     .min(0, 'Starting price must be positive'),
    // endingPrice: z.coerce
    //     .number<string | number>({error: 'Ending price is required.'})
    //     .min(0, 'Ending price must be positive'),

    endingPrice: z.preprocess(
        (val: string | number | undefined | null) =>
            val === '' || val === null ? undefined : val,
        z.coerce
            .number({ error: 'Ending price is required' })
            .min(1, 'Ending price must be positive'),
    ),

    tax: z.preprocess(
        (val: string | number | undefined | null) =>
            val === '' || val === null ? undefined : val,
        z.coerce
            .number({ error: 'Tax is required.' })
            .min(0, 'percentage cannot be less than 0')
            .max(100, 'percentage cannot be over 100.'),
    ),
    // tax: z.coerce
    //     .number<string | number>()
    //     .min(0, 'percentage cannot be less than 0')
    //     .max(100, 'percentage cannot be over 100.'),
    /*
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
    */
    latitude: z.preprocess(
        (val: string | number | undefined | null) => (val ? Number(val) : null),
        z.number(),
    ),
    longitude: z.preprocess(
        (val: string | number | undefined | null) => (val ? Number(val) : null),
        z.number(),
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

    logoImage: z.any().superRefine((val, ctx) => {
        if (val === undefined || val === null || val === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Logo image is required.',
            })
            return
        }

        const isFile = val instanceof File
        const isObject =
            typeof val === 'object' &&
            val !== null &&
            'key' in val &&
            'url' in val
        const isString = typeof val === 'string'

        if (!isFile && !isObject && !isString) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Logo must be a valid file, image link, or text path.',
            })
        }
    }),
    // logoImage: z
    //     .union([
    //         z.instanceof(File),
    //         z.object({ key: z.string(), url: z.string() }),
    //         z.string(),
    //     ]),
    // .refine((val) => val !== undefined && val !== null, {
    //     message: 'Logo image is required.',
    // }),
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
    // staffIds: z.array(z.string()), //.default([]),
})

export type RestaurantFormSchema = z.infer<typeof restaurantValidationSchema>

export type RestaurantFormOutput = z.output<typeof restaurantValidationSchema>
export type RestaurantFormInput = z.input<typeof restaurantValidationSchema>

import { z } from 'zod'

export const bannerValidationSchema = z
    .object({
        // Accepts binary files on upload, or an existing cloud asset map payload object
        image: z
            .union([
                z.instanceof(File),
                z.object({ key: z.string(), url: z.string() }),
                z.string(),
            ])
            .refine((val) => !!val, { message: 'Banner image is required' }),
        linkToRestaurant: z.string(), //.min(1, 'Restaurant ID is required'),
        type: z.enum(['in_app', 'external']),
    })
    .superRefine((data, ctx) => {
        // 1. Check if the field is completely empty first
        if (!data.linkToRestaurant) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    data.type === 'in_app'
                        ? 'Please select a restaurant'
                        : 'Website URL is required',
                path: ['linkToRestaurant'], // Attaches error to linkToRestaurant field
            })
            return
        }

        // 2. Conditional Type: Internal App Navigation (Expect UUID)
        if (data.type === 'in_app') {
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            if (!uuidRegex.test(data.linkToRestaurant)) {
                ctx.addIssue({
                    code: 'custom',
                    message:
                        'Invalid selection. Please choose a valid restaurant from the dropdown.',
                    path: ['linkToRestaurant'],
                })
            }
        }

        // 3. Conditional Type: External Campaign Redirect (Expect URL)
        if (data.type === 'external') {
            try {
                new URL(data.linkToRestaurant)
            } catch {
                ctx.addIssue({
                    code: 'custom',
                    message:
                        'Please enter a valid website address (e.g., https://example.com)',
                    path: ['linkToRestaurant'],
                })
            }
        }
    })

export type BannerFormData = z.infer<typeof bannerValidationSchema>

// =========== CRETE BANNER ===========
/*
{
    "success": true,
    "data": [
        {
            "linkToRestaurant": "b99b65ce-fef3-4fc1-aaf6-1e5c565eaa3a",
            "type": "in_app",
            "authorAdmin": {
                "id": "8e85db80-8022-4dcc-8b70-5f566d7a1ac8"
            },
            "id": "67e2b1a1-e985-40f0-8bf7-5ae1ca689b37",
            "image": {
                "key": "1779961961752-restaurant-1.png",
                "url": ""
            }
        }
    ],
    "message": "Banner created successfully."
}
*/

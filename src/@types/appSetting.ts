import { z } from 'zod'

// =========== APP SETTING ENTITY ===========
export type AppSettingType = 'TEXT' | 'PHONE' | 'URL' | 'HTML'

export interface AppSetting {
    id: string
    key: string
    value: string
    type: AppSettingType
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// =========== FORM / CREATE / UPDATE PAYLOAD ===========
export interface AppSettingFormData {
    key: string
    value: string
    type: AppSettingType
    isActive: boolean
}

export const appSettingValidationSchema = z.object({
    key: z
        .string()
        .min(1, { message: 'Key is required' })
        .trim()
        .toLowerCase()
        .regex(/^[a-z][a-zA-Z0-9-]*$/, {
            message:
                'Use camelCase / kebab-case (letters, numbers and hyphens only), e.g. termsAndConditions',
        }),
    // value can be plain text, a phone number, a URL, or HTML — "" is allowed
    value: z.string(),
    type: z.enum(['TEXT', 'PHONE', 'URL', 'HTML']),
    isActive: z.boolean(),
})

// Partial schema for PATCH — at least one field required (.min(1) equivalent).
// `key` is intentionally omitted: it is immutable once created.
export const appSettingUpdateSchema = z
    .object({
        value: z.string().optional(),
        type: z.enum(['TEXT', 'PHONE', 'URL', 'HTML']).optional(),
        isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided',
    })

export type AppSettingUpdateData = z.infer<typeof appSettingUpdateSchema>

// =========== API RESPONSES ===========
export type GetAppSettingResponse = {
    success: boolean
    data: AppSetting[]
    message: string
}

export type GetAppSettingDetailResponse = {
    success: boolean
    data: AppSetting
    message: string
}

// =========== LIST ===========
/*
{
    "success": true,
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "key": "termsAndConditions",
            "value": "<h1>Terms & Conditions</h1>",
            "type": "HTML",
            "isActive": true,
            "createdAt": "2026-09-01T01:06:00.535Z",
            "updatedAt": "2026-09-01T01:06:00.535Z"
        }
    ],
    "message": "Get Detail Data Successfully"
}
*/

// =========== CREATE ===========
/*
{
    "success": true,
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "key": "termsAndConditions",
        "value": "<h1>Terms & Conditions</h1>",
        "type": "HTML",
        "isActive": true
    },
    "message": "Created Successfully"
}
*/

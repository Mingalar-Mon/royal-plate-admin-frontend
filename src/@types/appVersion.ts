import { z } from 'zod'

// =========== APP VERSION ENTITY ===========
export interface AppVersion {
    id: string
    title: string
    body: string
    versionCode: number
    versionName: string
    playStoreLink: string
    iosLink: string
    directDownloadLink: string
    createdAt: string
    updatedAt: string
}

// =========== FORM / CREATE / UPDATE PAYLOAD ===========
export interface AppVersionFormData {
    title: string
    body: string
    versionCode: number
    versionName: string
    playStoreLink: string
    iosLink: string
    directDownloadLink: string
}

export const appVersionValidationSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    body: z.string().min(1, { message: 'Body is required' }),
    versionCode: z
        .number({ message: 'Version code is required' })
        .int('Version code must be a whole number')
        .nonnegative('Version code cannot be negative'),
    versionName: z.string().min(1, { message: 'Version name is required' }),
    playStoreLink: z.string(),
    iosLink: z.string(),
    directDownloadLink: z
        .string()
        .url({ message: 'Please enter a valid download URL' }),
})

// =========== API RESPONSES ===========
export type GetAppVersionResponse = {
    success: boolean
    data: AppVersion[]
    message: string
}

export type GetAppVersionDetailResponse = {
    success: boolean
    data: AppVersion
    message: string
}

// =========== GET LIST ===========
/*
{
    "success": true,
    "data": [
        {
            "id": "7a9bf543-b165-488a-a7bd-73620c98c7a0",
            "title": "testing",
            "body": "hello",
            "versionCode": 1,
            "versionName": "test01",
            "playStoreLink": "testPlaystoreurl",
            "iosLink": "testIOSUrl",
            "directDownloadLink": "testdirectdonwloadlink",
            "createdAt": "2026-08-17T01:06:00.535Z",
            "updatedAt": "2026-08-17T01:06:00.535Z"
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
        "id": "7a9bf543-b165-488a-a7bd-73620c98c7a0",
        "title": "testing",
        "body": "hello",
        "versionCode": 1,
        "versionName": "test01",
        "playStoreLink": "testPlaystoreurl",
        "iosLink": "testIOSUrl",
        "directDownloadLink": "testdirectdonwloadlink"
    },
    "message": "Created Successfully"
}
*/

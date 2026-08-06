import { Restaurant } from './restaurant'

export type SignInCredential = {
    email: string
    password: string
    fcmToken: string
}
export type SignInResponse = {
    success: boolean
    message: string
    data: {
        token: string
        user: {
            id: string
            name: string
            email: string
            phone: string | null
            role?: {
                name: string
                permissions?: any[]
            }
            // bmk's changes
            code?: string
            restaurant?: Omit<Restaurant, 'owner, staff, profile'>
        }
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    email: string
    password: string
    // bmk changes
    phone: string
    role: string
}

export type ForgotPassword = {
    email: string
}

export type VerifyOtp = {
    code: number
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
    isStaff?: {
        restaurantId: string
        restaurantName: string
    }
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}

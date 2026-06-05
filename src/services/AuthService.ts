import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    VerifyOtp,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'
import {
    PASSWORD,
    TOKEN_NAME_IN_STORAGE,
    USER_NAME,
} from '@/constants/api.constant'

export async function apiSignIn(data: SignInCredential, role: string) {
    let url = `/${role}${endpointConfig.signIn}`
    switch (role) {
        case 'staff':
            url = 'restaurant/staff/login'
    }

    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: url,
        method: 'post',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    const { role, ...credentialData } = data
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: `/${role}${endpointConfig.signUp}`,
        method: 'post',
        data: credentialData,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiVerifyOtp<T>(data: VerifyOtp) {
    const token = localStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.verifyOtp,
        method: 'post',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}

import apiClient from './client'

export interface LoginRequest {
    email: string
    password: string
}
export interface LoginResponse {
    success: boolean
    data: {
        id: string
        name: string
        email: string
        password: string
    }
    token: string
}

export interface AuthError {
    success: boolean
    message: string
}

// React - query version
/*
export const ownerAPI = {
    login: (body: LoginRequest) => apiClient.post('/owner/login', body),
}
    */

// SWR version
export async function apiOwnerLogin<T>(body: LoginRequest) {
    return apiClient.post<T>('/owner/login', body)
}

export const ownerAPI = {
    login: (body: LoginRequest) => apiClient.post('/owner/login', body),
}

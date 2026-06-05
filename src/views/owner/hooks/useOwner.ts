import { useMutation } from '@tanstack/react-query'
import { ownerAPI, LoginRequest, LoginResponse, AuthError } from '../api/owner'
import apiClient from '../api/client'
import { AxiosError } from 'axios'
import OneSignal from 'react-onesignal'

// type responseAPI = successResponse | failedResponse

export const useLoginOwner = () => {
    // const queryClient = useQueryClient()

    return useMutation<LoginResponse, AxiosError<AuthError>, LoginRequest>({
        mutationFn: async (body: LoginRequest) => {
            const response = await ownerAPI.login(body)
            return response
        },
        onSuccess: async (data: LoginResponse) => {
            console.log('Login successful:', data)
            await OneSignal.login(data.data.id)
            localStorage.setItem('token', data.token)
            localStorage.setItem('owner', JSON.stringify(data.data))
            apiClient.defaults.headers.common['Authorization'] =
                `Bearer ${data.token}`
        },
        onError: (error: AxiosError<AuthError>) => {
            console.error(error.message)
        },
    })
}

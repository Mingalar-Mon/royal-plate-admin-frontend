import axios from 'axios'

const axiosConfig = {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
}
const apiClient = axios.create(axiosConfig)

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/owner/login'
        }
        return Promise.reject(error)
    },
)

export default apiClient

export const swrFetcher = (url: string) => apiClient.get(url)

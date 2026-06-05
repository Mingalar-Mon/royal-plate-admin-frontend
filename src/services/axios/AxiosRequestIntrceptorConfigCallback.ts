import appConfig from '@/configs/app.config'
import {
    TOKEN_TYPE,
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_NAME_IN_STORAGE,
} from '@/constants/api.constant'
import type { InternalAxiosRequestConfig } from 'axios'

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    // 1. Check if this specific request is asking for Basic Auth
    // We use config.auth because Axios looks for this object to create Basic headers
    if (config.auth) {
        // If 'auth' is present, we skip adding the JWT header
        // to avoid sending two different Authorization headers.
        return config
    }

    // ADD THIS: Detect FormData and let the browser handle the header
    if (config.data instanceof FormData) {
        // Remove Content-Type so Axios/Browser doesn't force it to JSON
        delete config.headers['Content-Type']
    }
    const storage = appConfig.accessTokenPersistStrategy

    if (storage === 'localStorage' || storage === 'sessionStorage') {
        let accessToken = ''

        if (storage === 'localStorage') {
            accessToken = localStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
        }

        if (storage === 'sessionStorage') {
            accessToken = sessionStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
        }

        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] =
                `${TOKEN_TYPE}${accessToken}`
        }
    }

    return config
}

export default AxiosRequestIntrceptorConfigCallback

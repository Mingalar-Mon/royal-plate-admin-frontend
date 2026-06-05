import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useOneSignal } from './utils/custom-hooks/useOneSignal'
import { useEffect } from 'react'
import { generateToken, messaging } from './notifications/firebase'
import { onMessage } from 'firebase/messaging'
import { Toaster } from 'react-hot-toast'
import toast, { Toast } from './components/ui/toast/toast'
import { Notification } from './components/ui'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
            retryOnMount: false,
        },
    },
})

// const notify = () => toast('Here is your toast')

function App() {
    useEffect(() => {
        generateToken()
        onMessage(messaging, (payload) => {
            console.log(payload)
            // title = payload.notification.title
            // body = payload.notification.body
            // image = payload.notification.image
            toast.push(
                <Notification
                    title={payload.notification?.title}
                    type="info"
                    customIcon={<img src={payload.notification?.image} />}
                >
                    {payload.notification?.body}
                </Notification>,
            )
        })
    }, [])
    // useOneSignal() // Initialize OneSignal for the entire app
    return (
        <QueryClientProvider client={queryClient}>
            <Theme>
                <BrowserRouter>
                    <AuthProvider>
                        <Layout>
                            <Views />
                        </Layout>
                    </AuthProvider>
                </BrowserRouter>
            </Theme>
        </QueryClientProvider>
    )
}

export default App

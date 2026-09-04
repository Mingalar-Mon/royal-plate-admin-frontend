import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useOneSignal } from './utils/custom-hooks/useOneSignal'
import { useEffect } from 'react'
import { messaging } from './notifications/firebase'
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

const notificationAudioUrl = '/notification.wav'

const playNotificationSound = () => {
    try {
        const audio = new Audio(notificationAudioUrl)
        audio.volume = 0.6
        audio.play().catch(() => {
            // ignore autoplay-block until the user has interacted with the page
        })
    } catch {
        // ignore
    }
}

function App() {
    useEffect(() => {
        onMessage(messaging, (payload) => {
            console.log(payload)
            const title = payload.notification?.title ?? ''
            const body = payload.notification?.body ?? ''
            const image = payload.notification?.image

            const type = payload.data?.type

            if (type === 'order') {
                queryClient.invalidateQueries({ queryKey: ['orders'] })
            } else if (type === 'reservation') {
                queryClient.invalidateQueries({ queryKey: ['reservations'] })
            }

            // Detect event type from the notification title/body for appropriate styling
            const titleLower = title.toLowerCase()
            const bodyLower = body.toLowerCase()
            const isOrder = titleLower.includes('order') || bodyLower.includes('order')
            const isReservation = titleLower.includes('reservation') || bodyLower.includes('reservation')

            let notifType: 'info' | 'success' | 'warning' | 'danger' = 'info'
            if (titleLower.includes('cancel') || bodyLower.includes('cancel')) {
                notifType = 'danger'
            } else if (titleLower.includes('confirm') || bodyLower.includes('confirm') || titleLower.includes('complete') || bodyLower.includes('complete')) {
                notifType = 'success'
            } else if (titleLower.includes('pending') || bodyLower.includes('pending') || isOrder || isReservation) {
                notifType = 'warning'
            }

            toast.push(
                <Notification
                    title={title}
                    type={notifType}
                    closable
                    duration={6000}
                    customIcon={image ? <img src={image} className="w-8 h-8 rounded-lg object-cover" alt="" /> : undefined}
                >
                    {body}
                </Notification>,
            )

            playNotificationSound()
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

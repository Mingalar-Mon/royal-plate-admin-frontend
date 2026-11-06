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
import toast from './components/ui/toast/toast'
import { Notification } from './components/ui'
import { notificationQueue } from './utils/notificationQueue'
import type { NotificationTier } from './@types/notification'

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

function classifyNotificationTier(
    type: string | undefined,
    title: string,
    body: string,
): NotificationTier {
    const titleLower = title.toLowerCase()
    const bodyLower = body.toLowerCase()

    if (type === 'order' && (titleLower.includes('new') || bodyLower.includes('new'))) {
        return 'critical'
    }
    if (titleLower.includes('cancel') || bodyLower.includes('cancel')) {
        return 'critical'
    }
    if (type === 'order' || type === 'reservation') {
        return 'important'
    }
    return 'info'
}

function getTierDuration(tier: NotificationTier): number {
    const config = notificationQueue.getTierConfig(tier)
    return config.duration
}

function App() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope)
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error)
                })
        }

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

            const tier = classifyNotificationTier(type, title, body)
            const duration = getTierDuration(tier)

            let notifType: 'info' | 'success' | 'warning' | 'danger' = 'info'
            const titleLower = title.toLowerCase()
            const bodyLower = body.toLowerCase()

            if (titleLower.includes('cancel') || bodyLower.includes('cancel')) {
                notifType = 'danger'
            } else if (titleLower.includes('confirm') || bodyLower.includes('confirm') || titleLower.includes('complete') || bodyLower.includes('complete')) {
                notifType = 'success'
            } else if (titleLower.includes('pending') || bodyLower.includes('pending')) {
                notifType = 'warning'
            }

            toast.push(
                <Notification
                    title={title}
                    type={notifType}
                    closable
                    duration={duration}
                    tier={tier}
                    customIcon={image ? <img src={image} className="w-8 h-8 rounded-lg object-cover" alt="" /> : undefined}
                >
                    {body}
                </Notification>,
            )

            notificationQueue.playSound(tier)
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

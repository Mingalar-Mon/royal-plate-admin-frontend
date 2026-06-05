// hooks/useOneSignal.ts
import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

// Global flag to prevent concurrent initialization calls in Strict Mode
let isInitializing = false

export const useOneSignal = () => {
    useEffect(() => {
        const initOneSignal = async () => {
            // Check both our local flag and OneSignal's internal state
            // if (isInitializing || OneSignal.initialized) {
            //     console.log(
            //         'OneSignal already initialized or initializing, skipping.',
            //     )
            //     return
            // }

            // isInitializing = true

            try {
                await OneSignal.init({
                    appId: '35f6bcfd-8cb5-4c6b-bce0-1f8231ea1dc9',
                    allowLocalhostAsSecure: true,
                    // serviceWorkerPath: 'OneSignalSDKWorker.js',
                    // serviceWorkerParam: { scope: '/' },
                })
                console.log('OneSignal Initialized successfully')
                await OneSignal.Slidedown.promptPush()
                await OneSignal.Notifications.requestPermission()
            } catch (error) {
                console.error('OneSignal Initialization Error:', error)
            } finally {
                await OneSignal.Slidedown.promptPush()
                await OneSignal.Notifications.requestPermission()
                isInitializing = false
            }
        }

        initOneSignal()

        // Handler function for foreground notifications
        const handleForegroundNotification = (event: any) => {
            console.log(
                'Notification received in real-time!',
                event.notification,
            )
            alert(`In-App Notification Received:\n${event.notification.title}`)
        }

        OneSignal.Notifications.addEventListener(
            'foregroundWillDisplay',
            handleForegroundNotification,
        )

        return () => {
            OneSignal.Notifications.removeEventListener(
                'foregroundWillDisplay',
                handleForegroundNotification,
            )
        }
    }, [])
}

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

console.log('[SW] Service Worker starting...')

try {
    firebase.initializeApp({
        apiKey: 'AIzaSyDIZYYvFMhPSfhzdLaigt0v_10UgpOqLgY',
        authDomain: 'snake-fc8a3.firebaseapp.com',
        projectId: 'snake-fc8a3',
        storageBucket: 'snake-fc8a3.firebasestorage.app',
        messagingSenderId: '277463666297',
        appId: '1:277463666297:web:8a68312676620e95644ea8',
        measurementId: 'G-1RKBYXS35B',
    })
    console.log('[SW] Firebase initialized successfully')

    const messaging = firebase.messaging()
    console.log('[SW] Firebase messaging ready')

    messaging.onBackgroundMessage((payload) => {
        console.log('[SW] Received background message:', payload)

    const notificationTitle = payload.notification?.title || 'New Notification'
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.image || '/favicon.png',
        badge: '/favicon.png',
        tag: payload.data?.type || 'default',
        requireInteraction: payload.data?.type === 'order',
        data: {
            type: payload.data?.type,
            url: payload.data?.url || '/',
        },
    }

        self.registration.showNotification(notificationTitle, notificationOptions)
        console.log('[SW] Notification displayed:', notificationTitle)
    })

    self.addEventListener('notificationclick', (event) => {
        console.log('[SW] Notification clicked:', event.notification.title)

        event.notification.close()

        const urlToOpen = event.notification.data?.url || '/'

        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        console.log('[SW] Focusing existing window')
                        return client.focus()
                    }
                }
                if (clients.openWindow) {
                    console.log('[SW] Opening new window:', urlToOpen)
                    return clients.openWindow(urlToOpen)
                }
            })
        )
    })
} catch (error) {
    console.error('[SW] Firebase initialization failed:', error)
}

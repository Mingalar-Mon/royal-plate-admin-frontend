importScripts('https://www.googleapis.com/firebasejs/v10.7.0/firebase-app-compat.js')
importScripts('https://www.googleapis.com/firebasejs/v10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
    apiKey: 'AIzaSyDIZYYvFMhPSfhzdLaigt0v_10UgpOqLgY',
    authDomain: 'snake-fc8a3.firebaseapp.com',
    projectId: 'snake-fc8a3',
    storageBucket: 'snake-fc8a3.firebasestorage.app',
    messagingSenderId: '277463666297',
    appId: '1:277463666297:web:8a68312676620e95644ea8',
    measurementId: 'G-1RKBYXS35B',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload)

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
})

self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click:', event)

    event.notification.close()

    const urlToOpen = event.notification.data?.url || '/'

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus()
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen)
            }
        })
    )
})

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// import { useOneSignal } from './utils/custom-hooks/useOneSignal'
// import OneSignal from 'react-onesignal'

// initialize OneSignal before rendering the app
// OneSignal.init({
//     appId: '35f6bcfd-8cb5-4c6b-bce0-1f8231ea1dc9',
//     allowLocalhostAsSecureOrigin: true,
//     serviceWorkerPath: 'OneSignalSDKWorker.js',
//     serviceWorkerParam: { scope: '/' },
//     // notifyButton: {
//     //     enable: true,
//     // },
// })
//     .then(() => {
//         console.log('OneSignal Initialized')
//         OneSignal.Notifications.requestPermission()
//     })
//     .catch((error) => {
//         console.error('OneSignal Initialization Error:', error)
//     })

// OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
//     console.log(
//         'Frontend received a notification in real-time!',
//         event.notification,
//     )

//     // Extract data from the notification payload
//     const title = event.notification.title
//     const body = event.notification.body

//     // Trigger an in-app UI action (e.g., custom alert box, update a counter, refresh a table)
//     alert(`In-App Notification Received:\n${title}\n${body}`)

//     // Optional: If you want to prevent the default system banner from popping up because you built a custom UI banner:
//     // event.preventDefault();
// })
// useOneSignal()
ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
)

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, getToken } from 'firebase/messaging'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAuJT8TNJYyVQo0BFfbhClnn1K_rseAReI',
    authDomain: 'royal-plate-dev.firebaseapp.com',
    projectId: 'royal-plate-dev',
    storageBucket: 'royal-plate-dev.firebasestorage.app',
    messagingSenderId: '174890249754',
    appId: '1:174890249754:web:347802bf3876049d20eba3',
    measurementId: 'G-PE7GLJCSX5',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)
const analytics = getAnalytics(app)

export const generateToken = async () => {
    const permission = await Notification.requestPermission()
    console.log(permission)
    if (permission === 'granted') {
        const token = await getToken(messaging, {
            vapidKey:
                'BI4mkIQxxuwfdpeKZwpjev8vy7jRGxD3h35GeFoEeTVeiHsRoCAnCVwMLqiTWqGoTg8Tinjxc3XTax5q9i53eWw',
        })

        console.log(token)
    }
}

export const getDeviceToken = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission()

        if (permission !== 'granted') return null

        const token = await getToken(messaging, {
            vapidKey:
                'BI4mkIQxxuwfdpeKZwpjev8vy7jRGxD3h35GeFoEeTVeiHsRoCAnCVwMLqiTWqGoTg8Tinjxc3XTax5q9i53eWw',
        })

        if (token) {
            return token
        } else {
            console.warn(
                'No registration token available. Request permission to generate one.',
            )
            return null
        }
    } catch (error) {
        console.error('An error occurred while retrieving token:', error)
        return null
    }
}

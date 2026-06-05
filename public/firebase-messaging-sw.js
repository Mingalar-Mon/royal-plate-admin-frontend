importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyAuJT8TNJYyVQo0BFfbhClnn1K_rseAReI',
    authDomain: 'royal-plate-dev.firebaseapp.com',
    projectId: 'royal-plate-dev',
    storageBucket: 'royal-plate-dev.firebasestorage.app',
    messagingSenderId: '174890249754',
    appId: '1:174890249754:web:347802bf3876049d20eba3',
    measurementId: 'G-PE7GLJCSX5',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging(firebaseApp);
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  // Update OS/PWA badge if the browser supports it
  // The backend passes data fields as strings, parse it safely

  const badgeCount = parseInt(payload.data?.badgeCount || '1', 10);
  if('setAppBadge' in navigator) {
    navigator.setAppBadge(badgeCount).catch(err => console.error("Error setting app badge: ", err))
  }

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});


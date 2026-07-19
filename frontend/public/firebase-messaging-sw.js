// Firebase Cloud Messaging Service Worker
// This file is required for Firebase messaging to work in the background

// Import Firebase scripts - using version compatible with your package.json (v12.3.0)
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyCdGeftdevnqryMD9N9TKD8FK_Dxuzsri4",
  authDomain: "cloudbase-test-4b3c5.firebaseapp.com",
  databaseURL: "https://cloudbase-test-4b3c5-default-rtdb.firebaseio.com",
  projectId: "cloudbase-test-4b3c5",
  storageBucket: "cloudbase-test-4b3c5.firebasestorage.app",
  messagingSenderId: "24406623648",
  appId: "1:24406623648:web:880401b9a88cb7c501d0c5",
  measurementId: "G-KWB3CS1910",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Extract notification data
  const notificationTitle = payload.notification.title || 'New Message';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/logo192.png', // You can customize this icon
    badge: '/logo192.png',
    tag: 'notification-tag',
    data: payload.data
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Handle the click action - you can customize this
  event.waitUntil(
    clients.openWindow('/')
  );
});

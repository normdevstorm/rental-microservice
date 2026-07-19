// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import localStorageService from "./localStorageService";
import { GlobalAlertApi } from "../components/AlertDialog/AlertProvider";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseCerts =
  "BCxVKLu3OfwlS28iHCJh1BTPHgx3TkfdWHDvLFKFqPi_r3ZMBGPUT3cdqLTmocpKWhmc-CO93GbVvlc0E9qfHGs";
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

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

export const requestPermission = async () => {
  console.log("Requesting permission...");
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
  } else {
    console.log("Unable to get permission to notify.");
  }
};
export const messaging = getMessaging();
export const onMessageListener = ({
  alertDialog,
}: {
  alertDialog: GlobalAlertApi;
}) => {
  return onMessage(messaging, (payload) => {
    alertDialog.notify(
      payload.notification?.title + " : " + payload.notification?.body
    );
  });
};
// Function to initialize Firebase messaging with proper error handling
export const initializeFirebaseMessaging = async () => {
  try {
    // Request permission for notifications first
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get registration token with service worker
      const currentToken = await getToken(messaging, {
        vapidKey: firebaseCerts,
        serviceWorkerRegistration: await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        ),
      });

      if (currentToken) {
        console.log("Current token for client: ", currentToken);
        localStorageService.setLocalStorage("fcmToken", currentToken);
        // Send the token to your server and update the UI if necessary
        return currentToken;
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        return null;
      }
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

// Don't initialize automatically - let components call when needed
// initializeFirebaseMessaging();

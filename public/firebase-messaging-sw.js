importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js')
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDSTjQrKlChioa9j04vsXvrMg5RHwh2S0M",
    authDomain: "onthefood-s.firebaseapp.com",
    projectId: "onthefood-s",
    storageBucket: "onthefood-s.appspot.com",
    messagingSenderId: "521061958570",
    appId: "1:521061958570:web:1b2edfc096aec1385f21d3",
    measurementId: "G-21R742NXQ9"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
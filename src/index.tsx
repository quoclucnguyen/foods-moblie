import React from 'react'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from 'firebase/messaging'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSTjQrKlChioa9j04vsXvrMg5RHwh2S0M",
  authDomain: "onthefood-s.firebaseapp.com",
  projectId: "onthefood-s",
  storageBucket: "onthefood-s.appspot.com",
  messagingSenderId: "521061958570",
  appId: "1:521061958570:web:1b2edfc096aec1385f21d3",
  measurementId: "G-21R742NXQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);
getToken(messaging, {
  vapidKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
}).then(token => {
  console.log(token)
  localStorage.setItem('tokenFcm', token)
  localStorage.setItem('updateTokenTimes', new Date().toLocaleString())
});




ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider locale={enUS}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

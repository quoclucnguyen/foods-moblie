import React from 'react'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'

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

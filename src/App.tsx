import React, { createContext, useContext, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Button } from 'antd-mobile'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/dashboard'
import LoginLayout from './layouts/LoginLayout'
import Login from './pages/Login'
import FoodItems from './pages/food-items'
import {
  AuthContextType,
  NotificationAlert,
  NotificationAlertContextType,
  UserLogin,
} from './interfaces'
import {
  getUserLogin,
  removeUserLogin,
  setUserLogin,
} from './util/localStorageHelper'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { initializeApp } from "firebase/app"
import { getMessaging, onMessage } from 'firebase/messaging'
import Notifications from './pages/notifications'
import Settings from './pages/settings'
/**
 * Auth provider
 */
const authProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    authProvider.isAuthenticated = true
    callback()
  },
  signout(callback: VoidFunction) {
    authProvider.isAuthenticated = false
    removeUserLogin()
    callback()
  },
}

const AuthContext = createContext<AuthContextType>(null!)
const NotificationAlertContext = createContext<NotificationAlertContextType>(
  null!,
)
function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = useState<UserLogin | null>(getUserLogin())

  let signin = (newUser: UserLogin, callback: VoidFunction) => {
    return authProvider.signin(() => {
      setUserLogin(newUser)
      setUser(newUser)
      callback()
    })
  }

  let signout = (callback: VoidFunction) => {
    return authProvider.signout(() => {
      setUser(null)
      callback()
    })
  }
  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}
function NotificationAlertProviver({
  children,
}: {
  children: React.ReactNode
}) {
  let [alert, setNotification] = useState<NotificationAlert | null>(null)

  let setNotificationAlert = (notification: NotificationAlert) => {
    setNotification(notification)
  }
  return (
    <NotificationAlertContext.Provider value={{ alert, setNotificationAlert }}>
      {children}
    </NotificationAlertContext.Provider>
  )
}

/**
 * isHasUnReadNotification Context
 */
interface IsHasUnReadNotificationContextType {
  isHasUnRead: boolean,
  set: (value: boolean) => void,
}
const IsHasUnReadNotificationContext = createContext<IsHasUnReadNotificationContextType>(null!)
const isHasUnReadNotificationProvider = {
  isHasUnReadNotification: false,
  set(value: boolean) {
    isHasUnReadNotificationProvider.isHasUnReadNotification = value
  }
}
function IsHasUnReadNotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  let [isHasUnRead, setisHasUnRead] = useState<boolean>(false)

  let set = (value: boolean) => {
    setisHasUnRead(value)
  }
  return (
    <IsHasUnReadNotificationContext.Provider value={{ isHasUnRead, set }}>
      {children}
    </IsHasUnReadNotificationContext.Provider>
  )
}
export function useAuth() {
  return useContext(AuthContext)
}

export function useNotificationAlert() {
  return useContext(NotificationAlertContext)
}
export function useIsHasUnReadNotification() {
  return useContext(IsHasUnReadNotificationContext)
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth()
  let location = useLocation()

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_DOMAIN + '/graphql',
})

/**
 *
 */
const authLink = setContext((_, { headers }) => {
  const userLogin = getUserLogin()
  return {
    headers: {
      ...headers,
      authorization: userLogin ? `Bearer ${userLogin.token}` : '',
    },
  }
})

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const navigate = useNavigate()
  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            // Apollo Server sets code to UNAUTHENTICATED
            case 'UNAUTHENTICATED':
              console.log('UNAUTHENTICATED')
              authProvider.signout(() => {
                removeUserLogin()
                setIsAuthenticated(false)
              })
          }
        }
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`)
      }
    },
  )
  const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  })

  useEffect(() => {
    if (!isAuthenticated) {
      authProvider.signout(() => {
        navigate('/login', { state: { from: 'somewhere' } })
      })
    }
  }, [isAuthenticated])
  
  return (
    <AuthProvider>
      <NotificationAlertProviver>
        <IsHasUnReadNotificationProvider>
          <ApolloProvider client={client}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="food-items"
                  element={
                    <RequireAuth>
                      <FoodItems />
                    </RequireAuth>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <RequireAuth>
                      <Notifications />
                    </RequireAuth>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />
              </Route>
              <Route path="/login" element={<LoginLayout />}>
                <Route index element={<Login />} />
              </Route>
            </Routes>
          </ApolloProvider>
        </IsHasUnReadNotificationProvider>
      </NotificationAlertProviver>
    </AuthProvider>
  )
}
export default App

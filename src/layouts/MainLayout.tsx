import { NavBar, TabBar } from 'antd-mobile'
import {
  AppOutline,
  BellOutline,
  MessageOutline,
  SetOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import React, { FC } from 'react'
import { Outlet, Router, useLocation, useNavigate } from 'react-router'

const Bottom: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value: string) => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/',
      title: 'Dashboard',
      icon: <AppOutline />,
    },
    {
      key: '/food-items',
      title: 'Food Items',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/notifications',
      title: 'Notifications',
      icon: <BellOutline />,
    },
    {
      key: '/settings',
      title: 'Settings',
      icon: <SetOutline />,
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

function MainLayout() {
  return (
    <div className="app">
      <div className="top"></div>
      <div className="body">
        <Outlet />
      </div>

      <div className="bottom">
        <Bottom />
      </div>
    </div>
  )
}

export default MainLayout

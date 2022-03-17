import React from 'react'
import { Outlet } from 'react-router'

function LoginLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default LoginLayout

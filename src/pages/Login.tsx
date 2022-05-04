import { Button, Form, Input } from 'antd-mobile'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../App'
import { useLocation, useNavigate } from 'react-router'
import { getUserLogin } from '../util/localStorageHelper'
import { LoginResult, UserLogin } from '../interfaces'

function Login() {
  /**
   * Begin const
   */
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const userLogin = getUserLogin()
  /**
   *
   * End const
   */

  /**
   * Begin process
   */
  const onFinish = async (values: any) => {
    const request = await axios.post<LoginResult>(
      process.env.REACT_APP_DOMAIN + '/auth/login',
      {
        ...values,
        deviceId: localStorage.getItem('tokenFcm') || '',
        type: 'WEB',
      },
    )
    if (request.status === 200 && request?.data?.accessToken) {
      const userLogin: UserLogin = {
        username: request?.data?.username,
        displayName: request?.data?.displayName,
        token: request?.data?.accessToken,
        role: request?.data?.role,
      }
      auth.signin(userLogin, () => {
        navigate('/', { replace: true })
      })
    }
  }
  /**
   * End process
   */
  useEffect(() => {
    if (userLogin) {
      auth.signin(userLogin, () => {
        navigate('/', { replace: true })
      })
    }
  })

  return (
    <div>
      
      <Form
        onFinish={onFinish}
        footer={
          <Button block type="submit" size="large" color="primary">
            Login
          </Button>
        }
      >
        <Form.Header>Login (user/123456 for demo)</Form.Header>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input placeholder="Input username" type="text" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input placeholder="Input password" type="password" />
        </Form.Item>

      </Form>
      
    </div>
  )
}

export default Login

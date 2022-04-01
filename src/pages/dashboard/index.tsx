import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useIsHasUnReadNotification } from '../../App'
import { IS_HAS_UN_READ_NOTIFICATION } from './graphql'
import { IsHasUnreadNotificationQueryResult } from './interface'

function Dashboard() {
  const isHasUnReadNotification = useIsHasUnReadNotification()
  const { data, loading } = useQuery<IsHasUnreadNotificationQueryResult>(IS_HAS_UN_READ_NOTIFICATION)
  useEffect(() => {
    isHasUnReadNotification.set(data?.isHasUnreadNotification ?? false)
  }, [data])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
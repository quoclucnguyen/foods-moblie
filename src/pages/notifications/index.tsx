import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  AutoCenter,
  Badge,
  Button,
  DatePicker,
  Dialog,
  DotLoading,
  FloatingBubble,
  Form,
  InfiniteScroll,
  Input,
  List,
  Popup,
  PullToRefresh,
  Selector,
  SwipeAction,
  Switch,
  Toast,
} from 'antd-mobile'
import {
  AddCircleOutline,
  AddOutline,
  GiftOutline,
  MessageFill,
} from 'antd-mobile-icons'
import { FormInstance } from 'antd-mobile/es/components/form'
import React, { useEffect, useState } from 'react'
import { useIsHasUnReadNotification } from '../../App'
import {
  GET_LIST_NOTIFICATION, UPDATE_NOTIFICATION,
} from './graphql'
import { NotificationEntity, NotificationPaginationInput, NotificationQueryResult, NotificationStatus } from './interface'

function Notifications() {

  const [hasMore, setHasMore] = useState(true)
  const [dataSource, setDataSource] = useState<NotificationEntity[]>([])
  const [queryPagination, setQueryPagination] = useState<
    NotificationPaginationInput
  >({
    take: 10,
  })
  const isHasUnReadNotification = useIsHasUnReadNotification()

  /**
   * BEGIN graphql
   */

  /**
   * Get list food item
   */
  const [
    getListNotification,
    { loading: getListNotificationLoading, data: foodItemData },
  ] = useLazyQuery<NotificationQueryResult>(GET_LIST_NOTIFICATION)



  /**
   * Update notification status
   */
  const [
    updateNotification,
    { loading: updateNotificationLoading, error: updateNotificationError },
  ] = useMutation(UPDATE_NOTIFICATION)

  /**
   * END graphql
   */
  useEffect(() => {
    const unReadNotification = dataSource.find(item => item.status === NotificationStatus.NEW)
    if (unReadNotification) {
      isHasUnReadNotification.set(true)
    } else {
      isHasUnReadNotification.set(false)
    }
  }, [dataSource])

  async function loadMore(pagination?: NotificationPaginationInput) {
    if (pagination) {
      setQueryPagination(pagination)
      const result = await getListNotification({
        variables: {
          pagination: {
            ...queryPagination,
            skip: 0,
          },
        },
      })

      if (result.data?.notifications) {
        setDataSource([...(result.data?.notifications?.items ?? [])])
        setHasMore(dataSource.length < result.data.notifications.total)
      }
    } else {
      setQueryPagination({
        ...queryPagination,
        skip: dataSource.length,
      })
      const result = await getListNotification({
        variables: {
          pagination: {
            ...queryPagination,
            skip: dataSource.length,
          },
        },
      })
      if (result.data?.notifications) {
        setDataSource([...dataSource, ...(result.data?.notifications?.items ?? [])])
        setHasMore(dataSource.length < result.data.notifications.total)
      }
    }
  }

  return (
    <div style={{ width: '100%' }}>

      {/**
       * Hiển thị danh sách food items
       */}
      <PullToRefresh
        onRefresh={async () => {
          setQueryPagination({
            ...queryPagination,
            skip: 0,
          })

          const data = await getListNotification({
            variables: {
              pagination: {
                ...queryPagination,
                skip: 0,
              },
            },
          })
          if (data?.data?.notifications) {
            setDataSource(data.data.notifications.items)
          }
        }}
        pullingText="Pull to refresh"
        refreshingText="Refreshing..."
        completeText="Refresh complete"
        canReleaseText="Release to refresh"
      >
        <List header="Notifications" style={{ width: '100%' }}>
          {dataSource?.map((item) => {
            const createdDate = new Date(
              item?.createdAt ?? '',
            ).toLocaleDateString()
            return (
              <SwipeAction
                key={item.id}
                leftActions={
                  item.status === NotificationStatus.NEW ? [] :
                    [
                      {
                        key: 'UNREAD',
                        text: 'Unread',
                        onClick: async () => {
                          await updateNotification({
                            variables: {
                              updateNotificationInput: {
                                id: item.id,
                                status: NotificationStatus.NEW,
                              },
                            },
                          })
                          const id = dataSource.findIndex(
                            (foodItem) => foodItem?.id === item.id,
                          )
                          const itemUpdate = {
                            ...dataSource[id],
                            status: NotificationStatus.NEW.toString(),
                          }
                          const list = dataSource.filter(
                            (notification) => notification?.id !== item.id,
                          )
                          list.splice(id, 0, itemUpdate)
                          setDataSource(list)
                          Toast.show({
                            icon: 'success',
                            content: 'Update successfully',
                          })
                        },
                        color: 'success',

                      }
                    ]}

              >
                <List.Item
                  key={item.id}
                  description={createdDate}
                  className={item.status === NotificationStatus.READ ? '' : 'bg-slate-200'}
                  onClick={async () => {
                    if (item.status === NotificationStatus.NEW) {
                      Toast.show({
                        icon: 'loading',
                        content: 'Loading...',
                      })
                      const updateNotificationMutation = await updateNotification({
                        variables: {
                          updateNotificationInput: {
                            id: item.id,
                            status: NotificationStatus.READ,
                          },
                        }
                      })
                      if (updateNotificationMutation.data) {
                        const id = dataSource.findIndex(
                          (foodItem) => foodItem?.id === item.id,
                        )
                        const itemUpdate = {
                          ...dataSource[id],
                          status: NotificationStatus.READ.toString(),
                        }
                        const list = dataSource.filter(
                          (notification) => notification?.id !== item.id,
                        )
                        list.splice(id, 0, itemUpdate)
                        setDataSource(list)
                        Toast.show({
                          icon: 'success',
                          content: 'Success',
                        })
                      }
                    }
                  }}
                >
                  <span className="font-bold text-gray-500">
                    {item?.title}
                  </span>
                  <br />
                  <span
                    className='text-sm'
                  >
                    {item?.message}
                  </span>
                </List.Item>
              </SwipeAction>
            )
          })}
        </List>
      </PullToRefresh>
      <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
        {hasMore ? (
          <>
            <span>Loading</span>
            <DotLoading />
          </>
        ) : (
          <span>End</span>
        )}
      </InfiniteScroll>
    </div>
  )
}

export default Notifications

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
import {
  ADD_FOOD_ITEM,

  GET_LIST_LOCATION,
  GET_LIST_NOTIFICATION,
  UPDATE_FOOD_ITEM,
} from './graphql'
import { NotificationEntity, NotificationPaginationInput, NotificationQueryResult, NotificationStatus } from './interface'

function Notifications() {
  const addFoodItemFormRef = React.useRef<FormInstance>(null)
  const updateFoodItemFormRef = React.useRef<FormInstance>(null)
  const [hasMore, setHasMore] = useState(true)
  const [addFoodItemVisible, setAddFoodItemVisible] = useState(false)
  const [updateFoodItemVisible, setUpdateFoodItemVisible] = useState(false)
  const [dateEndVisible, setDateEndVisible] = useState(false)
  const [dataSource, setDataSource] = useState<NotificationEntity[]>([])
  const [queryPagination, setQueryPagination] = useState<
    NotificationPaginationInput
  >({
    take: 10,
  })
  const [isUpdatingFoodItem, setIsUpdatingFoodItem] = useState(false)
  /**
   * If isUpdatingFoodItem is true, then we are updating a food item
   * We open popup and form to update food item
   */
  useEffect(() => {
    if (isUpdatingFoodItem) {
      setUpdateFoodItemVisible(true)
      updateFoodItemFormRef.current?.resetFields()
    } else {
      setUpdateFoodItemVisible(false)
      updateFoodItemFormRef.current?.resetFields()
    }
  }, [isUpdatingFoodItem])

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
   * Update food item
   */
  const [
    updateFoodItem,
    { loading: updateFoodItemLoading, error: updateFoodItemError },
  ] = useMutation(UPDATE_FOOD_ITEM)

  /**
   * END graphql
   */

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
                  item.status === NotificationStatus.READ ? [] :
                    [
                      {
                        key: 'UNREAD',
                        text: 'Unread',
                        onClick: async () => {
                          await updateFoodItem({
                            variables: {
                              updateFoodItemInput: {
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
                            status: NotificationStatus.READ.toString(),
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
                  prefix={<GiftOutline />}
                >
                  <span className="text-sm font-bold text-gray-500">
                    {item?.title}
                  </span>
                  <br />
                  <span
                    className={item.status === NotificationStatus.READ ? 'line-through' : ''}
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

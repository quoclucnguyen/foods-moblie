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
  GET_LIST_FOOD_ITEMS,
  GET_LIST_LOCATION,
  UPDATE_FOOD_ITEM,
} from './graphql'
import {
  FoodItemEntity,
  FoodItemsPaginationInput,
  FoodItemsQueryResult,
  FoodItemStatus,
  LocationQueryResult,
} from './interface'

function FoodItems() {
  const addFoodItemFormRef = React.useRef<FormInstance>(null)
  const [hasMore, setHasMore] = useState(true)
  const [addFoodItemVisible, setAddFoodItemVisible] = useState(false)
  const [dateEndVisible, setDateEndVisible] = useState(false)
  const [dataSource, setDataSource] = useState<FoodItemEntity[]>([])
  const [queryPagination, setQueryPagination] = useState<
    FoodItemsPaginationInput
  >({
    take: 10,
  })
  /**
   * BEGIN graphql
   */

  /**
   * Get list food item
   */
  const [
    getListFoodItem,
    { loading: getListFoodItemLoading, data: foodItemData },
  ] = useLazyQuery<FoodItemsQueryResult>(GET_LIST_FOOD_ITEMS)

  /**
   * Get list location
   */
  const { loading: getListLocationLoading, data: locations } = useQuery<
    LocationQueryResult
  >(GET_LIST_LOCATION)

  /**
   * Add food item
   */
  const [
    addFoodItem,
    { loading: addFoodItemLoading, error: addFoodItemError },
  ] = useMutation(ADD_FOOD_ITEM)

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

  async function loadMore(pagination?: FoodItemsPaginationInput) {
    if (pagination) {
      setQueryPagination(pagination)
      const result = await getListFoodItem({
        variables: {
          pagination: {
            ...queryPagination,
            skip: 0,
          },
        },
      })

      if (result.data?.foodItems) {
        setDataSource([...(result.data?.foodItems?.items ?? [])])
        setHasMore(dataSource.length < result.data.foodItems.total)
      }
    } else {
      setQueryPagination({
        ...queryPagination,
        skip: dataSource.length,
      })
      const result = await getListFoodItem({
        variables: {
          pagination: {
            ...queryPagination,
            skip: dataSource.length,
          },
        },
      })
      if (result.data?.foodItems) {
        setDataSource([...dataSource, ...(result.data?.foodItems?.items ?? [])])
        setHasMore(dataSource.length < result.data.foodItems.total)
      }
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <FloatingBubble
        style={{
          '--initial-position-bottom': '75px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={() => {
          setAddFoodItemVisible(true)
        }}
      >
        <AddCircleOutline fontSize={28} />
      </FloatingBubble>
      <Popup
        visible={addFoodItemVisible}
        onMaskClick={() => {
          setAddFoodItemVisible(false)
        }}
        bodyStyle={{}}
      >
        <Form
          ref={addFoodItemFormRef}
          footer={
            <Button block type="submit" color="primary" size="large">
              Save
            </Button>
          }
          onFinish={async (values: any) => {
            Toast.show({
              icon: 'loading',
              content: 'Loading...',
            })
            const addFoodItemMutation = await addFoodItem({
              variables: {
                createFoodItemInput: {
                  name: values.name,
                  locationId: values.locationId[0],
                  dateEnd: values.dateEnd,
                },
              },
            })
            if (addFoodItemMutation.data) {
              Toast.show({
                icon: 'success',
                content: 'Success',
              })
              addFoodItemFormRef.current?.resetFields()
              setAddFoodItemVisible(false)
              loadMore({
                skip: 0,
              })
            }
          }}
        >
          <Form.Header>Add Food Items</Form.Header>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Name of food" autoComplete="false" />
          </Form.Item>
          <Form.Item
            name="locationId"
            label="Location"
            rules={[{ required: true }]}
          >
            <Selector
              options={
                locations?.locations?.map((location) => {
                  return {
                    label: location.name,
                    value: location.id,
                  }
                }) ?? []
              }
              onChange={(arr, extend) => console.log(arr, extend.items)}
            />
          </Form.Item>
          <Form.Item
            name="dateEnd"
            label="Date End"
            trigger="onConfirm"
            onClick={() => {
              setDateEndVisible(true)
            }}
            rules={[{ required: true }]}
          >
            <DatePicker
              visible={dateEndVisible}
              onClose={() => {
                setDateEndVisible(false)
              }}
            >
              {(value) => {
                return value?.toLocaleDateString() ?? ''
              }}
            </DatePicker>
          </Form.Item>
        </Form>
      </Popup>

      {/**
       * Hiển thị danh sách food items
       */}
      <PullToRefresh
        onRefresh={async () => {
          setQueryPagination({
            ...queryPagination,
            skip: 0,
          })

          const data = await getListFoodItem({
            variables: {
              pagination: {
                ...queryPagination,
                skip: 0,
              },
            },
          })
          if (data?.data?.foodItems) {
            setDataSource(data.data.foodItems.items)
          }
        }}
        pullingText="Pull to refresh"
        refreshingText="Refreshing..."
        completeText="Refresh complete"
        canReleaseText="Release to refresh"
      >
        <List header="Food Items" style={{ width: '100%' }}>
          {dataSource?.map((item) => {
            const dateEndString = new Date(
              item?.dateEnd ?? '',
            ).toLocaleDateString()
            return (
              <SwipeAction
                key={item.id}
                leftActions={[
                  {
                    key: 'EAT',
                    text: 'Eat',
                    onClick: async () => {
                      await updateFoodItem({
                        variables: {
                          updateFoodItemInput: {
                            id: item.id,
                            status: FoodItemStatus.EATEN,
                          },
                        },
                      })
                      const id = dataSource.findIndex(
                        (foodItem) => foodItem?.id === item.id,
                      )
                      const itemUpdate = {
                        ...dataSource[id],
                        status: FoodItemStatus.EATEN.toString(),
                      }
                      const list = dataSource.filter(
                        (foodItem) => foodItem?.id !== item.id,
                      )
                      list.splice(id, 0, itemUpdate)

                      // dataSource[id] = itemUpdate
                      setDataSource(list)
                      Toast.show({
                        icon: 'success',
                        content: 'Eating',
                      })
                    },
                    color: '#1890ff',
                  },
                ]}
                rightActions={[
                  {
                    key: 'DELETE',
                    text: 'Delete',
                    onClick: (e) => {
                      const deleteDialog = Dialog.show({
                        header: 'Confirm delete this?',
                        closeOnAction: false,
                        actions: [
                          [
                            {
                              key: 'cancel',
                              text: 'Cancel',
                            },
                            {
                              key: 'delete',
                              text: 'Delete',
                              bold: true,
                              danger: true,
                              onClick: async () => {
                                await updateFoodItem({
                                  variables: {
                                    updateFoodItemInput: {
                                      id: item.id,
                                      isActive: false,
                                    },
                                  },
                                })
                                setDataSource(
                                  dataSource.filter(
                                    (foodItem) => foodItem.id !== item.id,
                                  ),
                                )
                                deleteDialog.close()
                                Toast.show({
                                  icon: 'success',
                                  content: 'Deleted',
                                })
                              },
                            },
                          ],
                        ],

                        content: `${item.name} - ${item?.location?.name}`,
                      })
                    },
                    color: 'danger',
                  },
                ]}
                onAction={(action, e) => {}}
              >
                <List.Item
                  key={item.id}
                  description={dateEndString}
                  prefix={<GiftOutline />}
                >
                  <span className="text-sm font-bold text-gray-500">
                    {item?.location?.name}
                  </span>
                  <br />
                  <span
                    className={item.status === 'EATEN' ? 'line-through' : ''}
                  >
                    {item?.name}
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

export default FoodItems

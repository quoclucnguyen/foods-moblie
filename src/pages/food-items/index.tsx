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
  const updateFoodItemFormRef = React.useRef<FormInstance>(null)
  const [foodItemUpdate, setFoodItemUpdate] = useState<FoodItemEntity | null>(
    null,
  )
  const [hasMore, setHasMore] = useState(true)
  const [addFoodItemVisible, setAddFoodItemVisible] = useState(false)
  const [updateFoodItemVisible, setUpdateFoodItemVisible] = useState(false)
  const [dateEndVisible, setDateEndVisible] = useState(false)
  const [dataSource, setDataSource] = useState<FoodItemEntity[]>([])
  const [queryPagination, setQueryPagination] = useState<
    FoodItemsPaginationInput
  >({
    take: 10,
  })
  let foodItemForUpdate: FoodItemEntity | null = null
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
      {/**
       * BEGIN form add food item
       */}
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
       * END form add food item
       */}

      {/**
       * BEGIN form update food item
       */}
      <Popup
        visible={updateFoodItemVisible}
        onMaskClick={() => {
          setIsUpdatingFoodItem(false)
          setFoodItemUpdate(null)
          updateFoodItemFormRef.current?.resetFields()
        }}
      >
        <Form
          ref={updateFoodItemFormRef}
          footer={
            <Button block type="submit" color="primary" size="large">
              Save
            </Button>
          }
          onFinishFailed={(error) => {
            console.log(error)
          }}
          onFinish={async (values: any) => {
            console.log(values)

            Toast.show({
              icon: 'loading',
              content: 'Loading...',
            })
            const updateFoodItemMutation = await updateFoodItem({
              variables: {
                updateFoodItemInput: {
                  name: values.name,
                  locationId: values.locationId[0],
                  dateEnd: values.dateEnd,
                  status: values.status ? 'EATEN' : 'NEW',
                  id: foodItemUpdate?.id,
                },
              },
            })
            if (updateFoodItemMutation.data) {
              Toast.show({
                icon: 'success',
                content: 'Success',
              })
              updateFoodItemFormRef.current?.resetFields()
              setIsUpdatingFoodItem(false)
              setFoodItemUpdate(null)
              loadMore({
                skip: 0,
              })
            }
          }}
        >
          <Form.Header>
            Update Food Item {foodItemUpdate ? foodItemUpdate.name ?? '' : ''}
          </Form.Header>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
            initialValue={foodItemUpdate?.name}
          >
            <Input
              placeholder="Name of food"
              autoComplete="false"
              value={foodItemUpdate?.name}
            />
          </Form.Item>
          <Form.Item
            name="locationId"
            label="Location"
            rules={[{ required: true }]}
            initialValue={[foodItemUpdate?.location?.id]}
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
            initialValue={new Date(foodItemUpdate?.dateEnd ?? '')}
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
          <Form.Item
            name="status"
            label="Status"
            initialValue={foodItemUpdate?.status === 'EATEN'}
          >
            <Switch defaultChecked={foodItemUpdate?.status === 'EATEN'} />
          </Form.Item>
        </Form>
      </Popup>

      {/**
       * END form update food item
       */}

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
                leftActions={
                  item.status === FoodItemStatus.EATEN ? [] :
                    [
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
                          setDataSource(list)
                          Toast.show({
                            icon: 'success',
                            content: 'Eating',
                          })
                        },
                        color: 'success',

                      }
                    ]}
                rightActions={[
                  {
                    key: 'UPDATE',
                    text: 'Update',
                    onClick: (e) => {
                      setIsUpdatingFoodItem(true)
                      setFoodItemUpdate(
                        dataSource.find(
                          (foodItem) => foodItem?.id === item.id,
                        ) ?? null,
                      )
                    },
                    color: 'light',
                  },
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
                              onClick: () => {
                                deleteDialog.close()
                              },
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
                onAction={(action, e) => { }}
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

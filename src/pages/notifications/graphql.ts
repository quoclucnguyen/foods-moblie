import { gql } from "@apollo/client";

export const GET_LIST_NOTIFICATION = gql`
query Notifications($pagination: NotificationPagination) {
  notifications(pagination: $pagination) {
    id
    message
    title
    createdAt
    status
    user {
      username
      id
      name
    }
  }
}
`
export const ADD_FOOD_ITEM = gql`
mutation CreateFoodItem($createFoodItemInput: CreateFoodItemInput!) {
  createFoodItem(createFoodItemInput: $createFoodItemInput) {
    id
  }
}
`

export const GET_LIST_LOCATION = gql`
query Locations {
  locations {
    id
    name
  }
}
`

export const UPDATE_FOOD_ITEM = gql`
mutation UpdateFoodItem($updateFoodItemInput: UpdateFoodItemInput!) {
  updateFoodItem(updateFoodItemInput: $updateFoodItemInput) {
    id
    name
  }
}`

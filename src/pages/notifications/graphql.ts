import { gql } from "@apollo/client";

export const GET_LIST_NOTIFICATION = gql`
query Notifications($pagination: NotificationPagination) {
  notifications(pagination: $pagination) {
    total
    items {
      id
      title
      message
      status
      createdAt
      user {
        username
      }
    }
  }
}
`

export const UPDATE_NOTIFICATION = gql`
mutation UpdateNotification($updateNotificationInput: UpdateNotificationInput!) {
  updateNotification(updateNotificationInput: $updateNotificationInput) {
    id
  }
}`

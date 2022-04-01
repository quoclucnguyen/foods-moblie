import { gql } from "@apollo/client";

export const IS_HAS_UN_READ_NOTIFICATION = gql`
query Query {
  isHasUnreadNotification
}`
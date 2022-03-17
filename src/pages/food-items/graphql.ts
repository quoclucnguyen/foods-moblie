import { gql } from "@apollo/client";

export const GET_LIST_FOOD_ITEMS = gql`
query FoodItems($pagination: FoodItemPagination!) {
  foodItems(pagination: $pagination) {
    total
    items {
      id
      createdAt
      name
      dateEnd
      location {
        id
        name
      }
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


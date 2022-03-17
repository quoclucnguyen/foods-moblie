import { QueryPaginationInput, QueryResult, QueryResultEntity } from "../../interfaces";

export interface Location {
    id: string;
    name: string;
}
export interface FoodItemEntity extends QueryResultEntity {
    name?: string;
    dateEnd?: string;
    location?: Location;
}

export interface FoodItemsQueryResultData extends QueryResult {
    items: FoodItemEntity[];
}

export interface FoodItemsQueryResult {
    foodItems: FoodItemsQueryResultData;
}

export interface FoodItemsQueryFilterInput {
    name?: string;
    dateEnd?: Date;
    locationId?: string;
}

export interface FoodItemsPaginationInput extends QueryPaginationInput {
    where?: FoodItemsQueryFilterInput[]
}

export interface LocationQueryResult {
    locations: Location[];
}
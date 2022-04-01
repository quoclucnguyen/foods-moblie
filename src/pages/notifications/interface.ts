import { QueryPaginationInput, QueryResult, QueryResultEntity } from "../../interfaces";

export interface User {
    id: string;
    name: string;
}
export interface NotificationEntity extends QueryResultEntity {
    title?: string;
    message?: string;
    user?: User;
}

export interface NotificationQueryResultData extends QueryResult {
    items: NotificationEntity[];
}

export interface NotificationQueryResult {
    notifications: NotificationQueryResultData;
}

export interface NotificationQueryFilterInput {
    title?: string;
    message?: Date;

}

export interface NotificationPaginationInput extends QueryPaginationInput {
    where?: NotificationQueryFilterInput[]
}


export enum NotificationStatus {
    NEW = 'NEW',
    READ = 'READ'
}
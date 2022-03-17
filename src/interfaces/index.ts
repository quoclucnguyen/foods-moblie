export enum NotificationAlertType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

export interface LoginResult {
    accessToken: string;
    username: string;
    displayName: string
    role: string;
}
export interface UserLogin {
    username: string
    displayName: string
    token: string
    role: string
}
export interface AuthContextType {
    user: UserLogin | null
    signin: (user: UserLogin, callback: VoidFunction) => void
    signout: (callback: VoidFunction) => void
}

export interface QueryResultEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: Boolean;
    status: string;
}

export interface QueryResult {
    total: number;
}

export interface OutletQueryResultEntity {
    id: number
    code: string
    name: string
}
export interface OutletQueryResultData {
    count: number
    entities: OutletQueryResultEntity[]
}
export interface OutletQueryResult {
    outlets: OutletQueryResultData
}

export interface OutletFilterInput {
    code?: string
    name?: string
}

export class FilterOptions<T> {
    public contains?: T
    public value?: T
}

export class FilterOptionsString extends FilterOptions<string> { }

export interface OutletQueryFilerInput {
    code?: FilterOptionsString
    name?: FilterOptionsString
}

export class QueryPaginationInput {
    public take?= 10
    public skip?= 0
}

export interface ItemWithIdAndName {
    id: number
    name: string
}

export interface ChannelItem extends ItemWithIdAndName { }
export interface ChannelQueryResult {
    channels: ChannelItem[]
}

export interface ProvinceItem extends ItemWithIdAndName { }

export interface ProvinceQueryResult {
    provinces: ProvinceItem[]
}

export interface NotificationAlert {
    type: NotificationAlertType;
    title: string;
    message: string;
}

export interface NotificationAlertContextType {
    alert: NotificationAlert | null
    setNotificationAlert: (alert: NotificationAlert, callback: void) => void
}
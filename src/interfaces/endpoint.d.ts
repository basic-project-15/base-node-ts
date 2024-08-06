export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'

export interface MethodAction {
  method: HttpMethod
  action: Actions
}

export interface DataResponse {
  message: string
  data: any
}

export interface Result {
  success: boolean
  message: string
  data: any
}

export interface UserToken {
  _id: string
  email: string
  passwordVersion: number
}

export interface FilterQuery {
  searchQuery: string
  sortField: string
  sortOrder: string
}

export interface PaginationQuery {
  page: number
  limit: number
}

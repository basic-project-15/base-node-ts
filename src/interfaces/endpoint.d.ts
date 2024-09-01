export interface IDataResponse {
  message: string
  data: any
}

export interface IUserToken {
  _id: string
  email: string
  passwordVersion: number
}

export interface IFilterQuery {
  searchQuery: string
  sortField: string
  sortOrder: string
}

export interface IPaginationQuery {
  page: number
  limit: number
}

import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as UserServices from '@securityModule/users/services'

export const getUsers = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { query, t } = req
  try {
    // Get users
    const users = await UserServices.getUsers(
      {
        searchQuery: (query.search as string) || '',
        sortField: (query.sortField as string) || 'description',
        sortOrder: (query.sortOrder as string) || 'asc',
      },
      {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      },
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USERS_LISTED
    dataResponse.data = { users }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

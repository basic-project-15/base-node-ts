import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as RoleServices from '@securityModule/roles/services'

export const getRoles = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { query, t } = req
  try {
    // Get roles
    const roles = await RoleServices.getRoles({
      searchQuery: (query.search as string) || '',
      sortField: (query.sortField as string) || 'description',
      sortOrder: (query.sortOrder as string) || 'asc',
    })

    // Response
    statusCode = 200
    dataResponse.message = t.ROLES_LISTED
    dataResponse.data = { roles }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

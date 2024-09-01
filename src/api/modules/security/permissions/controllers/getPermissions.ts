import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as PermissionServices from '@securityModule/permissions/services'

export const getPermissions = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { t } = req
  try {
    // Get permissions
    const permissions = PermissionServices.getPermissions()

    // Response
    statusCode = 200
    dataResponse.message = t.PERMISSIONS_LISTED
    dataResponse.data = { permissions }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as RoleServices from '@securityModule/roles/services'

export const disableRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t, userToken } = req
  try {
    // Disable role
    const currentIdUser: string = userToken._id
    const idRole: string = params.idRole
    const role = await RoleServices.disableRole(currentIdUser, idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_DISABLED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

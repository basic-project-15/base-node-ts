import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as RoleServices from '@api/security/roles/services'

export const getRoleById = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t } = req
  try {
    // Get role
    const idRole: string = params.idRole
    const role = await RoleServices.getRoleById(idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_FOUND
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

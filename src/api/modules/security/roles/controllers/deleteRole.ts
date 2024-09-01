import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as RoleServices from '@securityModule/roles/services'

export const deleteRole = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t } = req
  try {
    // Delete role
    const idRole: string = params.idRole
    const role = await RoleServices.deleteRole(idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_DELETED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

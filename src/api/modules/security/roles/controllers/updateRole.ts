import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as RoleServices from '@securityModule/roles/services'

export const updateRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Update role
    const currentIdUser: string = userToken._id
    const role = await RoleServices.updateRole(currentIdUser, {
      idRole: params.idRole ?? '',
      name: body.name,
      description: body.description,
      permissions: body.permissions,
      state: body.state,
    })

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_UPDATED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

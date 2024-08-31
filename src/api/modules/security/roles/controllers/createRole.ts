import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as RoleServices from '@securityModule/roles/services'

export const createRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    // Create role
    const currentIdUser: string = userToken._id
    const role = await RoleServices.createRole(currentIdUser, {
      name: body.name,
      description: body.description,
      permissions: body.permissions,
    })

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_CREATED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

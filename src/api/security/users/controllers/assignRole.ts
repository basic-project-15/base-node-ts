import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as UserServices from '@api/security/users/services'

export const assignRole = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Assign role
    const currentIdUser: string = userToken._id
    const idUser: string = body.idUser
    const idRole: string = params.idRole
    const role = await UserServices.assignRole(currentIdUser, idUser, idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_ASSIGN_ROLE
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

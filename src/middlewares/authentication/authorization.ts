import { usersModels } from '@common/models'
import { Roles } from '@common/types'
import { DataResponse, UserToken } from '@interfaces'
import { Request, Response, NextFunction } from 'express'

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dataResponse: DataResponse = {
    message: '',
    data: null,
  }
  const userToken: UserToken = req.user
  if (userToken.role === Roles.SuperAdmin) return next()

  const paths: string[] = req.baseUrl.split('/')
  const path: string = paths[paths.length - 1]
  const method: string = req.method
  const user = await usersModels.findById(userToken.id).exec()
  const permission = user?.permissions.find(
    permission => permission.path === path && permission.method === method,
  )
  if (!permission) {
    dataResponse.message = 'No tiene permisos para realizar esta acción'
    return res.status(403).send(dataResponse)
  }
  return next()
}

export default authorization

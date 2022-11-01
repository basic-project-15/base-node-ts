import { usersModels } from '@common/models'
import { roles } from '@common/types'
import { UserToken } from '@interfaces/token'
import { Request, Response, NextFunction } from 'express'

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userToken: UserToken = req.user
  if (userToken.role === roles.SuperAdmin) return next()

  const paths: string[] = req.baseUrl.split('/')
  const path: string = paths[paths.length - 1]
  const method: string = req.method
  const user = await usersModels.findById(userToken.id).exec()
  const permission = user?.permissions.find(
    permission => permission.path === path && permission.method === method,
  )
  if (!permission) {
    return res.status(403).send({
      message: 'No tiene permisos para realizar esta acción',
      data: null,
    })
  }
  return next()
}

export default authorization

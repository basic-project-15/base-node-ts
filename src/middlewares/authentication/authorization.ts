import { usersAdminModels } from '@common/models'
import { roles } from '@common/types'
import { UserToken } from '@interfaces/token'
import { Request, Response, NextFunction } from 'express'

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user: UserToken = req.user
  if (user.role === roles.SuperAdmin) return next()

  const paths: string[] = req.baseUrl.split('/')
  const path: string = paths[paths.length - 1]
  const method: string = req.method
  const userAdmin = await usersAdminModels.findById(user.id).exec()
  const permission = userAdmin?.permissions.find(
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

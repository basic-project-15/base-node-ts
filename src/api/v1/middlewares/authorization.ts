import { rolesModels } from '@common/models'
import { Roles } from '@common/types'
import { DataResponse, UserToken } from '@interfaces'
import { Request, Response, NextFunction } from 'express'

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const userToken: UserToken = req.userToken
  const { t } = req
  if (userToken.role.type === Roles.SuperAdmin) return next()
  const urlArray: string[] = req.baseUrl.split('/')
  const path: string = urlArray[urlArray.length - 1]
  const action: string = req.method
  const role = await rolesModels.findById(userToken.role._id).exec()
  const permission = role?.permissions.find(
    permission => permission.module === path && permission.action === action,
  )
  if (!permission) {
    dataResponse.message = t('RES_Forbiden')
    return res.status(403).send(dataResponse)
  }
  return next()
}

export default authorization

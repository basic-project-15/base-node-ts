import type { Request, Response, NextFunction } from 'express'
import type { DataResponse, UserToken } from '@interfaces'
import { ROLES } from '@common'
import { MODELS } from '@api/v1'

export const token = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const dataResponse: DataResponse = { message: '', data: null }
  const userToken: UserToken = req.userToken
  const { t } = req
  try {
    if (userToken.role.type === ROLES.SuperAdmin) next()
    const urlArray: string[] = req.baseUrl.split('/')
    const path: string = urlArray[urlArray.length - 1]
    const action: string = req.method
    const role = await MODELS.Roles.findById(userToken.role._id).exec()
    const permission = role?.permissions.find(
      permission => permission.module === path && permission.action === action,
    )
    if (permission == null) {
      dataResponse.message = t('RES_Forbiden')
      return res.status(403).send(dataResponse)
    }
    next()
  } catch (error) {
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

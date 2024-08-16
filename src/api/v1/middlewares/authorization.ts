import type { Request, Response, NextFunction } from 'express'
import type { DataResponse, IRole, UserToken } from '@interfaces'
import { METHOD_ACTIONS, UserModel } from '@common'
import { CustomError, getErrorResponse } from '@core'

interface Access {
  module: string
  section: string
  method: string
}

const verifyPermissions = (roles: IRole[], access: Access) => {
  const methodActions = METHOD_ACTIONS.find(
    item => item.method === access.method,
  )
  const action = methodActions?.action ?? ''
  for (const role of roles) {
    // Get modules
    const modules = role.permissions?.filter(
      item => item.module === access.module,
    )
    for (const module of modules) {
      // Get sections
      const sections = module.sections?.filter(
        item => item.section === access.section,
      )
      for (const section of sections) {
        // Verify action
        if (section.actions.includes(action)) {
          return true
        }
      }
    }
  }
  return false
}

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const userToken: UserToken = req.userToken
  const { t } = req
  try {
    const idUser = userToken._id
    const user = await UserModel.findById(idUser).populate([
      {
        path: 'roleIds',
        select: '_id type permissions',
      },
    ])
    if (user == null) throw CustomError('RES_FORBIDDEN', 403)
    const urlArray: string[] = req.baseUrl.split('/')
    const module: string = urlArray[urlArray.length - 2]
    const section: string = urlArray[urlArray.length - 1]
    const method: string = req.method
    const roles: IRole[] = user.roleIds

    // Check owner permissions
    const isOwnerRole = roles.some(item => item.type === 'owner')
    if (isOwnerRole) {
      next()
      return
    }

    // Check admin permissions
    const hasPermissions = verifyPermissions(roles, { module, section, method })
    if (!hasPermissions) throw CustomError('RES_FORBIDDEN', 403)

    next()
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
    return res.status(statusCode).send(dataResponse)
  }
}

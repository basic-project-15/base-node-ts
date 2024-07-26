import type { Request, Response, NextFunction } from 'express'
import type { DataResponse, IRole, UserToken } from '@interfaces'
import { METHOD_ACTIONS, UserModel } from '@common'

const verifyPermissions = (path: string, method: string, roles: IRole[]) => {
  const methodActions = METHOD_ACTIONS.find(item => item.method === method)
  const typeAction = methodActions?.action ?? ''

  for (const role of roles) {
    // Obtains the permissions for each role and that they match the current module or base path of the endpoint
    const permissions = role.permissions?.filter(item => item.module === path)
    if (permissions != null) {
      for (const permission of permissions) {
        if (permission.action === typeAction) {
          return true
        }
      }
    }
  }
  return false
}

export const AuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const dataResponse: DataResponse = { message: '', data: null }
  const userToken: UserToken = req.userToken
  const { t } = req
  try {
    /** Gets a valid user with their active roles and permissions
     * The user has to exist.
     * The password version has to match the user's current version.
     * The user must be active.
     */
    const userId = userToken._id
    const users = await UserModel.aggregate([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: userId }] },
          passwordVersion: userToken.passwordVersion,
          state: true,
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleIds',
          foreignField: '_id',
          as: 'rolesDetails',
        },
      },
      {
        $addFields: {
          rolesDetails: {
            $filter: {
              input: '$rolesDetails',
              as: 'role',
              cond: { $eq: ['$$role.state', true] },
            },
          },
        },
      },
      {
        $project: {
          roles: {
            $map: {
              input: '$rolesDetails',
              as: 'role',
              in: {
                type: '$$role.type',
                description: '$$role.description',
                permissions: '$$role.permissions',
              },
            },
          },
        },
      },
    ])
    if (users.length === 0) {
      dataResponse.message = t('RES_FORBIDDEN')
      return res.status(403).send(dataResponse)
    }
    const user = users[0]
    const urlArray: string[] = req.baseUrl.split('/')
    const path: string = urlArray[urlArray.length - 1]
    const method: string = req.method
    const roles: IRole[] = user.roles

    // Check owner permissions
    const isOwnerRole = roles.some(item => item.type === 'owner')
    if (isOwnerRole) {
      next()
      return
    }

    // Check admin permissions
    const hasPermissions = verifyPermissions(path, method, roles)
    if (!hasPermissions) {
      dataResponse.message = t('RES_FORBIDDEN')
      return res.status(403).send(dataResponse)
    }

    next()
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    return res.status(500).send(dataResponse)
  }
}

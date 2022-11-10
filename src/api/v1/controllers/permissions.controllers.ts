import { Request, Response } from 'express'
import { permissionsModels, usersModels } from '@common/models'
import { DataResponse, Permission } from '@interfaces'

const getPermissions = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const permissions = await permissionsModels.find().exec()
    const permissionsFormat: Permission[] = permissions.map(permission => ({
      id: permission.id,
      path: permission.path,
      method: permission.method,
    }))
    dataResponse.message = t('Permissions_GetPermissions')
    dataResponse.data = permissionsFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_ServerError')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const createPermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const newPermission: Permission = {
      path: body.path,
      method: body.method,
    }

    // Validations
    const permissionFind = await permissionsModels
      .findOne({ path: newPermission.path, method: newPermission.method })
      .exec()
    if (permissionFind) {
      dataResponse.message = t('Permissions_AlreadyExists')
      return res.status(409).send(dataResponse)
    }

    // Actions
    const permissionModel = new permissionsModels(newPermission)
    await permissionModel.save()
    dataResponse.message = t('Permissions_CreatePermission')
    dataResponse.data = {
      id: permissionModel._id,
      ...newPermission,
    }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_ServerError')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const deletePermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const idPermission: string = req.params.idPermission
  try {
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!permission) {
      dataResponse.message = t('Permissions_NotFound')
      return res.status(404).send(dataResponse)
    }

    // Actions
    /** Remove permission
     * Before removing the permission,
     * the permission is first removed for all users who have it.
     */
    const users = await usersModels.find().exec()
    await Promise.all(
      users.map(async user => {
        const permissionIndex = user.permissions.findIndex(
          permission => permission._id.toString() === idPermission,
        )
        if (permissionIndex >= 0) {
          user.permissions.splice(permissionIndex, 1)
          await user.save()
        }
        return user
      }),
    )
    await permission.remove()
    const permissionFormat: Permission = {
      path: permission.path,
      method: permission.method,
    }
    dataResponse.message = t('Permissions_DeletePermission')
    dataResponse.data = permissionFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_ServerError')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export default { getPermissions, createPermission, deletePermission }

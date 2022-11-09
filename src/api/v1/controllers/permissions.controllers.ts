import { Request, Response } from 'express'
import { permissionsModels, usersModels } from '@common/models'
import { DataResponse, Permission } from '@interfaces'

const getPermissions = async (_req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  try {
    const permissions = await permissionsModels.find().exec()
    const permissionsFormat: Permission[] = permissions.map(permission => ({
      id: permission.id,
      path: permission.path,
      method: permission.method,
    }))
    dataResponse.message = 'Permisos listados'
    dataResponse.data = permissionsFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const createPermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body } = req
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
      dataResponse.message = 'Ya existe un permiso con la misma configuración'
      return res.status(409).send(dataResponse)
    }

    // Actions
    const permissionModel = new permissionsModels(newPermission)
    await permissionModel.save()
    dataResponse.message = 'Permiso creado'
    dataResponse.data = {
      id: permissionModel._id,
      ...newPermission,
    }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const deletePermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const idPermission: string = req.params.idPermission
  try {
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!permission) {
      dataResponse.message = 'Permiso no encontrado'
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
    dataResponse.message = 'Permiso eliminado'
    dataResponse.data = permissionFormat
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export default { getPermissions, createPermission, deletePermission }

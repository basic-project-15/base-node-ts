import { Request, Response } from 'express'
import { permissionsModels } from '@common/models'
import { Permission } from '@interfaces/index'

const getPermissions = async (_req: Request, res: Response) => {
  try {
    const permissions = await permissionsModels.find().exec()
    const permissionsFormat: Permission[] = permissions.map(permission => ({
      id: permission.id,
      path: permission.path,
      method: permission.method,
    }))
    return res.status(200).send({
      message: 'Permisos listados',
      data: permissionsFormat,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const createPermission = async (req: Request, res: Response) => {
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
      return res.status(409).send({
        message: 'Ya existe un permiso con la misma configuración',
        data: null,
      })
    }

    // Actions
    const permissionModel = new permissionsModels(newPermission)
    await permissionModel.save()
    return res.status(200).send({
      message: 'Permiso creado',
      data: {
        id: permissionModel._id,
        ...newPermission,
      },
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

const deletePermission = async (_req: Request, res: Response) => {
  try {
    return res.status(200).send({
      message: 'deletePermissions',
      data: null,
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default { getPermissions, createPermission, deletePermission }

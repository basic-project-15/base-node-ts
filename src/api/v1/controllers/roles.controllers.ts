import { Request, Response } from 'express'
import { DataResponse } from '@interfaces'
import { permissionsModels, rolesModels, usersModels } from '@common/models'
import mongoose from 'mongoose'
import { Roles } from '@common/types'

const getRoles = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const roles = await rolesModels.aggregate([
      {
        $project: {
          id: 1,
          type: 1,
          description: 1,
        },
      },
    ])
    dataResponse.message = t('ROLES_GetRoles')
    dataResponse.data = roles
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

const getRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const idRole: string = req.params.idRole
  try {
    const roleFound = await rolesModels.findById(idRole).exec()

    // Validations
    if (!roleFound) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }

    dataResponse.message = t('ROLES_GetRole')
    dataResponse.data = roleFound
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

const createRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    // Validations
    const roleFound = await rolesModels
      .findOne({ description: body.description })
      .exec()
    if (roleFound) {
      dataResponse.message = t('ROLES_AlreadyExists')
      return res.status(409).send(dataResponse)
    }
    // - No debe existir otro rol con la misma descripción.
    const newRol = {
      type: Roles.Admin,
      description: body.description,
      permissions: [],
    }
    const rolModel = new rolesModels(newRol)
    await rolModel.save()
    dataResponse.message = t('ROLES_CreateRole')
    dataResponse.data = { _id: rolModel.id, ...newRol }
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

const updateRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  const idRole: string = req.params.idRole
  try {
    const roleFoundById = await rolesModels.findById(idRole).exec()
    const roleFoundByDescription = await rolesModels
      .findOne({ description: body.description })
      .exec()

    // Validations
    if (!roleFoundById) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (
      roleFoundByDescription?.description &&
      roleFoundByDescription.description !== roleFoundById?.description
    ) {
      dataResponse.message = t('ROLES_AlreadyExists')
      return res.status(409).send(dataResponse)
    }

    // Actions
    await rolesModels.updateOne(
      { _id: roleFoundById.id },
      { $set: { description: body.description || roleFoundById.description } },
    )

    // Actions
    dataResponse.message = t('ROLES_UpdateRole')
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

const deleteRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const idRole: string = req.params.idRole
  try {
    const roleFound = await rolesModels.findById(idRole).exec()

    // Validations
    if (!roleFound) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }

    const usersWithIdRol = await usersModels.find({ idRole }).exec()
    if (usersWithIdRol.length) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }

    // Actions
    await rolesModels.deleteOne({ _id: new mongoose.mongo.ObjectId(idRole) })
    dataResponse.message = t('ROLES_DeleteRole')
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}

const assignPermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  const idRole: string = req.params.idRole
  const { idPermission } = body
  try {
    const role = await rolesModels.findById(idRole).exec()
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!role) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (!permission) {
      dataResponse.message = t('Permissions_NotFound')
      return res.status(404).send(dataResponse)
    }
    const permissionFind = role.permissions.find(
      permission => permission._id.toString() === idPermission,
    )
    if (permissionFind) {
      dataResponse.message = t('ROLES_AlreadyAssignPermission')
      return res.status(409).send(dataResponse)
    }
    if (role.type === Roles.SuperAdmin) {
      dataResponse.message = t('ROLES_PermissionSuperAdmin')
      return res.status(400).send(dataResponse)
    }

    // Actions
    role.permissions.push({
      _id: permission._id,
      module: permission.module,
      action: permission.action,
    })
    await role.save()
    dataResponse.message = t('ROLES_AssignPermission')
    dataResponse.data = permission
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_ServerError')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

const removePermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  const idRole: string = req.params.idRole
  const { idPermission } = body
  try {
    const role = await rolesModels.findById(idRole).exec()
    const permission = await permissionsModels.findById(idPermission).exec()

    // Validations
    if (!role) {
      dataResponse.message = t('ROLES_NotFound')
      return res.status(404).send(dataResponse)
    }
    if (!permission) {
      dataResponse.message = t('Permissions_NotFound')
      return res.status(404).send(dataResponse)
    }
    const permissionFind = role.permissions.find(
      permission => permission._id.toString() === idPermission,
    )
    if (!permissionFind) {
      dataResponse.message = t('ROLES_AlreadyRemovePermission')
      return res.status(409).send(dataResponse)
    }

    // Actions
    const permissionIndex = role.permissions.findIndex(
      permission => permission._id.toString() === idPermission,
    )
    role.permissions.splice(permissionIndex, 1)
    await role.save()
    dataResponse.message = t('ROLES_RemovePermission')
    dataResponse.data = permission
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_ServerError')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export default {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission,
}

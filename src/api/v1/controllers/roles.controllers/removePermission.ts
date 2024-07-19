import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { RoleModel, PermissionModel } from '@api/v1'

export const removePermission = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, params, t, userToken } = req
  const idRole: string = params.idRole
  const { idPermission } = body
  try {
    const roleFoundById = await RoleModel.findById(idRole)
    const permissionFoundById = await PermissionModel.findById(idPermission)

    if (roleFoundById == null) {
      dataResponse.message = t('ROLE_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }
    if (permissionFoundById == null) {
      dataResponse.message = t('PERMISSION_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }
    const hasPermission = roleFoundById.permissions.some(
      item =>
        item.action === permissionFoundById.action &&
        item.module === permissionFoundById.module,
    )
    if (roleFoundById.type === 'owner') {
      dataResponse.message = t('ROLE_OWNER')
      return res.status(400).send(dataResponse)
    }
    if (!hasPermission) {
      dataResponse.message = t('ROLE_ALREADY_REMOVE_PERMISSION')
      return res.status(409).send(dataResponse)
    }

    const permissionIndex = roleFoundById.permissions.findIndex(
      item =>
        item.action === permissionFoundById.action &&
        item.module === permissionFoundById.module,
    )
    roleFoundById.updated_at = new Date()
    roleFoundById.updated_by = new Types.ObjectId(userToken._id)
    roleFoundById.permissions.splice(permissionIndex, 1)
    await roleFoundById.save()

    dataResponse.message = t('ROLE_REMOVE_PERMISSION')
    dataResponse.data = permissionFoundById
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

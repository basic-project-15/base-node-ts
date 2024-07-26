import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { UserModel, RoleModel } from '@common'

export const removeRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, params, t, userToken } = req
  const idUser: string = params.idUser
  const { idRole } = body

  try {
    const userFoundById = await UserModel.findById(idUser).populate('roleIds')
    const roleFoundById = await RoleModel.findById(idRole)
    const currentUser = await UserModel.findById(userToken._id).populate(
      'roleIds',
    )

    if (userFoundById == null) {
      dataResponse.message = t('USER_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }
    if (roleFoundById == null) {
      dataResponse.message = t('ROLE_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }
    const isOwnerEditUser = userFoundById.roleIds.some(
      role => role.type === 'owner',
    )
    let isOwnerCurrentUser = false
    if (currentUser != null) {
      isOwnerCurrentUser = currentUser.roleIds.some(
        role => role.type === 'owner',
      )
    }
    if (!isOwnerCurrentUser && isOwnerEditUser) {
      dataResponse.message = t('USER_OWNER_EDIT')
      return res.status(400).send(dataResponse)
    }
    const hasRole = userFoundById.roleIds.some(role => role._id.equals(idRole))
    if (!hasRole) {
      dataResponse.message = t('USER_ALREADY_REMOVE_ROLE')
      return res.status(409).send(dataResponse)
    }
    if (userFoundById.id === userToken._id) {
      dataResponse.message = t('USER_CHANGE_YOURSELF')
      return res.status(400).send(dataResponse)
    }

    userFoundById.roleIds = userFoundById.roleIds.filter(
      role => !role._id.equals(idRole),
    )
    userFoundById.updated_at = new Date()
    userFoundById.updated_by = new Types.ObjectId(userToken._id)
    await userFoundById.save()

    dataResponse.message = t('USER_REMOVE_ROLE')
    dataResponse.data = roleFoundById
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

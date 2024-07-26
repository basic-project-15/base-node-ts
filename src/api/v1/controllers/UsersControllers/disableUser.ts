import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { UserModel } from '@common'

export const disableUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { params, t, userToken } = req
  const idUser: string = params.idUser
  try {
    const userFoundById = await UserModel.findById(idUser).populate('roleIds')
    const currentUser = await UserModel.findById(userToken._id).populate(
      'roleIds',
    )

    if (userFoundById == null) {
      dataResponse.message = t('USER_NOT_FOUND')
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
    if (userFoundById.id === userToken._id) {
      dataResponse.message = t('USER_DISABLE_YOURSELF')
      return res.status(400).send(dataResponse)
    }

    userFoundById.updated_at = new Date()
    userFoundById.updated_by = new Types.ObjectId(userToken._id)
    userFoundById.state = false

    await userFoundById.save()
    dataResponse.message = t('USER_DISABLED')
    dataResponse.data = userFoundById
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

import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { UserModel } from '@api'

export const deleteUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t, userToken } = req
  const idUser: string = req.params.idUser
  try {
    const userFoundById = await UserModel.findById(idUser).populate('roleIds')
    const currentUser = await UserModel.findById(userToken._id).populate(
      'roleIds',
    )

    if (userFoundById == null) {
      dataResponse.message = t('USERS_NotFound')
      return res.status(404).send(dataResponse)
    }
    const isOwnerDeleteUser = userFoundById.roleIds.some(
      role => role.type === 'owner',
    )
    let isOwnerCurrentUser = false
    if (currentUser != null) {
      isOwnerCurrentUser = currentUser.roleIds.some(
        role => role.type === 'owner',
      )
    }
    if (!isOwnerCurrentUser && isOwnerDeleteUser) {
      dataResponse.message = t('USER_OWNER_DELETE')
      return res.status(400).send(dataResponse)
    }
    if (userFoundById.id === userToken._id) {
      dataResponse.message = t('USER_DELETE_YOURSELF')
      return res.status(400).send(dataResponse)
    }

    await userFoundById.deleteOne()
    dataResponse.message = t('USER_DELETED')
    dataResponse.data = userFoundById
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

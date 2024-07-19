import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { RoleModel } from '@api/v1'

export const disableRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { params, t, userToken } = req
  const idRole: string = params.idRole
  try {
    const roleFoundById = await RoleModel.findById(idRole)

    if (roleFoundById == null) {
      dataResponse.message = t('ROLE_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }
    if (roleFoundById.type === 'owner') {
      dataResponse.message = t('ROLE_OWNER')
      return res.status(400).send(dataResponse)
    }

    roleFoundById.updated_at = new Date()
    roleFoundById.updated_by = new Types.ObjectId(userToken._id)
    roleFoundById.state = false

    await roleFoundById.save()
    dataResponse.message = t('ROLE_DISABLED')
    dataResponse.data = roleFoundById
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

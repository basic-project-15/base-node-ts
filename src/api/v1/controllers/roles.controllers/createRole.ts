import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse, IRole } from '@interfaces'
import { RoleModel } from '@api/v1'

export const createRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    const roleFoundByDescription = await RoleModel.findOne({
      description: body.description,
    })
    if (roleFoundByDescription != null) {
      dataResponse.message = t('ROLE_ALREADY_EXISTS')
      return res.status(409).send(dataResponse)
    }

    const newRol: IRole = {
      type: 'admin',
      description: body.description,
      permissions: [],
      created_at: new Date(),
      created_by: new Types.ObjectId(userToken._id),
      state: true,
    }
    const rolModel = new RoleModel(newRol)
    await rolModel.save()
    dataResponse.message = t('ROLE_CREATED')
    dataResponse.data = { _id: rolModel.id, ...newRol }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

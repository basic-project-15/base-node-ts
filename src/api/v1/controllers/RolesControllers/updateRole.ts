import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { RoleModel } from '@common'

export const updateRole = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, params, t, userToken } = req
  const idRole: string = params.idRole
  try {
    const roleFoundById = await RoleModel.findById(idRole)
    const roleFoundByDescription = await RoleModel.findOne({
      description: body.description,
    })

    if (roleFoundById == null) {
      dataResponse.message = t('ROLE_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }
    if (roleFoundById.type === 'owner') {
      dataResponse.message = t('ROLE_OWNER')
      return res.status(400).send(dataResponse)
    }
    if (
      roleFoundByDescription != null &&
      roleFoundByDescription.id !== idRole
    ) {
      dataResponse.message = t('ROLE_ALREADY_EXISTS')
      return res.status(409).send(dataResponse)
    }

    roleFoundById.description = body.description ?? roleFoundById.description
    roleFoundById.updated_at = new Date()
    roleFoundById.updated_by = new Types.ObjectId(userToken._id)
    roleFoundById.state = body.state ?? roleFoundById.state

    await roleFoundById.save()
    dataResponse.message = t('ROLE_UPDATED')
    dataResponse.data = roleFoundById
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

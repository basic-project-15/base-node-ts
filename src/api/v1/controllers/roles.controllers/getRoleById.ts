import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { RoleModel } from '@api/v1'

export const getRoleById = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { params, t } = req
  const idRole: string = params.idRole
  try {
    const roleFoundById = await RoleModel.findById(idRole).populate([
      {
        path: 'created_by',
        select: '_id email',
      },
      {
        path: 'updated_by',
        select: '_id email',
      },
    ])
    if (roleFoundById == null) {
      dataResponse.message = t('ROLE_NOT_FOUND')
      return res.status(404).send(dataResponse)
    }

    dataResponse.message = t('ROLE_FOUND')
    dataResponse.data = roleFoundById
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

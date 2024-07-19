import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { RoleModel } from '@api/v1'

export const getRoles = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const roles = await RoleModel.aggregate([
      {
        $project: {
          id: 1,
          type: 1,
          description: 1,
          state: 1,
        },
      },
    ])
    dataResponse.message = t('ROLES_LISTED')
    dataResponse.data = roles
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

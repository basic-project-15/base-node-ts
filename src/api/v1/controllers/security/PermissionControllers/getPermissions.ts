import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { PermissionModel } from '@common'

export const getPermissions = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const permissions = await PermissionModel.find()
    dataResponse.message = t.PERMISSIONS_LISTED
    dataResponse.data = permissions
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

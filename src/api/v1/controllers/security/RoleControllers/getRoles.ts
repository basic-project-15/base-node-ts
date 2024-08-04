import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { RoleModel } from '@common'

export const getRoles = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req

  const searchQuery = (req.query.search as string) || ''
  const sortField = (req.query.sortField as string) || 'description'
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1

  try {
    const roles = await RoleModel.aggregate([
      {
        $match: {
          $or: [
            { type: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          id: 1,
          type: 1,
          description: 1,
          state: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
    ])
    dataResponse.message = t.ROLES_LISTED
    dataResponse.data = roles
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

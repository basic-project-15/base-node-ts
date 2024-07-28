import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { UserModel } from '@common'

export const getUsers = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req

  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  const searchQuery = (req.query.search as string) || ''
  const sortField = (req.query.sortField as string) || 'firstName'
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1

  try {
    const matchStage = {
      $match: {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { phoneNumber: { $regex: searchQuery, $options: 'i' } },
        ],
      },
    }

    const users = await UserModel.aggregate([
      matchStage,
      {
        $project: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          state: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ])

    const totalUsers = await UserModel.countDocuments(matchStage.$match)

    dataResponse.message = t.USERS_LISTED
    dataResponse.data = {
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    }

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

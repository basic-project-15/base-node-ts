import { UserModel } from '@models'
import type { IFilterQuery, IPaginationQuery } from '@interfaces'

export const getUsers = async (
  filters: IFilterQuery,
  pagination: IPaginationQuery,
) => {
  // Get filters
  const { searchQuery, sortField, sortOrder } = filters
  const order = sortOrder === 'desc' ? -1 : 1
  const { page, limit } = pagination
  const skip = (page - 1) * limit
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

  // Get users
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
    { $sort: { [sortField]: order } },
    { $skip: skip },
    { $limit: limit },
  ])

  // Get users quantity
  const totalUsers = await UserModel.countDocuments(matchStage.$match)

  return { totalUsers, users }
}

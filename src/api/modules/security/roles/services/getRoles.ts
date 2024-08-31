import { RoleModel } from '@common'
import type { FilterQuery } from '@interfaces'

export const getRoles = async (filters: FilterQuery) => {
  // Get roles
  const { searchQuery, sortField, sortOrder } = filters
  const order = sortOrder === 'desc' ? -1 : 1
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
        name: 1,
        description: 1,
        state: 1,
      },
    },
    { $sort: { [sortField]: order } },
  ])

  return roles
}

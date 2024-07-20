import type { Request, Response } from 'express'
import { compare } from 'bcrypt'
import type { DataResponse } from '@interfaces'
import { jwt } from '@config'
import { UserModel } from '@api'

export const login = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const users = await UserModel.aggregate([
      {
        $match: { email: body.email, state: true },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleIds',
          foreignField: '_id',
          as: 'rolesDetails',
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          surname: 1,
          userName: 1,
          email: 1,
          phoneNumber: 1,
          password: 1,
          passwordVersion: 1,
          photo: 1,
          roleIds: 1,
          roles: {
            $map: {
              input: '$rolesDetails',
              as: 'role',
              in: {
                type: '$$role.type',
                description: '$$role.description',
                permissions: '$$role.permissions',
              },
            },
          },
        },
      },
    ])

    if (users.length === 0) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }
    const user = users[0]
    const checkPassword = await compare(body.password, user.password)
    if (!checkPassword) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }

    delete user.password
    const token = jwt.generateToken({
      _id: user._id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    dataResponse.message = t('USER_AUTHENTICATED')
    dataResponse.data = { user, token }
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

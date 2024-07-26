import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import type { DataResponse } from '@interfaces'
import { jwt } from '@config'
import { GOOGLE_CLIENT_ID, UserModel } from '@common'

const client = new OAuth2Client(GOOGLE_CLIENT_ID)

export const googleRegister = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const ticket = await client.verifyIdToken({
      idToken: body.idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }

    const email = payload.email
    const users = await UserModel.aggregate([
      {
        $match: { email, state: true },
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
          firstName: 1,
          lastName: 1,
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

    delete user.password
    const token = jwt.generateAccessToken({
      _id: user._id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    dataResponse.message = t('USER_AUTHENTICATED')
    dataResponse.data = { user, token }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse, SendEmails } from '@core'
import { UserHandlers } from '@api/v1'

export const getUsers = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { query, t } = req
  try {
    // Get users
    const users = await UserHandlers.getUsers(
      {
        searchQuery: (query.search as string) || '',
        sortField: (query.sortField as string) || 'description',
        sortOrder: (query.sortOrder as string) || 'asc',
      },
      {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      },
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USERS_LISTED
    dataResponse.data = { users }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const getUserById = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t } = req
  try {
    // Get user
    const idUser: string = params.idUser
    const user = await UserHandlers.getUserById(idUser)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_FOUND
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const createUser = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken, lng } = req
  try {
    // Create user
    const currentIdUser: string = userToken._id
    const { user, temporaryPassword } = await UserHandlers.createUser(
      currentIdUser,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    )

    // Send Email
    await SendEmails.createAccount(
      lng,
      {
        name: user?.firstName,
        email: user.email,
      },
      temporaryPassword,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_CREATED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const updateUser = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Update user
    const currentIdUser: string = userToken._id
    const idUser: string = params.idUser
    const user = await UserHandlers.updateUser(currentIdUser, {
      idUser,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      state: body.state,
    })

    // Response
    statusCode = 200
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const disableUser = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t, userToken } = req
  try {
    // Disable user
    const currentIdUser: string = userToken._id
    const idUser: string = params.idUser
    const user = await UserHandlers.disableUser(currentIdUser, idUser)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_DISABLED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const unlockedUser = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t, userToken } = req
  try {
    // Disable user
    const currentIdUser: string = userToken._id
    const idUser: string = params.idUser
    const user = await UserHandlers.unlockedUser(currentIdUser, idUser)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_UNLOCKED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const deleteUser = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t, userToken } = req
  try {
    // Delete user
    const currentIdUser: string = userToken._id
    const idUser: string = params.idUser
    const user = await UserHandlers.deleteUser(currentIdUser, idUser)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_DELETED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const assignRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Assign role
    const currentIdUser: string = userToken._id
    const idUser: string = body.idUser
    const idRole: string = params.idRole
    const role = await UserHandlers.assignRole(currentIdUser, idUser, idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_ASSIGN_ROLE
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const removeRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Remove role
    const currentIdUser: string = userToken._id
    const idUser: string = body.idUser
    const idRole: string = params.idRole
    const role = await UserHandlers.removeRole(currentIdUser, idUser, idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_REMOVE_ROLE
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

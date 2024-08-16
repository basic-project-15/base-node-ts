import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import { RoleHandlers } from '@api/v1'

export const getRoles = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { query, t } = req
  try {
    // Get roles
    const roles = await RoleHandlers.getRoles({
      searchQuery: (query.search as string) || '',
      sortField: (query.sortField as string) || 'description',
      sortOrder: (query.sortOrder as string) || 'asc',
    })

    // Response
    statusCode = 200
    dataResponse.message = t.ROLES_LISTED
    dataResponse.data = { roles }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const getRoleById = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t } = req
  try {
    // Get role
    const idRole: string = params.idRole
    const role = await RoleHandlers.getRoleById(idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_FOUND
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const createRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    // Create role
    const currentIdUser: string = userToken._id
    const role = await RoleHandlers.createRole(currentIdUser, {
      name: body.name,
      description: body.description,
      permissions: body.permissions,
    })

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_CREATED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const updateRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Update role
    const currentIdUser: string = userToken._id
    const role = await RoleHandlers.updateRole(currentIdUser, {
      idRole: params.idRole ?? '',
      name: body.name,
      description: body.description,
      permissions: body.permissions,
      state: body.state,
    })

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_UPDATED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const disableRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t, userToken } = req
  try {
    // Disable role
    const currentIdUser: string = userToken._id
    const idRole: string = params.idRole
    const role = await RoleHandlers.disableRole(currentIdUser, idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_DISABLED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const deleteRole = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t } = req
  try {
    // Delete role
    const idRole: string = params.idRole
    const role = await RoleHandlers.deleteRole(idRole)

    // Response
    statusCode = 200
    dataResponse.message = t.ROLE_DELETED
    dataResponse.data = { role }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
